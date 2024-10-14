import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const SliderSection = ({ children }) => (
	<div>
		<h3 className="font-medium text-xl mb-1">Popular Comic Update</h3>
		<ScrollArea className="py-2">
			<div className="flex w-max space-x-4 p-2 gap-4">{children}</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	</div>
);

export default SliderSection;
