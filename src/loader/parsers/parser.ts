import Resource from '../resource';
export abstract class Parser {
	public abstract canParse(resource: Resource): boolean;
	public abstract parse(data: Resource): Promise<{}>;
}
export default Parser;
