import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const SliderSection = ({ children }) => (
	<ScrollArea>
		{children}
		<ScrollBar orientation="horizontal" />
	</ScrollArea>
);

export default SliderSection;
