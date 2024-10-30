import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { ComicMeta } from "@/models/comic";

interface CarouselPageProps {
	comics: ComicMeta[];
}

const CarouselPage: React.FC<CarouselPageProps> = ({ comics }) => {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
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

	const handleDotClick = React.useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api]
	);
	return (
		<div className="hidden w-full md:block">
			<Carousel setApi={setApi}>
				<CarouselContent>
					{comics.map((comic, index) => (
						<CarouselItem key={index}>
							<Card className="relative max-h-full overflow-hidden">
								<CardContent className="relative flex items-center justify-center p-0 h-[350px] overflow-hidden lg:h-[400px]">
									<img
										src={`/src/assets/comics/${comic.title
											.toLowerCase()
											.replace(/\s/g, "-")}/cover.jpg`}
										alt={comic.title}
										className="absolute object-cover object-center w-full h-full brightness-[.4] blur-lg z-[0]"
									/>
									<div className="relative flex h-full w-full p-8 md:p-12 text-white z-[1]">
										<div className="flex-1">
											<div className="mb-2">
												<h2 className="text-2xl font-semibold">
													<a
														href="/"
														className="hover:text-blue-400 transition-colors duration-200"
													>
														{comic.title}
													</a>
												</h2>
												<p>
													<Star className="w-5 h-5 text-yellow-400 inline-block mr-1" />
													<span className="align-middle">
														9.84
													</span>
												</p>
												<p className="text-md text-orange-300">
													{comic.type}
												</p>
												<p className="text-gray-300">
													{comic.genres.join(", ")}
												</p>
											</div>
											<div>
												<div className="mb-2">
													<h4 className="text-lg font-semibold">
														Sinopsis
													</h4>
													<p className="overflow-hidden text-ellipsis line-clamp-3 lg:line-clamp-4">
														{comic.synopsis}
													</p>
												</div>
												<div>
													<p>
														<span className="font-semibold">
															Status
														</span>
														: {comic.status}
													</p>
													<p>
														<span className="font-semibold">
															Author(s)
														</span>
														: {comic.author}
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center p-4">
											<figure className="overflow-hidden rounded-md max-w-48 h-60">
												<a href="/">
													<img
														src={`/src/assets/comics/${comic.title
															.toLowerCase()
															.replace(
																/\s/g,
																"-"
															)}/cover.jpg`}
														alt={comic.title}
														className="object-cover object-center w-full h-full"
													/>
												</a>
											</figure>
										</div>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className="flex justify-end gap-2 mt-4 z-10">
				{Array.from({ length: count }).map((_, index) => (
					<button
						key={index}
						className={cn(
							"w-3 h-3 rounded-full transition-colors duration-200",
							current === index
								? "bg-primary"
								: "bg-gray-300 hover:bg-gray-400"
						)}
						onClick={() => handleDotClick(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};

export default CarouselPage;
