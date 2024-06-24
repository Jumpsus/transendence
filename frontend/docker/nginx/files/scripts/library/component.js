export class Component {
  constructor(parentDiv) {
    this.parentDiv = parentDiv;
    this.view = "";
  }

  render() {
    this.parentDiv.innerHTML = "";
    this.parentDiv.innerHTML = this.view;
  }

  setupEventListeners() {}
}
