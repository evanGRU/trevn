import { createContext, useContext } from "react";
import { GamesListHandle } from "@/components/app/games/gamesList/gamesList";

export const GamesScrollContext = createContext<React.RefObject<GamesListHandle | null> | null>(null);

export const useGamesScroll = () => {
    const ctx = useContext(GamesScrollContext);
    if (!ctx) throw new Error("useGamesScroll must be used within provider");
    return ctx;
};