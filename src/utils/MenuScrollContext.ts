import { createContext, useContext } from "react";
import { GamesListHandle } from "@/components/app/groupMenu/games/gamesList";

export const MenuScrollContext = createContext<React.RefObject<GamesListHandle | null> | null>(null);

export const useMenuScroll = () => {
    const ctx = useContext(MenuScrollContext);
    if (!ctx) throw new Error("useGamesScroll must be used within provider");
    return ctx;
};