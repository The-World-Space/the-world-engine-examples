import { Component } from "the-world-engine";

export class Rotator extends Component {
    private _accumulatedTime = 0;

    public update() {
        this._accumulatedTime += this.engine.time.deltaTime;
        this.gameObject.transform.position.x = Math.sin(this._accumulatedTime) * 30;
        this.gameObject.transform.position.y = Math.cos(this._accumulatedTime) * 30;
    }
}