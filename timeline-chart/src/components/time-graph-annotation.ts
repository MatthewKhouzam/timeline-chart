import * as PIXI from "pixi.js-legacy"
import { TimeGraphComponent, TimeGraphElementPosition, TimeGraphComponentOptions } from "./time-graph-component";

export interface TimeGraphAnnotationComponentOptions extends TimeGraphComponentOptions {
    start: TimeGraphElementPosition
    end: TimeGraphElementPosition
}

export interface TimeGraphAnnotationStyle extends TimeGraphComponentOptions {
    symbol: string
    size: number
    color: number
}

export class TimeGraphAnnotationComponent extends TimeGraphComponent {

    protected head: PIXI.Graphics;

    constructor(id: string, 
        protected _options: TimeGraphAnnotationComponentOptions, 
        protected _style: TimeGraphAnnotationStyle) {
        super(id);
        this.head = new PIXI.Graphics();
    }

    render(): void {
        const { symbol } = this._style as TimeGraphAnnotationStyle;
        const size = this._style.size;
        const x = this._options.start.x - size * 0.5;
        const y = this._options.start.y - size * 0.5;
        if (symbol == 'circle') {
            this.drawCircle(x, y, size);
        } else if (symbol == 'cross') {
            this.drawCross(x, y, size);
        } else if (symbol == 'diamond') {
            this.drawDiamond(x, y, size);
        }
        this._displayObject.addChild(this.head);
    }

    private drawCircle(x: number, y: number, size: number): void {
        this.head.clear();
        this.head.beginFill(this._style.color);
        this.head.lineStyle(0);
        this.head.drawCircle(x, y, size);
        this.head.endFill();
        //this.head.cacheAsBitmap = true;
    }

    // thickness = 20%
    private drawCross(x: number, y: number, size: number): void {
        this.head.clear();
        this.head.beginFill(this._style.color);
        this.head.lineStyle(0);
        const smallEdge = 0.4 * size;
        const largeEdge = 0.6 * size;
        this.head.drawPolygon([
            x, y + smallEdge,
            x + smallEdge,
            y + smallEdge,
            x + smallEdge, y,
            x + largeEdge, y,
            x + largeEdge, y + smallEdge,
            x + size,
            y + smallEdge, x + size,
            y + largeEdge, x + largeEdge,
            y + largeEdge, x + largeEdge,
            y + size, x + smallEdge,
            y + size, x + smallEdge,
            y + largeEdge,
            x, y + largeEdge,
            x, y + smallEdge
        ]);
        this.head.endFill();
        //this.head.cacheAsBitmap = true;
    }

    private drawDiamond(x: number, y: number, size: number): void {
        this.head.clear();
        this.head.beginFill(this._style.color);
        this.head.lineStyle(0);
        const center = 0.5 * size;
        this.head.drawPolygon([
            x, y + center,
            x + center, y,
            x + size, y + center,
            x + center, y + size,
            x, y + center
        ]);
        this.head.endFill();
        //this.head.cacheAsBitmap = true;
    }
}