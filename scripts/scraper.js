import * as cheerio from 'cheerio';
import axios from 'axios';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '..', 'src');
const COMICS_DIR = path.resolve(SRC_DIR, 'content', 'comics');
const ASSETS_DIR = path.resolve(SRC_DIR, 'assets', 'comics');

// Function to download images with retries
const downloadImage = async (url, filepath, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios({
                url,
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://komikcast.cz/',
                    'Accept': 'image/*',
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
            if (attempt === retries - 1) throw error;
            console.log(`Retry ${attempt + 1}/${retries} for ${url}`);
            await new Promise(res => setTimeout(res, 1000 * (attempt + 1))); // Exponential backoff
        }
    }
};

// Function to fetch data with decompression handling
const fetchData = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = response.headers['content-encoding']
        ? zlib.decompressSync(response.data)
        : response.data;

    return data.toString();
};

// Function to save comic metadata
const saveComicMetadata = async (comicMeta, comicSlug) => {
    const jsonFilePath = path.join(COMICS_DIR, `${comicSlug}.json`);

    try {
        await fs.access(jsonFilePath);
        console.log('Comic metadata already exists:', jsonFilePath);
    } catch {
        console.log('Saving comic metadata to:', jsonFilePath);
        await fs.writeFile(jsonFilePath, JSON.stringify(comicMeta, null, 2), 'utf-8');
    }
};

// Function to extract comic metadata
const extractComicMeta = ($) => ({
    title: $('.komik_info-content-body-title').text().replace(/bahasa\s+indonesia/i, '').trim(),
    nativeTitle: $('.komik_info-content-native').text().trim(),
    genres: $('.komik_info-content-genre a').map((_, el) => $(el).text().trim()).get(),
    release: $('.komik_info-content-info-release').text().replace('Released:', '').trim(),
    author: $('.komik_info-content-info:contains("Author:")').text().replace('Author:', '').trim(),
    status: $('.komik_info-content-info:contains("Status:")').text().replace('Status:', '').trim(),
    type: $('.komik_info-content-info-type a').text().trim(),
    updatedOn: $('.komik_info-content-update time').attr('datetime'),
    synopsis: $('.komik_info-description-sinopsis').text().trim(),
});

// Function to create a slug from the title
const createSlug = (title) =>
    title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

const handleCoverImage = async (coverImageUrl, coverDir, coverPath) => {
    try {
        await fs.mkdir(coverDir, { recursive: true });
        await fs.access(coverPath);
        console.log('Cover image already exists:', coverPath);
    } catch {
        await downloadImage(coverImageUrl, coverPath);
        console.log('Cover image downloaded successfully');
    }
};

// Main function to scrape comic metadata and chapters
const scrapeComicMeta = async (url) => {
    try {
        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const comicMeta = extractComicMeta($);
        const comicSlug = createSlug(comicMeta.title);

        const coverDir = path.join(ASSETS_DIR, comicSlug);
        const coverPath = path.join(coverDir, 'cover.jpg');

        await handleCoverImage(comicMeta.coverImageUrl || '', coverDir, coverPath);

        return { comicSlug, comicMeta };
    } catch (error) {
        console.error('Failed to scrape comic meta:', error.message);
        return null;
    }
};

// Function to scrape chapter images
const scrapeChapterImages = async (url, comicSlug) => {
    try {
        const chapterNumMatch = url.match(/chapter-(\d+)/);
        if (!chapterNumMatch) throw new Error("Invalid chapter URL");

        const chapterNum = chapterNumMatch[1];
        const chapterDir = path.join(ASSETS_DIR, comicSlug, `chapter-${chapterNum}`);

        try {
            await fs.access(chapterDir);
            console.log(`Chapter ${chapterNum} already exists.`);
            return;
        } catch {
            await fs.mkdir(chapterDir, { recursive: true });
        }

        const data = await fetchData(url);
        const $ = cheerio.load(data);

        const images = $('#chapter_body>.main-reading-area img').map((_, el) => $(el).attr('src')).get();

        await Promise.all(images.map((imageUrl, index) =>
            downloadImage(imageUrl, path.join(chapterDir, `${String(index + 1).padStart(3, '0')}.jpg`))
        ));
    } catch (error) {
        console.error('Failed to scrape chapter:', error.message);
    }
};

// Main execution function
const main = async () => {
    try {
        await fs.mkdir(COMICS_DIR, { recursive: true });
        await fs.mkdir(ASSETS_DIR, { recursive: true });

        const baseComicUrl = 'https://komikcast.cz/';

        // ini diganti sesuai judul komik yang mau di scrape
        const title = 'myst-might-mayhem';

        const comicUrl = `${baseComicUrl}komik/${title}/`;

        const { comicSlug, comicMeta } = await scrapeComicMeta(comicUrl);

        if (comicMeta && comicSlug) {
            await saveComicMetadata(comicMeta, comicSlug);

            await Promise.all(
                Array.from({ length: 3 }, (_, i) =>
                    scrapeChapterImages(`${baseComicUrl}chapter/${comicSlug}-chapter-0${i + 1}-bahasa-indonesia/`, comicSlug)
                )
            );
        }
    } catch (error) {
        console.error('Scraping failed:', error.message);
    }
};

main();
