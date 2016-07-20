export default class RenderSystem {
    constructor() {

    }

    static isWebGLSupported():boolean {
        try{
            var canvas = document.createElement('canvas');
            let webGLContextExistsInWinow:boolean = !!WebGLRenderingContext;
            let webGLContextExistsInCanvas:boolean = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            return (webGLContextExistsInWinow && webGLContextExistsInCanvas);
        }
        catch(e) {
            return false;
        }
    }

    render(delta:number) {

    }
}