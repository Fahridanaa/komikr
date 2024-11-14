import { BookOpen, Calendar, Clock, User2 } from "lucide-react";
import { format } from "date-fns";

interface MetaInfoProps {
	author: string;
	release: Date;
	updatedOn: Date;
}

export function MetaInfo({ author, release, updatedOn }: MetaInfoProps) {
	return (
		<>
			<div className="flex items-center space-x-2 text-muted-foreground">
				<User2 className="w-4 h-4" />
				<span>{author}</span>
			</div>

			<div className="grid grid-cols-2 gap-4 text-sm">
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-muted-foreground" />
					<span>
						Released {format(new Date(release), "MMM dd, yyyy")}
					</span>
				</div>
				<div className="flex items-center gap-2 col-span-2">
					<Clock className="w-4 h-4 text-muted-foreground" />
					<span>
						Updated {format(new Date(updatedOn), "MMM dd, yyyy")}
					</span>
				</div>
			</div>
		</>
	);
}
