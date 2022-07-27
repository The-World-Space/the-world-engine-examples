import { AsyncImageLoader, CssSpriteAtlasRenderer, GridCollider } from "the-world-engine";
import { Vector2 } from "three/src/Three";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { ImageCrop } from "../../script/ImageCrop";
import { StaticObjectPrefabBase } from "./StaticObjectPrefabBase";

export class House2Prefab extends StaticObjectPrefabBase {
    protected rendererInitializer(c: CssSpriteAtlasRenderer): void {
        AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
            const croppedImage = ImageCrop.crop(image, 16 * 9, 16 * 5, 16 * 5, 16 * 4);
            c.asyncSetImageFromPath(croppedImage, 1, 1);
            c.imageIndex = 0;
            c.imageWidth = 6;
            c.imageHeight = 5;
            c.centerOffset = new Vector2(0, 0.45);
            c.filter.brightness = 1.5;
        });
    }

    protected colliderInitializer(c: GridCollider): void {
        c.addColliderFromTwoDimensionalArray([
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ], -2, 1);
    }
}
