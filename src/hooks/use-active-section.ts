import { useEffect, useState } from "react";

// Returns the id of the last section whose top has scrolled past the header.
export function useActiveSection(ids: readonly string[], offset = 160) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const update = () => {
      let current = "";
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= offset) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [ids, offset]);
  return active;
}
