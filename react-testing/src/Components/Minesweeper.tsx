import ResponsizeSquareContainer from "./ResponsizeSquareContainer"
import * as G from "../../../lib/Graphics";
import Rectangle from "../../../lib/Rectangle";
import * as utils from "./utils";
import useImages from "./useImages";

import Canvas from "../../../lib/Canvas";
import { useRef, useState, useEffect, useCallback } from "react";

let actions: [number, number][] = [];

function getImageSrc(value: number): string {
    if (value === -1) return "mine";
    const numerical = ["empty", "one", "two", "three", "four", "five", "six", "seven", "eight"];
    return numerical[value];
} 

export default function Minesweeper() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [board, setBoard] = useState<utils.Cell[][]>([]);
    const images = useImages();

    const render = useCallback(() => {
        if (!canvas) return;
        const currentBoard = board;

        for (const [x, y] of actions) {
            const [i, j] = getBoardIndices([x, y], canvas.width, canvas.height);

            if (currentBoard[i][j].state === utils.State.Visible) {
                utils.clearFromCell(i, j, currentBoard);
            } else if (currentBoard[i][j].state === utils.State.Flagged) {
                continue;
            } else {
                currentBoard[i][j].state = utils.State.Visible;
            }
        }

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const rect = new Rectangle(canvas.width/10, canvas.width/10);
                rect.setPosition(new G.Position(rect.width * j, rect.height * i));

                if (currentBoard[i][j].state === utils.State.Covered) {
                    rect.setTexture(rect.width, rect.height, images.covered);
                } else if (currentBoard[i][j].state === utils.State.Flagged) {
                    rect.setTexture(rect.width, rect.height, images.flag);
                } else if (currentBoard[i][j].state === utils.State.Visible && currentBoard[i][j].value > 0) {
                    rect.setTexture(rect.width, rect.height, images[getImageSrc(board[i][j].value)]);
                } else if (currentBoard[i][j].value === -1) {
                    rect.setTexture(rect.width, rect.height, images.mine);
                } else {
                    rect.setTexture(rect.width, rect.height, images.empty);
                }
                canvas.drawRect(rect);
            }
        }

        canvas.display();
        actions = [];
        setBoard(currentBoard);
        window.requestAnimationFrame(render);
    }, [canvas, board, images]);

    function getMousePosition(e: React.MouseEvent): [number, number] {
        if (!ref.current) return [-1, -1];
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        return [x, y];
    }

    function getBoardIndices(mousePosition: [number, number], width: number, height: number): [number, number] {
        const [x, y] = mousePosition;
        return [
            Math.floor(y / (height / 10)),
            Math.floor(x / (width / 10)),
        ];
    }

    function handleClick(e: React.MouseEvent) {
        actions.push(getMousePosition(e));
    }

    function handleRightClick(e: React.MouseEvent) {
        e.preventDefault();
        if (!canvas) return;

        const [i, j] = getBoardIndices(getMousePosition(e), canvas.width, canvas.height);

        const currentBoard = board;
        if (currentBoard[i][j].state === utils.State.Visible) return;
        if (currentBoard[i][j].state === utils.State.Flagged) {
            currentBoard[i][j].state = utils.State.Covered;
        } else {
            currentBoard[i][j].state = utils.State.Flagged;
        }
        setBoard(currentBoard);
    }
    
    useEffect(() => {
        if (!ref.current) return;
        setCanvas(new Canvas(ref.current));
    }, [ref]);

    useEffect(() => {
        window.requestAnimationFrame(render);
    }, [canvas, render]);

    useEffect(() => {
        setBoard(utils.getFilledBoard(10, 10, 10));
    }, []);

    return (
        <ResponsizeSquareContainer>
            <canvas 
                className="w-full h-full"
                ref={ref}
                onClick={handleClick}
                onContextMenu={handleRightClick}
            />
        </ResponsizeSquareContainer>
    );
}
