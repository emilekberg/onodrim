export default class Random {
	public static float(min:number, max:number):number {
		return min + (Math.random()*(max-min));
	}

	public static int(min:number, max:number):number {
		return Math.round(this.float(min, max-1));
	}
}
