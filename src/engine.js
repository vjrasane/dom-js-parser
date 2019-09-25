import freeze from "deep-freeze";
import renderer from "./render";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */

export default ({ init, update, view }) => ({ node, flags }) => {
  const queue = [];
  const render = renderer(msg => queue.push(msg));

  let model = freeze(init());
  // update loop
  setInterval(() => {
    if (queue.length > 0) {
      model = freeze(update(queue.shift(), model));
    }
  }, UPDATE_INTERVAL);

  let renderedModel;
  let renderedVirtualDom;
  // view loop
  setInterval(() => {
    if (!renderedModel || renderedModel !== model) {
      const virtualDom = freeze(view(model));
      render(node, virtualDom, renderedVirtualDom);
      renderedModel = model;
      renderedVirtualDom = virtualDom;
    }
  }, VIEW_INTERVAL);
};
