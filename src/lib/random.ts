import Point from "./point";

function getRandomNumberFromRange(minIncluding: number, maxIncluding: number): number {
    return minIncluding + Math.floor(Math.random() * (maxIncluding + 1 - minIncluding));
}

function getRandomPointFromArea(width: number, height: number): Point {
    return new Point(getRandomNumberFromRange(0, width), getRandomNumberFromRange(0, height));
}

export { getRandomNumberFromRange, getRandomPointFromArea };