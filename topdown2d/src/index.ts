import { Game } from "the-world-engine";

import { Bootstrapper } from "./asset/Bootstrapper";

const game = new Game(document.body);
game.run(Bootstrapper);
game.inputHandler.startHandleEvents();
