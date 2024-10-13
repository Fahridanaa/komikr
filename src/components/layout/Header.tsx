import NavigationBar from "../NavigationBar";

const Header = () => {
	const navItems = [
		{ name: "Home", href: "/" },
		{ name: "Genre", href: "/genre" },
		{ name: "Contact", href: "/contact" },
	];

	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<NavigationBar logo="" items={navItems} />
		</header>
	);
};

export default Header;
