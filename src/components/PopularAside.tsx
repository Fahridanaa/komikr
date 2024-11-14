import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComicMeta } from "@/models/comic";
import { lowerCaseKebab } from "@/utils/helpers";

interface PopularAsideProps {
	comics: ComicMeta[];
}

export default function PopularAside({ comics }: PopularAsideProps) {
	return (
		<aside className="hidden md:block flex-1 max-w-72 space-y-2">
			<h2 className="text-xl font-medium">Popular Comics</h2>
			<Tabs defaultValue="weekly">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="weekly">Weekly</TabsTrigger>
					<TabsTrigger value="monthly">Monthly</TabsTrigger>
					<TabsTrigger value="all">All Time</TabsTrigger>
				</TabsList>
				<Card>
					<CardContent className="p-0">
						<TabsContent value="weekly" className="mt-0">
							<PopularList comics={comics} />
						</TabsContent>
						<TabsContent value="monthly" className="mt-0">
							<PopularList comics={comics} />
						</TabsContent>
						<TabsContent value="all" className="mt-0">
							<PopularList comics={comics} />
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</aside>
	);
}

function PopularList({ comics }: { comics: ComicMeta[] }) {
	return (
		<div className="divide-y">
			{comics.slice(0, 5).map((comic, index) => (
				<article key={comic.title} className="relative p-4">
					<div className="absolute right-4 top-0">
						<span className="bg-primary text-primary-foreground px-2 py-1 text-sm font-bold rounded-b">
							{index + 1}
						</span>
					</div>

					<a
						href={`/comics/${lowerCaseKebab(comic.title)}`}
						className="flex gap-4 group"
					>
						<img
							src={`/assets/comics/${lowerCaseKebab(
								comic.title
							)}/cover.jpg`}
							alt={comic.title}
							className="w-20 h-28 object-cover rounded"
						/>
						<div className="flex-1">
							<h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
								{comic.title}
							</h3>
							<p className="text-sm text-muted-foreground mt-1">
								{comic.genres.slice(0, 3).join(", ")}
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								{new Date(comic.release).getFullYear()}
							</p>
						</div>
					</a>
				</article>
			))}
		</div>
	);
}
