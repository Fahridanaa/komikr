import NavigationBar from "../NavigationBar";

const Header = () => {
	const navItems = [
		{ name: "Home", href: "/" },
		{ name: "List", href: "/list" },
		{ name: "Genre", href: "/genre" },
	];

	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
			<NavigationBar logo="" items={navItems} />
		</header>
	);
};

export default Header;
