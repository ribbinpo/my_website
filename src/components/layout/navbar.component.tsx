import { cn } from "../../lib/tw-merge";
import { NAVBAR_MENU } from "../../constants/menu.constant";

export const Navbar = () => {
  const middleIndex = Math.ceil(NAVBAR_MENU.length / 2) - 1;
  return (
    <div className="flex justify-center space-x-24 py-6">
      {NAVBAR_MENU.map((menu, key) => {
        return (
          <div
            key={key}
            className={cn(
              "font-semibold cursor-pointer",
              middleIndex === key && "font-bold text-3xl cursor-default"
            )}
          >
            {menu.label}
          </div>
        );
      })}
    </div>
  );
};
