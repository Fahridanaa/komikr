import { Badge } from "@/components/ui/badge";

interface GenreListProps {
	genres: string[];
}

export function GenreList({ genres }: GenreListProps) {
	return (
		<div className="space-y-2">
			<h2 className="font-semibold">Genres</h2>
			<div className="flex flex-wrap gap-2">
				{genres.map((genre) => (
					<Badge key={genre} variant="secondary">
						{genre}
					</Badge>
				))}
			</div>
		</div>
	);
}
