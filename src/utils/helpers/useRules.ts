import {useMemo} from "react";
import {GroupDetails} from "@/utils/types";

export function useRules(group: GroupDetails) {
    const canAddGamesRule = useMemo(() => {
        return group?.rules?.find(r => r.code === "add_games")?.value ?? false;
    }, [group]);
    const canDeleteGamesRule = useMemo(() => {
        return group?.rules?.find(r => r.code === "delete_games")?.value ?? false;
    }, [group]);
    const canLikeGamesRule = useMemo(() => {
        return group?.rules?.find(r => r.code === "like_games")?.value ?? false;
    }, [group]);

    return {
        canAddGamesRule,
        canDeleteGamesRule,
        canLikeGamesRule
    };
}
