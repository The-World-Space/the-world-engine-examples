import { Vector2 } from "three/src/Three";
import {
    PlayerGridMovementController,
    CssSpriteAtlasRenderer,
    SpriteAtlasAnimator,
    ZaxisSorter,
    GameObjectBuilder,
    Prefab,
    IGridCollidable,
    PrefabRef
} from "the-world-engine";
import { MovementAnimationController } from "../script/MovementAnimationController";
import HeewonSpriteAtlas from "../asset/Heewon.png";

export class PlayerPrefab extends Prefab {
    private _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridPosition = new PrefabRef<Vector2>();

    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): PlayerPrefab {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): PlayerPrefab {
        this._gridPosition = gridPosition;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.asyncSetImageFromPath(HeewonSpriteAtlas, 4, 4);
                c.centerOffset = new Vector2(0, 0.4);
                c.pointerEvents = false;
                c.viewScale = 1;
                c.imageWidth = 1;
                c.imageHeight = 2;
            })
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation("down_idle", [0]);
                c.addAnimation("right_idle", [4]);
                c.addAnimation("up_idle", [8]);
                c.addAnimation("left_idle", [12]);
                c.addAnimation("down_walk", [0, 1, 2, 3]);
                c.addAnimation("right_walk", [4, 5, 6, 7]);
                c.addAnimation("up_walk", [8, 9, 10, 11]);
                c.addAnimation("left_walk", [12, 13, 14, 15]);
                c.frameDuration = 0.2;
            })
            .withComponent(PlayerGridMovementController, c => {
                if (1 <= this._collideMaps.length) {
                    if (this._collideMaps[0].ref) {
                        c.setGridInfoFromCollideMap(this._collideMaps[0].ref);
                    }
                }

                for (let i = 0; i < this._collideMaps.length; i++) {
                    if (this._collideMaps[i].ref) {
                        c.addCollideMap(this._collideMaps[i].ref!);
                    }
                }
                
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                c.speed = 5;
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 0.1;
            });
    }
}
