import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ComicMeta } from "@/models/comic";
import { lowerCaseKebab } from "@/utils/helpers";
import { Badge } from "./ui/badge";

interface CarouselPageProps {
	comics: ComicMeta[];
}

export default function CarouselPage({ comics }: CarouselPageProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		const autoSlideInterval = setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext();
			} else {
				api.scrollTo(0);
			}
		}, 8000);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});

		return () => clearInterval(autoSlideInterval);
	}, [api]);

	const handleDotClick = useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api]
	);

	return (
		<div className="hidden w-full md:block">
			<Carousel setApi={setApi} className="w-full">
				<CarouselContent>
					{comics.map((comic, index) => (
						<CarouselItem key={index}>
							<FeaturedComic comic={comic} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<CarouselDots
				count={count}
				current={current}
				onClick={handleDotClick}
			/>
		</div>
	);
}

function FeaturedComic({ comic }: { comic: ComicMeta }) {
	const coverPath = `/assets/comics/${lowerCaseKebab(comic.title)}/cover.jpg`;

	return (
		<Card className="relative overflow-hidden">
			<CardContent className="relative flex h-[400px] p-0">
				<div className="absolute inset-0">
					<img
						src={coverPath}
						alt=""
						className="w-full h-full object-cover brightness-[0.2] blur-sm"
					/>
				</div>

				<div className="relative flex w-full p-8 text-white z-10">
					<div className="flex-1 space-y-4">
						<div>
							<h2 className="text-2xl font-semibold hover:text-primary transition-colors">
								<a
									href={`/comics/${lowerCaseKebab(
										comic.title
									)}`}
								>
									{comic.title}
								</a>
							</h2>
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-yellow-400" />
								<span>9.84</span>
							</div>
							<Badge variant="default" className="mt-2">
								{comic.type}
							</Badge>
							<p className="text-muted-foreground mt-1">
								{comic.genres.join(", ")}
							</p>
						</div>

						<div className="space-y-2">
							<h4 className="font-semibold">Synopsis</h4>
							<p className="line-clamp-4 text-muted-foreground">
								{comic.synopsis}
							</p>
						</div>

						<div className="space-y-1 text-sm">
							<p>
								<span className="font-semibold">Status:</span>{" "}
								{comic.status}
							</p>
							<p>
								<span className="font-semibold">Author:</span>{" "}
								{comic.author}
							</p>
						</div>
					</div>

					<div className="ml-8 flex-shrink-0">
						<a
							href={`/comics/${lowerCaseKebab(comic.title)}`}
							className="block"
						>
							<img
								src={coverPath}
								alt={comic.title}
								className="w-48 h-60 object-cover rounded-lg hover:scale-105 transition-transform"
							/>
						</a>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CarouselDots({
	count,
	current,
	onClick,
}: {
	count: number;
	current: number;
	onClick: (index: number) => void;
}) {
	return (
		<div className="flex justify-end gap-2 mt-4">
			{Array.from({ length: count }).map((_, index) => (
				<button
					key={index}
					className={cn(
						"w-3 h-3 rounded-full transition-colors border",
						current === index
							? "bg-primary"
							: "bg-muted hover:bg-muted-foreground"
					)}
					onClick={() => onClick(index)}
					aria-label={`Go to slide ${index + 1}`}
				/>
			))}
		</div>
	);
}
