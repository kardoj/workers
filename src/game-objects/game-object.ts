import Point from "../lib/point";

export default abstract class GameObject {
    coordinates: Point;

    abstract async update(): Promise<void>;
    abstract draw(context: CanvasRenderingContext2D): void;

    getDistance(otherObject: GameObject): number {
        return Math.round(Math.sqrt(Math.pow(otherObject.coordinates.x - this.coordinates.x, 2) + Math.pow(otherObject.coordinates.y - this.coordinates.y, 2)));
    }
}