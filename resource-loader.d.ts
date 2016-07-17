declare module 'resource-loader';
export class Options {
    crossOrigin?: boolean | string;
    loadType?: number;
    xhrType?: string;
    metaData?: any;
}
export default class Loader {
    add(name:string, url:string, options:Options):Loader;
    before(middleware:(resource, next)=>void):Loader;
    after(parsingMiddleware:(resource, next)=>void):Loader;

    load(cb:(loader, resources)=>void):Loader;
    on(event:'progress'|'error'|'load'|'complete', ...args);
}