import {
    AsyncImageLoader,
    Bootstrapper as BaseBootstrapper,
    CameraRelativeZaxisSorter,
    CssCollideTilemapChunkRenderer,
    CssTilemapChunkRenderer,
    GameObject,
    GridCollideMap,
    GridObjectCollideMap,
    GridPointer,
    PointerGridInputListener,
    PrefabRef,
    SceneBuilder,
    TileAtlasItem
} from "the-world-engine";
import {
    Euler,
    MathUtils,
    Quaternion,
    Vector3
} from "three/src/Three";

import OverworldTileset from "./image/Overworld_Tileset.png";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { BackgroundPrefab } from "./prefab/world/BackgroundPrefab";
import { CollisionPrefab } from "./prefab/world/CollisionPrefab";
import { DetailPrefab } from "./prefab/world/DetailPrefab";
import { IslandPrefab } from "./prefab/world/IslandPrefab";
import { ObjectsPrefab } from "./prefab/world/ObjectsPrefab";
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

                            AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                                if (!c.exists) return;

                                c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                                function f(a: number): { i: 0, a: number } {
                                    return { i: 0, a: a };
                                }

                                const array2d: { i: 0; a: number; }[][] = [];
                                for (let i = 0; i < 13; i++) {
                                    array2d[i] = [];
                                    for (let j = 0; j < 18; j++) {
                                        array2d[i][j] = f(i * 18 + j);
                                    }
                                }

                                c.drawTileFromTwoDimensionalArray(array2d, 0, 0);
                            });
                        })
                        .withComponent(DrawIndex, c => {
                            c.column = 18;
                            c.row = 13;
                        })))

                .withChild(instantiater.buildPrefab("collision", CollisionPrefab)
                    .getCollideMap(collideMap)
                    .getObjectCollideMap(objectCollideMap)
                    .make())
                    
                .withChild(instantiater.buildPrefab("objects", ObjectsPrefab)
                    .withObjectCollideMap(objectCollideMap).make()))

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
                
            .withChild(instantiater.buildPrefab("camera", CameraPrefab,
                new Vector3(0, 0, 10),
                new Quaternion()
                    .setFromEuler(new Euler(-10 * MathUtils.DEG2RAD, -10 * MathUtils.DEG2RAD, 0))
                    .set(0, 0, 0, 1)
            ).withTarget(player).make())
        ;
    }
}