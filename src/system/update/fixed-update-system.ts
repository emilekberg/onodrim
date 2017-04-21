import System, { TickSystem } from '../system';
import { UpdateComponent } from '../../components/component';
import Time from '../../time';

export default class FixedUpdateSystem extends System<UpdateComponent> implements TickSystem<UpdateComponent> {
   public readonly updateRate: number;
   public currentUpdateTime: number;
   public nextUpdateTime: number;
   constructor() {
      super();
      this.updateRate = 1/30;
      this.currentUpdateTime = Time.now();
      this.nextUpdateTime = Time.now() + this.updateRate;
   }

   public canProcessComponent(component: UpdateComponent): boolean {
      return component.fixedUpdate !== undefined;
   }

   public tick(): void {
      Time.setFixedUpdateTime(this.updateRate);
      while(Time.now() >= this.nextUpdateTime) {
         const l = this._componentInstances.length;
         for(let i = 0; i < l; ++i) {
            this._componentInstances[i].fixedUpdate();
         }
         this.currentUpdateTime = this.nextUpdateTime;
         this.nextUpdateTime += this.updateRate;
      }
   }
}
