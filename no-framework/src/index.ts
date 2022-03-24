import { Game } from "the-world-engine";
import { TestGameBootstrapper } from "./asset/TestGameBootstrapper";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(TestGameBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.getElementById("game_view")!);
