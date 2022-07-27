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
import { DrawIndex } from "./script/DrawIndex";
import { LastPositionSaver } from "./script/LastPositionSaver";
import { MakeIsland } from "./script/MakeIsland";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const objectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const pointer = new PrefabRef<GridPointer>();

        const islandList = [
            { width: 16, height: 6, topEntry: 1, bottomEntry: 2, x: -4, y: 3 },
            { width: 15, height: 8, topEntry: 8, bottomEntry: 3, x: -8, y: -9 }
        ];

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("world")
                .withChild(instantiater.buildGameObject("tilemap")
                    .withChild(instantiater.buildGameObject("background")
                        .withComponent(CameraRelativeZaxisSorter, c => {
                            c.offset = -100;
                        })
                        .withComponent(CssTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16;
                            c.tileResolutionY = 16;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                const grass = { i: 0 as const, a: 24 };
                                const planeSize = 51;

                                const array2d: { i: 0; a: number; }[][] = [];
                                for (let i = 0; i < planeSize; i++) {
                                    array2d[i] = [];
                                    for (let j = 0; j < planeSize; j++) {
                                        array2d[i][j] = grass;
                                    }
                                }

                                const planeSizeHalf = Math.floor(planeSize / 2);

                                c.drawTileFromTwoDimensionalArray(
                                    array2d,
                                    -planeSizeHalf, -planeSizeHalf
                                );
                            });
                        }))

                    .withChild(instantiater.buildGameObject("islands")
                        .withComponent(CameraRelativeZaxisSorter, c => {
                            c.offset = -99;
                        })
                        .withComponent(CssCollideTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16;
                            c.tileResolutionY = 16;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                for (const island of islandList) {
                                    c.drawTileFromTwoDimensionalArray(
                                        MakeIsland.make(island.width, island.height, island.topEntry, island.bottomEntry),
                                        island.x, island.y
                                    );
                                }
                            });
                        })
                        .withComponent(CssTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16;
                            c.tileResolutionY = 16;

                            const topEntry = 6;
                            const bottomEntry = 42;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                for (const island of islandList) {
                                    const entry = MakeIsland.computeEntryPosition(
                                        island.height, island.topEntry, island.bottomEntry, island.x, island.y);

                                    if (entry.top) c.drawTile(entry.top.x, entry.top.y, 0, topEntry);
                                    if (entry.bottom) c.drawTile(entry.bottom.x, entry.bottom.y, 0, bottomEntry);
                                }
                            });
                        })
                        .getComponent(CssCollideTilemapChunkRenderer, collideTilemap))

                    .withChild(instantiater.buildGameObject("detail")
                        .withComponent(CameraRelativeZaxisSorter, c => {
                            c.offset = -98;
                        })
                        .withComponent(CssCollideTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16;
                            c.tileResolutionY = 16;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                function f(a: number): { i: 0; a: number; } {
                                    return { i: 0, a: a };
                                }

                                const converter = {
                                    /* eslint-disable @typescript-eslint/naming-convention */
                                    //rock
                                    "o": () => f(93),
                                    "O": () => f(94),
                                    //sign
                                    "#": () => f(61),
                                    //stump
                                    "@": () => f(75),
                                    "$": () => f(76),
                                    //bush
                                    "*": () => f(58),
                                    "^": () => f(59),

                                    " ": () => null
                                    /* eslint-enable @typescript-eslint/naming-convention */
                                };

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "              ",
                                            "   $          ",
                                            "    #         ",
                                            "              ",
                                            "              "
                                        ],
                                        converter
                                    ),
                                    -3, 4
                                );
                                
                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "             ",
                                            "          o  ",
                                            "         @   ",
                                            "     #       ",
                                            "             ",
                                            "             ",
                                            "O            "
                                        ],
                                        converter
                                    ),
                                    -7, -8
                                );
                            });
                        })
                        .withComponent(CssTilemapChunkRenderer, c => {
                            c.chunkSize = 15;
                            c.filter.brightness = 1.5;
                            c.tileResolutionX = 16;
                            c.tileResolutionY = 16;

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                function f(a: number): { i: 0; a: number; } {
                                    return { i: 0, a: a };
                                }

                                const roadConverter = {
                                    /* eslint-disable @typescript-eslint/naming-convention */
                                    "ㅡ": () => f(47),
                                    "ㅣ": () => f(46),
                                    "ㅕ": () => f(11),
                                    "ㅑ": () => f(29),
                                    "ㅏ": () => f(44),
                                    "ㅓ": () => f(45),
                                    "ㅗ": () => f(62),
                                    "ㅜ": () => f(63),
                                    "ㄱ": () => f(8),
                                    "ㄴ": () => f(26),
                                    "ㄲ": () => f(9),
                                    "ㄹ": () => f(27),
                                    "ㅛ": () => f(28),
                                    "ㅠ": () => f(10),
                                    "ㅇ": () => null
                                    /* eslint-enable @typescript-eslint/naming-convention */
                                };

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "ㅠ",
                                            "ㄴㄱ",
                                            "ㅇㅏㅡㅡㅡㅡㅡㅕ",
                                            "ㅇㅛ"
                                        ],
                                        roadConverter
                                    ),
                                    -3, 4
                                );

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "ㅇㅇㅇㅇㅇㅇㅠ",
                                            "ㅇㅇㅇㅇㅇㅇㅣ",
                                            "ㅑㅡㅡㅡㅡㅡㅗㅡㅜㅡㅡㅡㅡㅡㅡㅕ",
                                            "ㅇㅇㅇㅇㅇㅇㅇㅇㅛ"
                                        ],
                                        roadConverter
                                    ),
                                    -8, -1
                                );

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "ㅇㅇㅇㅇㅇㅠ",
                                            "ㅇㅇㅇㅇㅇㅣ",
                                            "ㅇㅇㅇㅇㅇㅣ",
                                            "ㄲㅡㅡㅡㅡㄹ",
                                            "ㅣㅇㅇㅇㅇㅇ",
                                            "ㅛㅇㅇㅇㅇㅇ"
                                        ],
                                        roadConverter
                                    ),
                                    -5, -8
                                );

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "ㅠ",
                                            "ㅣ",
                                            "ㅣ",
                                            "ㅣ",
                                            "ㅣ",
                                            "ㅛㅇㅇㅇㅇㅇ"
                                        ],
                                        roadConverter
                                    ),
                                    -5, -15
                                );

                                const foliageConverter = {
                                    /* eslint-disable @typescript-eslint/naming-convention */
                                    //grass
                                    "^": () => f(56),
                                    "%": () => f(57),
                                    //flower
                                    "*": () => f(72),
                                    "&": () => f(73),
                                    "!": () => f(90),
                                    "~": () => f(91),
                                    //rock
                                    "o": () => f(74),
                                    "O": () => f(92),

                                    " ": () => null
                                    /* eslint-enable @typescript-eslint/naming-convention */
                                };
                                
                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "     ^",
                                            "",
                                            "^ %  ~*"
                                        ],
                                        foliageConverter
                                    ),
                                    3, 4
                                );

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "O%    ^",
                                            " ^",
                                            "",
                                            "^  %"
                                        ],
                                        foliageConverter
                                    ),
                                    1, -1
                                );

                                c.drawTileFromTwoDimensionalArray(
                                    TwoDimensionalStringMapper.map(
                                        [
                                            "%     ^",
                                            " ",
                                            "      *~",
                                            "    % !~",
                                            "     !**",
                                            "o   !**~"
                                        ],
                                        foliageConverter
                                    ),
                                    -2, -8
                                );
                            });
                        })
                        .getComponent(CssCollideTilemapChunkRenderer, collideTilemap2))

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
