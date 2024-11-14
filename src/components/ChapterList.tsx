import { formatRelativeTime, getChapterCount } from "@/utils/helpers";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Clock, BookOpen } from "lucide-react";

interface ChapterListProps {
	slug: string;
}

export function ChapterList({ slug }: ChapterListProps) {
	const totalChapters = getChapterCount(slug);

	const chapters = Array.from({ length: totalChapters }, (_, i) => ({
		number: totalChapters - i,
		date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
	}));

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold flex items-center gap-2">
					<BookOpen className="w-5 h-5" />
					Chapter List
				</h2>
				<Button variant="outline" size="sm">
					Sort
				</Button>
			</div>

			<ScrollArea className="h-[600px] rounded-md border p-4">
				<div className="space-y-4">
					{chapters.map((chapter) => (
						<a
							key={chapter.number}
							href={`/comics/${slug}/chapter-${chapter.number
								.toString()
								.padStart(2, "0")}`}
							className="block"
						>
							<div className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors">
								<div className="flex items-center gap-3">
									<span className="font-medium group-hover:text-primary transition-colors">
										Chapter {chapter.number}
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Clock className="w-4 h-4" />
									<span>
										{formatRelativeTime(chapter.date)}
									</span>
								</div>
							</div>
						</a>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
