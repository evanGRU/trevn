import {useMediaQuery} from "@mui/system";

export function useMediaQueries() {
    const isTablet = useMediaQuery("(max-width: 1024px)");
    const isMobile = useMediaQuery("(max-width: 768px)");

    return {
        isTablet,
        isMobile
    };
}
