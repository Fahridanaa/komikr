import fs from 'fs';
import path from 'path';

export function getChapterCount(comicId: string): number {
  const comicPath = path.join(process.cwd(), 'src', 'assets', 'comics', comicId);

  try {
    // Get all directories that match "chapter-*" pattern
    const files = fs.readdirSync(comicPath);
    const chapterDirs = files.filter(file =>
      fs.statSync(path.join(comicPath, file)).isDirectory() &&
      /^chapter-\d+$/.test(file)
    );

    return chapterDirs.length;
  } catch (error) {
    console.error(`Error counting chapters for ${comicId}:`, error);
    return 0;
  }
}

export function getChapterImageCount(comicId: string, chapterNumber: number): number {
  const chapterPath = path.join(
    process.cwd(),
    'src',
    'assets',
    'comics',
    comicId,
    `chapter-${String(chapterNumber).padStart(2, "0")}`
  );

  try {
    const files = fs.readdirSync(chapterPath);
    return files.filter(file => /\.(jpg|jpeg|png)$/i.test(file)).length;
  } catch (error) {
    console.error(`Error counting images for chapter ${chapterNumber}:`, error);
    return 0;
  }
}

export const lowerCaseKebab = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
};
