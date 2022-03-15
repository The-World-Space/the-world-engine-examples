import { 
    Bootstrapper,
    CssCollideTilemapChunkRenderer,
    GameObject,
    GridObjectCollideMap,
    PrefabRef,
    SceneBuilder
} from "the-world-engine";
import { Vector2 } from "three/src/Three";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";

export class TestGameBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        
        const colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideMap = new PrefabRef<GridObjectCollideMap>();
        const player = new PrefabRef<GameObject>();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(colideTilemapChunkRenderer)
                .getGridObjectCollideMapRef(collideMap).make())
            
            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(colideTilemapChunkRenderer)
                .withGridPosition(new PrefabRef(new Vector2(0, -1))).make()
                .getGameObject(player))
                
            .withChild(instantiater.buildPrefab("camera", CameraPrefab)
                .withTrackTarget(player).make())
        ;
    }
}
