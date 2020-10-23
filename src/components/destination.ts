import Point from "../lib/point";
import GameObject from "../game-objects/game-object";

enum Direction {
    Negative = -1,
    Positive = 1
}

class Destination {
    private distanceRemaining: number;

    private angle: number;
    private xDirection: Direction = Direction.Positive;
    private yDirection: Direction = Direction.Positive;
    
    gameObject: GameObject;

    constructor(start: Point, gameObject: GameObject, distance: number, offset: number = 0) {
        this.gameObject = gameObject;
        this.distanceRemaining = distance - offset;

        this.angle = Math.abs(Math.asin((gameObject.coordinates.y - start.y) / distance));
        this.xDirection = gameObject.coordinates.x < start.x ? Direction.Negative : Direction.Positive;
        this.yDirection = gameObject.coordinates.y < start.y ? Direction.Negative : Direction.Positive;
    }

    move(from: Point, distance: number): Point {
        const totalMovement = Math.min(this.distanceRemaining, distance);
        const xMovement = Math.cos(this.angle) * totalMovement * this.xDirection;
        const yMovement = Math.sin(this.angle) * totalMovement * this.yDirection;

        this.distanceRemaining -= totalMovement;

        return new Point(from.x + xMovement, from.y + yMovement);
    }

    reached(): boolean {
        return this.distanceRemaining == 0;
    }
}

export { Destination };