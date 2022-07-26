import {
    AsyncImageLoader,
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssTilemapChunkRenderer,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder,
    TileAtlasItem,
    TwoDimensionalStringMapper
} from "the-world-engine";

import OverworldTileset from "./image/Overworld_Tileset.png";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))

            .withChild(instantiater.buildGameObject("world")
                .withChild(instantiater.buildGameObject("tilemap")
                    .withChild(instantiater.buildGameObject("background")
                        .withComponent(CssTilemapChunkRenderer, c => {
                            c.chunkSize = 15;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                function f(a: number): { i: 0, a: number } {
                                    return { i: 0, a: a };
                                }

                                const converter = {
                                    /* eslint-disable @typescript-eslint/naming-convention */
                                    "0": () => f(0),
                                    "1": () => f(1),
                                    "2": () => f(2),
                                    "3": () => f(3),
                                    "4": () => f(4),
                                    "5": () => f(5)
                                    /* eslint-enable @typescript-eslint/naming-convention */
                                };

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        ["012345"],
                                        converter
                                    ), 0, 0
                                );
                            });
                        })
                    )
                )
            )
        ;
    }
}
