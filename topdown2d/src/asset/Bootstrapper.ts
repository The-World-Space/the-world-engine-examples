import {
    AsyncImageLoader,
    Bootstrapper as BaseBootstrapper,
    Camera,
    CameraRelativeZaxisSorter,
    CameraType,
    CssCollideTilemapChunkRenderer,
    CssTilemapChunkRenderer,
    EditorCameraController,
    EditorGridRenderer,
    GameObject,
    GridCollideMap,
    GridObjectCollideMap,
    GridPointer,
    PointerGridInputListener,
    PrefabRef,
    SceneBuilder,
    TileAtlasItem,
    TrackCameraController,
    TwoDimensionalStringMapper
} from "the-world-engine";
import {
    Euler,
    MathUtils,
    Quaternion,
    Vector3
} from "three/src/Three";

import OverworldTileset from "./image/Overworld_Tileset.png";
import { House1Prefab } from "./prefab/object/House1Prefab";
import { House2Prefab } from "./prefab/object/House2Prefab";
import { Tree1Prefab } from "./prefab/object/Tree1Prefab";
import { Tree2Prefab } from "./prefab/object/Tree2Prefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { BackgroundPrefab } from "./prefab/world/BackgroundPrefab";
import { DetailPrefab } from "./prefab/world/DetailPrefab";
import { IslandPrefab } from "./prefab/world/IslandPrefab";
import { DrawIndex } from "./script/DrawIndex";
import { LastPositionSaver } from "./script/LastPositionSaver";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const objectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const pointer = new PrefabRef<GridPointer>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("world")
                .withChild(instantiater.buildGameObject("tilemap")
                    .withChild(instantiater.buildPrefab("background", BackgroundPrefab).make())

                    .withChild(instantiater.buildPrefab("islands", IslandPrefab)
                        .getCollideTilemap(collideTilemap).make())

                    .withChild(instantiater.buildPrefab("detail", DetailPrefab)
                        .getCollideTilemap(collideTilemap2).make())

                    .withChild(instantiater.buildGameObject("test")
                        .active(false)
                        .withComponent(CssTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16 << 1;
                            c.tileResolutionY = 16 << 1;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                function f(a: number): { i: 0, a: number } {
                                    return { i: 0, a: a };
                                }

                                // const converter = {
                                //     /* eslint-disable @typescript-eslint/naming-convention */
                                //     "0": () => f(0),
                                //     "1": () => f(1),
                                //     "2": () => f(2),
                                //     "3": () => f(3),
                                //     "4": () => f(4),
                                //     "5": () => f(5)
                                //     /* eslint-enable @typescript-eslint/naming-convention */
                                // };

                                const array2d: { i: 0; a: number; }[][] = [];
                                for (let i = 0; i < 13; i++) {
                                    array2d[i] = [];
                                    for (let j = 0; j < 18; j++) {
                                        array2d[i][j] = f(i * 18 + j);
                                    }
                                }

                                c.drawTileFromTwoDimensionalArray(
                                    array2d,
                                    0, 0
                                );
                            });
                        })
                        .withComponent(DrawIndex, c => {
                            c.column = 18;
                            c.row = 13;
                        })))

                .withChild(instantiater.buildGameObject("collision")
                    .withComponent(GridCollideMap, c => {
                        c.showCollider = true;

                        c.addColliderFromTwoDimensionalArray(
                            TwoDimensionalStringMapper.map(
                                [],
                                /* eslint-disable @typescript-eslint/naming-convention */
                                { " ": () => 0, "%": () => 1 }
                                /* eslint-enable @typescript-eslint/naming-convention */
                            ),
                            0, 0
                        );
                    })
                    .withComponent(GridObjectCollideMap, c => {
                        c.showCollider = false;
                    })
                    .getComponent(GridCollideMap, collideMap)
                    .getComponent(GridObjectCollideMap, objectCollideMap))
                    
                .withChild(instantiater.buildGameObject("object")
                    .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(0, 2, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-5, 2, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-7, 3, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(2, -1, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(9, 7, 0))
                        .withObjectCollideMap(objectCollideMap).make())
                    
                    .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(10, 6, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("house1", House1Prefab, new Vector3(5, 6, 0))
                        .withObjectCollideMap(objectCollideMap).make())

                    .withChild(instantiater.buildPrefab("house2", House2Prefab, new Vector3(-5, -5, 0))
                        .withObjectCollideMap(objectCollideMap).make())
                ))

            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(objectCollideMap)
                .withCollideMap(collideTilemap)
                .withCollideMap(collideTilemap2)
                .withGridPointer(pointer)
                .withGridPosition(new PrefabRef(LastPositionSaver.loadPosition()))
                .make()
                .withComponent(LastPositionSaver)
                .getGameObject(player))

            .withChild(instantiater.buildGameObject("pointer")
                .withComponent(PointerGridInputListener)
                .withComponent(GridPointer)
                .withComponent(CameraRelativeZaxisSorter, c => {
                    c.offset = 0;
                })
                .getComponent(GridPointer, pointer))
                
            .withChild(instantiater.buildGameObject("camera", 
                new Vector3(0, 0, 10),
                new Quaternion()
                    .setFromEuler(new Euler(-10 * MathUtils.DEG2RAD, -10 * MathUtils.DEG2RAD, 0))
                    .set(0, 0, 0, 1)
            )
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
                    c.setTrackTarget(player.ref!);
                }))
        ;
    }
}
