//import { useEffect, useRef, useState } from "react";
//import { Game } from "the-world-engine";
import "./App.css";
import { TestGameBootstrapper } from "./game/TestGameBootstrapper";
import { Game } from "the-world-engine-react";

function App(): JSX.Element {
    /*
    const div = useRef<HTMLDivElement>(null);
    const [game, setGame] = useState<Game|null>(null);

    useEffect(() => {
        if (!div.current) return;

        if (game) {
            game.inputHandler.stopHandleEvents();
            game.dispose();
            setGame(null);
        }

        const newGame = new Game(div.current);
        newGame.run(TestGameBootstrapper);
        newGame.inputHandler.startHandleEvents();
        setGame(newGame);

        return () => {
            newGame.inputHandler.stopHandleEvents();
            newGame.dispose();
            setGame(null);
        };
    }, [div]);

    return (<div className="App" ref={div}/>);
    */

    return <Game bootstrapper={TestGameBootstrapper} />;
}

export default App;
