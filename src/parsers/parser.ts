import Resource from '../resources/resource';
export abstract class Parser {
    public abstract canParse(resource: Resource): boolean;
    public abstract parse(data: any): void;
}
export default Parser;
