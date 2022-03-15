import { Vector2 } from "three/src/Three";
import { TrackCameraController, Camera, GameObject, GameObjectBuilder, Prefab, PrefabRef, Color, CameraType } from "the-world-engine";

export class CameraPrefab extends Prefab {
    private _trackTarget = new PrefabRef<GameObject>();

    public withTrackTarget(target: PrefabRef<GameObject>): CameraPrefab {
        this._trackTarget = target;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera, c => {
                c.backgroundColor = new Color(0, 0, 0, 1);
                c.viewSize = 8;
                c.cameraType = CameraType.Orthographic;
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
                c.targetOffset = new Vector2(0, 3);
            });
    }
}
