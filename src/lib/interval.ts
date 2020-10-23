export default function removeInterval(interval: number) {
    clearInterval(interval);
    interval = undefined;
}