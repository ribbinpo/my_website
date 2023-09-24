import { IconContext } from "react-icons";

import { cn } from "../../lib/tw-merge";
import { ClassValue } from "clsx";

interface SocailItemProps {
  color?: ClassValue;
  icon: JSX.Element;
}

export default function SocialItem({ color, icon }: SocailItemProps) {
  return (
    <div
      className={cn(
        "border rounded-full p-3 w-full border-red-300 text-red-300 hover:bg-red-300 hover:text-white",
        color
      )}
    >
      <IconContext.Provider value={{ className: "w-full h-full" }}>
        {icon}
      </IconContext.Provider>
    </div>
  );
}
