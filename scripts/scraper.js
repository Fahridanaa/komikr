import * as cheerio from 'cheerio';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMICS_DIR = path.resolve(__dirname, 'comics');
const ASSETS_DIR = path.resolve(COMICS_DIR, 'assets');

async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('finish', resolve)
            .on('error', reject);
    });
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

        // Save comic metadata as JSON file
        const jsonFilePath = path.join(COMICS_DIR, `${comicSlug}.json`);
        console.log('Saving comic metadata to:', jsonFilePath);
        await fs.writeFile(jsonFilePath, JSON.stringify(comicMeta, null, 2), 'utf-8');

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

        const images = $('.chapter-images img').map((_, el) => $(el).attr('src')).get();

        const chapterNum = url.match(/chapter-(\d+)/)[1];
        const chapterDir = path.join(ASSETS_DIR, comicSlug, `chapter-${chapterNum}`);
        await fs.mkdir(chapterDir, { recursive: true });

        // Download all images in the chapter
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
        // await fs.mkdir(ASSETS_DIR, { recursive: true });

        const comicUrl = 'https://komikcast.cz/komik/myst-might-mayhem/';
        const comicSlug = await scrapeComicMeta(comicUrl);

        // if (comicSlug) {
        //     // Scrape first 3 chapters as an example
        //     for (let i = 1; i <= 3; i++) {
        //         const chapterUrl = `${comicUrl}/chapter-${i}`;
        //         await scrapeChapterImages(chapterUrl, comicSlug);
        //     }
        // }
    } catch (error) {
        console.error('Scraping failed:', error.message);
    }
}

main();
