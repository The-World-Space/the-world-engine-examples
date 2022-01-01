import { 
    Bootstrapper,
    Camera,
    CssSpriteRenderer,
    SceneBuilder
} from "the-world-engine";
import { Vector3 } from "three";
import { Rotator } from "./script/Rotator";

export class TestGameBootstrapper extends Bootstrapper {
    run(): SceneBuilder {
        const instantlater = this.engine.instantlater;
        
        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.viewSize = 100;
                }))

            .withChild(instantlater.buildGameObject("test_object")
                .withComponent(CssSpriteRenderer)
                .withComponent(Rotator));
    }
}
