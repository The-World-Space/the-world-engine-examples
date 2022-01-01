import { 
    Bootstrapper,
    CssCollideTilemapChunkRenderer,
    GameObject,
    GridObjectCollideMap,
    PrefabRef,
    SceneBuilder
} from "the-world-engine";
import { Vector2 } from "three";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";

export class TestGameBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;
        
        const colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideMap = new PrefabRef<GridObjectCollideMap>();
        const player = new PrefabRef<GameObject>();

        return this.sceneBuilder
            .withChild(instantlater.buildPrefab("camera", CameraPrefab)
                .withTrackTarget(player).make())

            .withChild(instantlater.buildPrefab("sans_fight_room", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(colideTilemapChunkRenderer)
                .getGridObjectCollideMapRef(collideMap).make())
            
            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(colideTilemapChunkRenderer)
                .withGridPosition(new PrefabRef(new Vector2(0, -1))).make()
                .getGameObject(player));
    }
}
