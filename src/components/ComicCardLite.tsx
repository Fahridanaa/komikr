const ComicCardLite = ({ ranking, comic }) => {
	return (
		<div className="relative flex gap-4 border-b-2 space-y-2 pb-2">
			<div className="absolute">
				<span className="rounded-b-xl bg-blue-400 px-2 py-1 text-white font-bold">
					{ranking}
				</span>
			</div>
			<div className="mx-4 flex gap-1">
				<figure className="flex-1 overflow-hidden rounded-md w-20 h-20">
					<img
						src={comic.src}
						alt="comic"
						className="object-cover object-center w-full h-full"
					/>
				</figure>
				<div className="flex-[3] min-w-52">
					<h3 className="font-medium text-lg">Apalah</h3>
					<p className="text-sm">
						<span className="text-muted-foreground">Genres:</span>{" "}
						Adventure, Action,
					</p>
					<p className="text-sm text-muted-foreground">2024</p>
				</div>
			</div>
		</div>
	);
};

export default ComicCardLite;
