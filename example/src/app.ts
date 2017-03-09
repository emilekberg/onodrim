import * as Onodrim from 'onodrim';
import Game from './game';

Onodrim.Loader
    .add('assets/assets.json')
    .start()
    .then((value) => {
    const core:Onodrim.Core = new Onodrim.Core({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const game:Game = new Game();
    core.start(game);
});
