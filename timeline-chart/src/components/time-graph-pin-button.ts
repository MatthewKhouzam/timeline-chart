import * as PIXI from "pixi.js-legacy";
import { TimeGraphComponent, TimeGraphElementPosition } from "./time-graph-component";

export interface TimeGraphPinButtonOptions {
    position: TimeGraphElementPosition;
    size?: number;
    color?: number;
    hoverColor?: number;
}

export class TimeGraphPinButton extends TimeGraphComponent<any> {
    protected _options: TimeGraphPinButtonOptions;
    protected _isPinned: boolean = false;
    protected _onToggle?: (pinned: boolean) => void;

    constructor(id: string, options: TimeGraphPinButtonOptions, onToggle?: (pinned: boolean) => void) {
        super(id);
        this._options = {
            size: 12,
            color: 0x666666,
            hoverColor: 0x333333,
            ...options
        };
        this._onToggle = onToggle;
        this.render();
    }

    render() {
        const size = this._options.size!;
        const graphics = new PIXI.Graphics();
        
        // Draw pin icon
        graphics.beginFill(this._isPinned ? 0xff6b6b : this._options.color!);
        graphics.drawCircle(size / 2, size / 2, size / 4);
        graphics.drawRect(size / 2 - 1, size / 2, 2, size / 3);
        graphics.endFill();

        this._displayObject.removeChildren();
        this._displayObject.addChild(graphics);
        this._displayObject.position.set(this._options.position.x, this._options.position.y);
        this._displayObject.interactive = true;
        this._displayObject.buttonMode = true;

        this._displayObject.on('pointerover', () => {
            graphics.clear();
            graphics.beginFill(this._isPinned ? 0xff4757 : this._options.hoverColor!);
            graphics.drawCircle(size / 2, size / 2, size / 4);
            graphics.drawRect(size / 2 - 1, size / 2, 2, size / 3);
            graphics.endFill();
        });

        this._displayObject.on('pointerout', () => {
            graphics.clear();
            graphics.beginFill(this._isPinned ? 0xff6b6b : this._options.color!);
            graphics.drawCircle(size / 2, size / 2, size / 4);
            graphics.drawRect(size / 2 - 1, size / 2, 2, size / 3);
            graphics.endFill();
        });

        this._displayObject.on('pointerdown', () => {
            this._isPinned = !this._isPinned;
            if (this._onToggle) {
                this._onToggle(this._isPinned);
            }
            this.render();
        });
    }

    get isPinned(): boolean {
        return this._isPinned;
    }

    set isPinned(pinned: boolean) {
        if (this._isPinned !== pinned) {
            this._isPinned = pinned;
            this.render();
        }
    }

    get position(): TimeGraphElementPosition {
        return this._options.position;
    }

    set position(position: TimeGraphElementPosition) {
        this._options.position = position;
        this._displayObject.position.set(position.x, position.y);
    }
}
