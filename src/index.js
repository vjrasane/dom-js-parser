import Mechanism from "~/mechanism";
import engine from "~/engine";

const init = () => ({ counter: 0 });

const decrement = () => ({ action: "decrement" });
const increment = () => ({ action: "increment" });

const update = (msg, model) => {
  switch (msg.action) {
    case "increment":
      return { ...model, counter: model.counter + 1 };
    case "decrement":
      return { ...model, counter: model.counter - 1 };
    default:
      return model;
  }
};

const view = model => (
  <div>
    <div>Counter: {model.counter}</div>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);

engine({
  init,
  update,
  view
})({ node: document.getElementById("root") });
