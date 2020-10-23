import GameObject from "./game-object";
import Point from "../lib/point";

const Width = 100;
const Height = 100;
const StrokeStyle = '#00f';

const Font = '16px monospace';
const FillStyle = '#000';
const TextAlign = 'center';
const TextBaseline = 'middle';

export default class Building extends GameObject {
    private resources: number = 0;

    constructor(coordinates: Point) {
        super();
        this.coordinates = coordinates;
    }

    async update() { }
    
    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = StrokeStyle;
        context.beginPath();
        context.rect(this.coordinates.x - Width / 2, this.coordinates.y - Height / 2, Width, Height);
        context.stroke();

        context.fillStyle = FillStyle;
        context.textAlign = TextAlign;
        context.textBaseline = TextBaseline;
        context.font = Font;
        context.fillText(String(this.resources), this.coordinates.x, this.coordinates.y);
    }

    unloadResource() {
        this.resources++;
    }
}