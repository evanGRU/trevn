import {useMediaQuery} from "@mui/system";

export function useMediaQueries() {
    const maxIsMobile = useMediaQuery("(max-width: 480px)");
    const maxIsTablet = useMediaQuery("(max-width: 768px)");
    const maxIsLaptop = useMediaQuery("(max-width: 1024px)");

    return {
        maxIsMobile,
        maxIsTablet,
        maxIsLaptop
    };
}
