import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const SliderSection = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div>
		<h2 className="font-medium text-xl mb-1">{title}</h2>
		<ScrollArea className="py-2">
			<div className="flex w-max space-x-4 p-2 gap-4">{children}</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	</div>
);

export default SliderSection;
