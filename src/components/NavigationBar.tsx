import { CircleUser, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavItem = {
	name: string;
	href: string;
};

interface Props {
	logo: string;
	items: NavItem[];
	isAuth?: boolean;
}

const NavigationBar: React.FC<Props> = ({ logo, items, isAuth = false }) => {
	return (
		<>
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				{/* <a
					href="/"
					className="flex items-center gap-2 text-lg font-semibold md:text-base"
				>
					<img src={logo} alt="Komikr" className="h-6 w-6" />
					<span className="sr-only">Komikr</span>
				</a> */}
				<ul className="flex ml-6 gap-4">
					{items.map((item) => (
						<li key={item.name}>
							<a
								href={item.href}
								className="text-base transition-colors duration-300 hover:text-blue-500"
							>
								{item.name}
							</a>
						</li>
					))}
				</ul>
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant={"outline"}
						size={"icon"}
						className="shrink-0 md:hidden"
					>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side={"left"}>
					<nav className="grid gap-6 text-lg font-medium">
						<a
							href="/"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<img src={logo} alt="Logo" className="h-6 w-6" />
							<span className="sr-only">Logo</span>
						</a>
						<ul className="flex flex-col gap-4">
							{items.map((item) => (
								<li key={item.name}>
									<a
										href={item.href}
										className="text-base transition-colors duration-300 hover:text-blue-500"
									>
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<form className="ml-auto flex-1 sm:flex-initial">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search Title..."
							className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
						/>
					</div>
				</form>
				{isAuth ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="rounded-full"
							>
								<CircleUser className="h-5 w-5" />
								<span className="sr-only">
									Toggle user menu
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="hidden items-center gap-2 sm:flex">
						<Button variant={"default"} size={"sm"}>
							Sign In
						</Button>
						<Button variant={"secondary"} size={"sm"}>
							Sign Up
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

export default NavigationBar;
