import React from "react";
import type { ComicMeta } from "@/models/comic";

interface ComicOverviewListProps {
	comics: ComicMeta[];
}

const ComicOverviewList: React.FC<ComicOverviewListProps> = ({ comics }) => {
	return (
		<div className="relative flex flex-col justify-center p-2">
			{comics.map((comic, index) => (
				<div
					key={index}
					className="relative flex gap-2 border-b-2 pb-2 mb-2"
				>
					<div className="absolute right-0 -top-2">
						<span className="rounded-b-xl bg-blue-400 px-2 py-1 text-white font-bold">
							{index + 1}
						</span>
					</div>
					<div className="flex items-center justify-center">
						<figure className="overflow-hidden rounded-md max-w-24 h-auto">
							<img
								src={`/src/assets/comics/${comic.title
									.toLowerCase()
									.replace(/\s/g, "-")}/cover.jpg`}
								alt="comic"
								className="object-cover object-center w-full h-full"
							/>
						</figure>
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-md">{comic.title}</h3>
						<p className="text-sm">
							<span className="text-muted-foreground">
								Genres:
							</span>{" "}
							{comic.genres.join(", ")}
						</p>
						<p className="text-sm text-muted-foreground">
							{new Date(comic.release).getFullYear()}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default ComicOverviewList;
