import * as Onodrim from "onodrim";
import Game from "./game";

Onodrim.Resources.ResourceManager.loadImages([
    "assets/star.png",
    "assets/SlimeA.png",
    "assets/square.png",
    "assets/tile.png"
]).then((value) => {
    let core:Onodrim.Core = new Onodrim.Core({
        width: window.innerWidth,
        height: window.innerHeight
    });
    let game:Game = new Game();
    core.start(game);
});
