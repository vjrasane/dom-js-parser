import Mechanism from "./mechanism";
import engine from "./engine";

const init = () => ({ counter: 0 });

const increment = () => ({ action: "increment" });

const update = (msg, model) => {
  switch (msg.action) {
    case "increment":
      return { ...model, counter: model.counter + 1 };
    default:
      return model;
  }
};

const view = model => (
  <div style="border: solid 0.1px" onClick={increment}>
    {"HELLO WORLD!<'\""}
    <ul>
      <li>{model.counter % 2 === 0 ? <div>ASD</div> : model.counter}</li>
    </ul>
  </div>
);

engine({
  init,
  update,
  view
})({ node: document.getElementById("root") });
