import { useEffect, useRef } from "react";
import { Game } from "the-world-engine";
import "./App.css";
import { TestGameBootstrapper } from "./game/TestGameBootstrapper";

function App(): JSX.Element {
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => { //on component mounted
        if (!div.current) throw new Error("unreachable");
        const game = new Game(div.current);
        game.run(TestGameBootstrapper);
        game.inputHandler.startHandleEvents();

        return () => { //on component unmount
            game.dispose();
        };
    }, []);

    return (<div className="App" ref={div}/>);
}

export default App;
