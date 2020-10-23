import Point from "../lib/point";
import { getRandomNumberFromRange } from "../lib/random";
import GameObject from "./game-object";

const MinRadius = 5;
const MaxRadius = 100;
const StrokeStyle = '#ddd';
const ResourcesPerOneRadius = 4;
const RadiusLostPerResource = 1 / ResourcesPerOneRadius;

const Font = '12px monospace';
const FillStyle = '#000';
const TextAlign = 'center';
const TextBaseline = 'middle';

export default class Resource extends GameObject {
    radius: number;
    coordinates: Point;
    resources: number;

    constructor(coordinates: Point) {
        super();
        this.coordinates = coordinates;
        this.radius = getRandomNumberFromRange(MinRadius, MaxRadius);
        this.resources = this.radius * ResourcesPerOneRadius;
    }

    async update() {}

    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = StrokeStyle;
        context.beginPath();
        context.arc(this.coordinates.x, this.coordinates.y, this.radius, 0, 2 * Math.PI);
        context.stroke();

        context.fillStyle = FillStyle;
        context.textAlign = TextAlign;
        context.textBaseline = TextBaseline;
        context.font = Font;
        context.fillText(String(this.resources), this.coordinates.x, this.coordinates.y);
    }

    hasResources(): boolean {
        return this.resources != 0;
    }

    take() {
        this.radius -= RadiusLostPerResource;
        this.resources--;
    }
}