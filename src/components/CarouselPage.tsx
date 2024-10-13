import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import encore from "@/assets/encore-sayang.jpg";
import frieren from "@/assets/frieren.jpg";
import waguri from "@/assets/kaoruko-waguri.jpg";
import { Card, CardContent } from "./ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const CarouselPage = () => {
	const images = [encore, frieren, waguri];
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	const handleDotClick = React.useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api]
	);
	return (
		<>
			<Carousel
				opts={{
					loop: true,
				}}
				setApi={setApi}
				className="hidden w-full md:block"
			>
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<Card className="relative max-h-full overflow-hidden">
								<CardContent className="relative flex items-center justify-center p-0 h-[350px] overflow-hidden lg:h-[400px]">
									<img
										src={image.src}
										alt="carousel"
										className="absolute object-cover object-center w-full h-full brightness-[.4] blur-lg z-[0]"
									/>
									<div className="relative flex h-full w-full p-8 md:p-12 text-white z-[1]">
										<div>
											<div className="mb-2">
												<h2 className="text-2xl font-semibold">
													<a
														href="/"
														className="hover:text-blue-400 transition-colors duration-200"
													>
														Solo Leveling
													</a>
												</h2>
												<p>
													<Star className="w-5 h-5 text-yellow-400 inline-block mr-1" />
													<span className="align-middle">
														9.84
													</span>
												</p>
												<p className="text-md text-orange-300">
													Manhwa
												</p>
												<p className="text-gray-300">
													Action, Adventure
												</p>
											</div>
											<div>
												<div className="mb-2">
													<h4 className="text-lg font-semibold">
														Sinopsis
													</h4>
													<p className="overflow-hidden text-ellipsis line-clamp-3 lg:line-clamp-4">
														10 years ago, after “the
														Gate” that connected the
														real world with the
														monster world opened,
														some of the ordinary,
														everyday people received
														the power to hunt
														monsters within the
														Gate. They are known as
														"Hunters". However, not
														all Hunters are
														powerful. My name is
														Sung Jin-Woo, an E-rank
														Hunter. I'm someone who
														has to risk his life in
														the lowliest of
														dungeons, the "World's
														Weakest". Having no
														skills whatsoever to
														display, I barely earned
														the required money by
														fighting in low-leveled
														dungeons… at least until
														I found a hidden dungeon
														with the hardest
														difficulty within the
														D-rank dungeons! In the
														end, as I was accepting
														death, I suddenly
														received a strange
														power, a quest log that
														only I could see, a
														secret to leveling up
														that only I know about!
														If I trained in
														accordance with my
														quests and hunted
														monsters, my level would
														rise. Changing from the
														weakest Hunter to the
														strongest S-rank Hunter!
													</p>
												</div>
												<div>
													<p>
														<span className="font-semibold">
															Status
														</span>
														: Ongoing
													</p>
													<p>
														<span className="font-semibold">
															Author
														</span>
														: 추공 (Chugong)
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center p-4">
											<figure className="overflow-hidden rounded-md min-w-48 max-w-96 h-full">
												<a href="/">
													<img
														src={image.src}
														alt="carousel"
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
		</>
	);
};

export default CarouselPage;
