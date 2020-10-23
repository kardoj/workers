import Point from "../lib/point";
import Resource from "./resource";
import GameObject from "./game-object";
import { Destination } from "../components/destination";
import Building from "./building";

enum WorkerState {
    GoingToResource = 1,
    GatheringResources = 2,
    GoingToCommandCenter = 3,
    UnloadingResources = 4
}

const Radius = 10;
const RadiusGainedByCarriedResource = 1;
const SelectedStrokeStyle = '#29ce39';
const DeselectedStrokeStyle = '#000';
const MaxMovementSpeed = 3;
const MaxCarriedResources = 4;
const SpeedLostByCarriedResource = 0.5;
const GatheringDelay = 1000;
const UnloadingDelay = 500;

const Font = '9px monospace';
const FillStyle = '#000';
const TextAlign = 'center';
const TextBaseline = 'middle';

export default class Worker extends GameObject {
    private destination: Destination;
    private state: WorkerState;
    private carriedResources: number = 0;
    private gatheringTimer: number;
    private unloadingTimer: number;
    private speed: number = MaxMovementSpeed;
    private radius: number = Radius;
    private strokeStyle = DeselectedStrokeStyle;

    private loggingTimer: number;

    // References to main game objects
    private resources: Resource[];
    private commandCenters: Building[];

    coordinates: Point;
    selected: boolean = false;

    constructor(coordinates: Point) {
        super();
        this.coordinates = coordinates;
    }

    gatherResources(resources: Resource[], commandCenters: Building[]) {
        this.resources = resources;
        this.commandCenters = commandCenters;
        this.locateNearestResourceAndStartGoingThere();
    }

    async update() {
        switch (this.state) {
            case WorkerState.GoingToResource: {
                if (this.destination.reached()) {
                    this.startHarvestingResource(<Resource>this.destination.gameObject);
                    break;
                }

                this.coordinates = this.destination.move(this.coordinates, this.speed);
                break;
            }

            case WorkerState.GatheringResources: {
                const resource: Resource = <Resource>this.destination.gameObject;

                if (this.carriedResources == MaxCarriedResources || !resource.hasResources())
                    this.bringResourcesToNearestCommandCenter();

                break;
            }

            case WorkerState.GoingToCommandCenter: {
                if (this.destination.reached()) {
                    this.state = WorkerState.UnloadingResources;
                    break;
                }

                this.coordinates = this.destination.move(this.coordinates, this.speed);
                break;
            }

            case WorkerState.UnloadingResources: {
                if (!this.unloadingTimer) {
                    this.unloadingTimer = setInterval(() => {
                        if (this.carriedResources > 0) {
                            (<Building>this.destination.gameObject).unloadResource();
                            this.unloadResource();
                        } 
                        
                        if (this.carriedResources == 0) {
                            clearInterval(this.unloadingTimer);
                        }
                    }, UnloadingDelay);
                } else if (this.carriedResources == 0) {
                    this.unloadingTimer = null;
                    this.locateNearestResourceAndStartGoingThere();
                }
                break;
            }
        }       
    }

    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.strokeStyle;
        context.beginPath();
        context.arc(this.coordinates.x, this.coordinates.y, this.radius, 0, 2 * Math.PI);
        context.stroke();

        context.fillStyle = FillStyle;
        context.textAlign = TextAlign;
        context.textBaseline = TextBaseline;
        context.font = Font;
        context.fillText(String(this.carriedResources), this.coordinates.x, this.coordinates.y);
    }

    isAt(point: Point): boolean {
        // Compare radius of circle with distance of its center from given point
        return ((point.x - this.coordinates.x) * (point.x - this.coordinates.x) + (point.y - this.coordinates.y) * (point.y - this.coordinates.y) <= this.radius * this.radius);
    }

    select() {
        this.selected = true;
        this.strokeStyle = SelectedStrokeStyle;
        this.startLogging();
    }

    deselect() {
        this.selected = false;
        this.strokeStyle = DeselectedStrokeStyle;
        this.stopLogging();
    }

    private locateNearestResourceAndStartGoingThere() {
        const nearestResourceWithDistance = this.findNearestGameObjectWithDistance(this.resources.filter(r => r.hasResources()));
        const resource: Resource = <Resource>nearestResourceWithDistance.gameObject;
        this.destination = new Destination(this.coordinates, resource, nearestResourceWithDistance.distance, this.radius + resource.radius);
        this.state = WorkerState.GoingToResource;
    }

    private startHarvestingResource(resource: Resource) {
        this.state = WorkerState.GatheringResources;

        this.gatheringTimer = setInterval(() => {
            if (this.carriedResources < MaxCarriedResources && resource.hasResources()) {
                resource.take();
                this.pickUpResource();
            } 
            
            if (this.carriedResources == MaxCarriedResources || !resource.hasResources()) {
                clearInterval(this.gatheringTimer);
            }
        }, GatheringDelay);
    }

    private bringResourcesToNearestCommandCenter() {
        this.gatheringTimer = null;
        const nearestCommandCenterWithDistance = this.findNearestGameObjectWithDistance(this.commandCenters);
        const commandCenter: Building = <Building>nearestCommandCenterWithDistance.gameObject;
        this.destination = new Destination(this.coordinates, commandCenter, nearestCommandCenterWithDistance.distance);
        this.state = WorkerState.GoingToCommandCenter;
    }

    private startLogging() {
        this.loggingTimer = setInterval(() => {
            this.log();
        }, 1000);
    }

    private stopLogging() {
        clearInterval(this.loggingTimer);
        this.loggingTimer = null;
    }

    private log() {
        console.log('state: ' + WorkerState[this.state]);
        console.log('destination: [' + this.destination.gameObject.coordinates.x + '; ' + this.destination.gameObject.coordinates.y + ']');
        console.log('gathering timer: ' + this.gatheringTimer);
        console.log('unloading timer: ' + this.unloadingTimer);
    }

    private pickUpResource() {
        this.speed -= SpeedLostByCarriedResource;
        this.radius += RadiusGainedByCarriedResource;
        this.carriedResources++;
    }

    private unloadResource() {
        this.speed += SpeedLostByCarriedResource;
        this.radius -= RadiusGainedByCarriedResource;
        this.carriedResources--;
    }

    private findNearestGameObjectWithDistance(gameObjects: GameObject[]): { gameObject: GameObject, distance: number } {
        let nearestDistance = this.getDistance(gameObjects[0]);
        let nearest = gameObjects[0];
        
        for (let i = 1; i < gameObjects.length; i++) {
            let distance = this.getDistance(gameObjects[i]);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = gameObjects[i];
            }
        }

        return { gameObject: nearest, distance: nearestDistance };
    }
}