import {
    Camera,
    CameraType,
    EditorCameraController,
    EditorGridRenderer,
    GameObject,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TrackCameraController
} from "the-world-engine";

export class CameraPrefab extends Prefab {
    private _target = new PrefabRef<GameObject>();

    public withTarget(target: PrefabRef<GameObject>): this {
        this._target = target;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera, c => {
                c.cameraType = CameraType.Orthographic;
            })
            .withComponent(EditorCameraController, c => {
                c.mouseMoveButton = 0;
            })
            .withComponent(EditorGridRenderer, c => {
                c.renderWidth = 50;
                c.renderHeight = 50;
                c.zOffset = -1;
                c.enabled = false;
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._target.ref!);
            })
        ;
    }
}
