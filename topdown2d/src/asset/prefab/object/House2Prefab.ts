import { CssHtmlElementRenderer, CssSpriteAtlasRenderer, GameObjectBuilder, GridCollider } from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { StaticObjectPrefabBase } from "./StaticObjectPrefabBase";

export class House2Prefab extends StaticObjectPrefabBase {
    protected rendererInitializer(c: CssSpriteAtlasRenderer): void {
        c.destroy();
    }

    protected colliderInitializer(c: GridCollider): void {
        c.addColliderFromTwoDimensionalArray([
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ], -2, 1);
    }

    public override make(): GameObjectBuilder {
        return super.make()
            .withChild(this.instantiater.buildGameObject("custom-sprite",
                undefined, undefined, new Vector3().setScalar(1 / 16))
                .withComponent(CssHtmlElementRenderer, c => {
                    const img = document.createElement("img");
                    img.src = OverworldTileset;
                    img.style.objectFit = "none";
                    img.style.imageRendering = "pixelated";
                    img.style.objectPosition = -16 * 9 + "px " + -16 * 5 + "px";
                    c.element = img;
                    c.viewScale = 1;
                    c.elementWidth = 16 * 5;
                    c.elementHeight = 16 * 4;
                    c.centerOffset = new Vector2(0, 0.453);
                    c.filter.brightness = 1.5;
                }))
        ;
    }
}
