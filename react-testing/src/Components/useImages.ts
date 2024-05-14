import { images } from "../assets/minesweeperImages";

export default function useImages() {
    const results: {
        [key: string]: HTMLImageElement
    } = {};

    for (const [key, value] of Object.entries(images)) {
        results[key] = new Image();
        results[key].src = value;
    }

    return results;
}
