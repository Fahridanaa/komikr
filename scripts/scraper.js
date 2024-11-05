import * as cheerio from 'cheerio';
import axios from 'axios';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs'
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMICS_DIR = path.resolve(__dirname, 'comics');
const ASSETS_DIR = path.resolve(COMICS_DIR, 'assets');

async function downloadImage(url, filepath, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios({
                url,
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://komikcast.cz/',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                timeout: 5000
            });

            return new Promise((resolve, reject) => {
                response.data.pipe(createWriteStream(filepath))
                    .on('finish', resolve)
                    .on('error', reject);
            });
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry ${i + 1}/${retries} for ${url}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
    }
}

async function fetchData(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    let data = response.data;

    if (response.headers['content-encoding'] === 'br') {
        data = zlib.brotliDecompressSync(data);
    } else if (response.headers['content-encoding'] === 'gzip') {
        data = zlib.gunzipSync(data);
    } else if (response.headers['content-encoding'] === 'deflate') {
        data = zlib.inflateSync(data);
    }

    return data.toString();
}

async function scrapeComicMeta(url) {
    try {
        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const title = $('.komik_info-content-body-title').text().replace(/bahasa\s+indonesia/i, '').trim();
        const nativeTitle = $('.komik_info-content-native').text().trim();
        const genres = $('.komik_info-content-genre a').map((_, el) => $(el).text().trim()).get();
        const release = $('.komik_info-content-info-release').text().replace('Released:', '').trim();
        const author = $('.komik_info-content-info:contains("Author:")').text().replace('Author:', '').trim();
        const status = $('.komik_info-content-info:contains("Status:")').text().replace('Status:', '').trim();
        const type = $('.komik_info-content-info-type a').text().trim();
        const updatedOn = $('.komik_info-content-update time').attr('datetime');
        const synopsis = $('.komik_info-description-sinopsis').text().trim();
        const coverImage = $('.komik_info-cover-image img').attr('src');

        const comicSlug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        const comicMeta = {
            title,
            nativeTitle,
            genres,
            release,
            author,
            status,
            type,
            updatedOn,
            synopsis,
            coverImage,
        };

        console.log(comicMeta);

        const jsonFilePath = path.join(COMICS_DIR, `${comicSlug}.json`);
        try {
            await fs.access(jsonFilePath);
            console.log('Comic metadata already exists, skipping:', jsonFilePath);
        } catch (error) {
            // File doesn't exist, proceed with writing
            console.log('Saving comic metadata to:', jsonFilePath);
            await fs.writeFile(jsonFilePath, JSON.stringify(comicMeta, null, 2), 'utf-8');
        }

        return comicSlug;
    } catch (error) {
        console.error('Failed to scrape comic meta:', error.message);
        return null;
    }
}

async function scrapeChapterImages(url, comicSlug) {
    try {
        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const images = $('#chapter_body>.main-reading-area img').map((_, el) => $(el).attr('src')).get();

        const chapterNum = url.match(/chapter-(\d+)/)[1];
        const chapterDir = path.join(ASSETS_DIR, comicSlug, `chapter-${chapterNum}`);
        await fs.mkdir(chapterDir, { recursive: true });

        for (let [index, imageUrl] of images.entries()) {
            const imageNum = String(index + 1).padStart(3, '0');
            await downloadImage(imageUrl, path.join(chapterDir, `${imageNum}.jpg`));
        }
    } catch (error) {
        console.error('Failed to scrape chapter:', error.message);
    }
}

async function main() {
    try {
        await fs.mkdir(COMICS_DIR, { recursive: true });
        await fs.mkdir(ASSETS_DIR, { recursive: true });

        const comicUrl = 'https://komikcast.cz/komik/myst-might-mayhem/';
        const comicSlug = await scrapeComicMeta(comicUrl);

        if (comicSlug) {
            // Scrape first 3 chapters as an example
            for (let i = 1; i <= 3; i++) {
                const chapterUrl = `https://komikcast.cz/chapter/myst-might-mayhem-chapter-0${i}-bahasa-indonesia/`;
                await scrapeChapterImages(chapterUrl, comicSlug);
            }
        }
    } catch (error) {
        console.error('Scraping failed:', error.message);
    }
}

main();
