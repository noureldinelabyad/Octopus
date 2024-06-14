import { useEffect , useState} from "react";

export const useOrigin = () => {
   const [mounted, setMounted] = useState(false);   // becouse will use the window object inside the useEffect and that may couse hydration error  wehne it comes to ssr so we need to make sure that the component is mounted before we can use the window object
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""; // Determines the origin URL of the document.

    useEffect(() => {
        setMounted(true);
    }, []);  // The empty dependency array means this effect runs only once after the initial render.

    if (!mounted) {
        return "";  // If the component is not mounted, return an empty string.
    }

    return origin; // Once the component is mounted, return the origin URL.
};
