import { useEffect, useRef } from "react";
import { cn } from "../utils";

export default function ResponsizeSquareContainer(
    { children, ...props }: { children: string | JSX.Element | JSX.Element[] | null },
    className: string,
) {
    const ref = useRef<HTMLDivElement>(null);

    function setSquareAspectRatio() {
        if (!ref.current) return;
        ref.current.style.height = "100%";
        ref.current.style.width  = "100%";
        if (ref.current.clientHeight < ref.current.clientWidth) {
            ref.current.style.height = `${ref.current.clientHeight}px`;
            ref.current.style.width  = `${ref.current.clientHeight}px`;
        } else {
            ref.current.style.height = `${ref.current.clientWidth}px`;
            ref.current.style.width  = `${ref.current.clientWidth}px`;
        }
    }

    useEffect(() => {
        function handleWindowResize() {
            if (!ref.current) return;
            setSquareAspectRatio();
        }
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, [ref]);

    useEffect(() => {
        setSquareAspectRatio();
    }, [ref]);

    return (
        <div 
            className={cn("w-full h-full", className)}
            ref={ref} 
            {...props}
        >
            {children}
        </div>
    )
}
