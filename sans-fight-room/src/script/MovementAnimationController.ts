import { Component, ComponentConstructor, SpriteAtlasAnimator, Direction, Directionable } from "the-world-engine";

export class MovementAnimationController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Directionable, SpriteAtlasAnimator];

    private _directionable: Directionable|null = null;
    private _spriteAtlasAnimator: SpriteAtlasAnimator|null = null;
    private _lastDirection: Direction = Direction.Down;
    private _lastIsMoving = false;

    protected awake(): void {
        this._directionable = this.gameObject.getComponent(Directionable);
        this._spriteAtlasAnimator = this.gameObject.getComponent(SpriteAtlasAnimator);
    }

    public update(): void {
        const direction = this._directionable!.direction;
        const isMoving = this._directionable!.isMoving;
        if (isMoving) {
            if (direction === Direction.Up) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("up_walk");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Down) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("down_walk");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Left) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("left_walk");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Right) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("right_walk");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            }
        } else {
            if (direction === Direction.Up) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("up_idle");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Down) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("down_idle");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Left) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("left_idle");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            } else if (direction === Direction.Right) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("right_idle");
                    this._lastIsMoving = isMoving;
                    this._lastDirection = direction;
                }
            }
        }
    }
}
