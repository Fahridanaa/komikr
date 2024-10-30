import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComicMeta } from "@/models/comic";
import ComicOverviewList from "./ComicOverviewList";

export default function PopularAside({ comics }: { comics: ComicMeta[] }) {
	return (
		<aside className="hidden min-h-80 max-w-72 relative flex-1 md:block">
			<h2 className="text-xl font-medium mb-1">Popular</h2>
			<Tabs defaultValue="weekly">
				<TabsList className="grid w-full grid-cols-3 mb-1">
					<TabsTrigger value="weekly" className="group">
						<span className="group-hover:text-blue-400">
							Weekly
						</span>
					</TabsTrigger>
					<TabsTrigger value="month" className="group">
						<span className="group-hover:text-blue-400">Month</span>
					</TabsTrigger>
					<TabsTrigger value="all" className="group">
						<span className="group-hover:text-blue-400">All</span>
					</TabsTrigger>
				</TabsList>
				<Card className="overflow-hidden">
					<CardContent className="p-0">
						<TabsContent value="weekly" className="mt-0">
							<ComicOverviewList comics={comics} />
						</TabsContent>
						<TabsContent value="month">
							<h3>Ini Month!</h3>
						</TabsContent>
						<TabsContent value="all">
							<h3>Ini All!</h3>
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</aside>
	);
}
