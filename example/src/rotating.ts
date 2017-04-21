import * as Onodrim from 'onodrim';

export default class Rotating extends Onodrim.Components.Component {
   private _transform: Onodrim.Components.Transform2D;
   constructor(entity: Onodrim.Entity) {
      super(entity);

      this._transform = entity.getComponent(Onodrim.Components.Transform2D);
   }

   public fixedUpdate() {
      this._transform.rotation += 10 * Onodrim.Time.deltaTime;
   }
}
