import CanvasSetup from "./lib/canvas-setup";
import Point from "./lib/point";
import Worker from "./game-objects/worker";
import Resource from "./game-objects/resource";
import { getRandomPointFromArea } from "./lib/random";
import Building from "./game-objects/building";

const Width = 800;
const Height = 600;
const TicksPerSecond = 60;
const CommandCenters = 3;
const Workers = 10;
const Resources = 15;

class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly timeBetweenTicks: number = 1000 / TicksPerSecond;

    private gameLoop: number;

    private drawContext: CanvasRenderingContext2D;
    private workers: Worker[] = [];
    private resources: Resource[] = [];
    private commandCenters: Building[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    start() {
        CanvasSetup.setDimensions(this.canvas, Width, Height);
        this.drawContext = this.canvas.getContext('2d');

        for (let i = 0; i < Resources; i++) {
            this.resources.push(new Resource(getRandomPointFromArea(Width, Height)));
        }

        for (let i = 0; i < CommandCenters; i++) {
            this.commandCenters.push(new Building(getRandomPointFromArea(Width, Height)));
        }

        for (let i = 0; i < Workers; i++) {
            const worker = new Worker(getRandomPointFromArea(Width, Height));
            worker.gatherResources(this.resources, this.commandCenters);
            this.workers.push(worker);
        }

        this.gameLoop = setInterval(() => {
            this.update();
        }, this.timeBetweenTicks);

        requestAnimationFrame(() => this.draw(this.drawContext));
    }

    update() {
        this.workers.forEach(w => w.update());
    }

    private draw(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, Width, Height);

        this.workers.forEach(w => w.draw(context));
        this.resources.forEach(r => r.draw(context));
        this.commandCenters.forEach(r => r.draw(context));
        
        requestAnimationFrame(() => this.draw(context));
    }
}

new Game(<HTMLCanvasElement>document.getElementById('canvas')).start();