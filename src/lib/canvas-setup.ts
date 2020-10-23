export default class CanvasSetup {
    static setDimensions(canvas: HTMLCanvasElement, width: number, height: number) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        canvas.width = width;
        canvas.height = height;
    }
}