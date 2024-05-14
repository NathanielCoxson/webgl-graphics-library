import ResponsizeSquareContainer from "./ResponsizeSquareContainer"
import * as G from "../../../lib/Graphics";
import Rectangle from "../../../lib/Rectangle";

import Canvas from "../../../lib/Canvas";
import { useRef, useState, useEffect, useCallback } from "react";

export default function Minesweeper() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    const render = useCallback(() => {
        if (!canvas) return;
        console.log("render");
        const rect = new Rectangle(100, 100);
        rect.setPosition(new G.Position(0, 0));
        rect.setFillColor(new G.Color(255, 0, 0, 1));
        canvas.drawRect(rect);
        canvas.display();
    }, [canvas]);
    
    useEffect(() => {
        if (!ref.current) return;
        setCanvas(new Canvas(ref.current));
    }, [ref]);

    useEffect(() => {
        window.requestAnimationFrame(render);
    }, [canvas, render]);

    return (
        <ResponsizeSquareContainer>
            <canvas 
                className="w-full h-full"
                ref={ref}
            >

            </canvas> 
        </ResponsizeSquareContainer>
    )
}
