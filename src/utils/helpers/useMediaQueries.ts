import {useMediaQuery} from "@mui/system";

export function useMediaQueries() {
    const isMobile = useMediaQuery("(max-width: 480px)");
    const isTablet = useMediaQuery("(max-width: 768px)");
    const isLaptop = useMediaQuery("(max-width: 1024px)");

    return {
        isMobile,
        isTablet,
        isLaptop
    };
}
