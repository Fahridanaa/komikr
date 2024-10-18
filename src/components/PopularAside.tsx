import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComicCardLite from "./ComicCardLite";
import cek from "@/assets/comics/kaoru-hana-wa-rin-to-saku/cover.jpg";

export default function PopularAside() {
	return (
		<aside className="hidden max-w-72 relative flex-1 md:block">
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
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ranking) => (
								<ComicCardLite
									key={ranking}
									ranking={ranking}
									comic={cek}
								/>
							))}
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
