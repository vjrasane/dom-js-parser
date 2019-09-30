export class Return {
  constructor(model, ...effects) {
    this.model = model;
    this.effects = effects || [];
  }
}
