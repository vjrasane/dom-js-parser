import Mechanism from "~/mechanism";
import { default as engine, Cmd, Return, Sub } from "~/engine";

const setTimeoutPromise = ms => new Promise(resolve => setTimeout(resolve, ms));

const init = () => ({ counter: 0 });

const decrement = { action: "decrement" };
const increment = { action: "increment" };
const command = { action: "command" };
const modify = amount => ({ action: "modify", amount });
const toggle = { action: "toggle" };

const update = (msg, model) => {
  switch (msg.action) {
    case "increment":
      return { ...model, counter: model.counter + 1 };
    case "decrement":
      return { ...model, counter: model.counter - 1 };
    case "modify":
      return { ...model, counter: model.counter + msg.amount };
    case "command":
      return Return(model, Cmd(setTimeoutPromise(1000).then(() => 5), modify));
    case "toggle":
      return { ...model, toggled: !model.toggled };
    default:
      return model;
  }
};

const view = model => (
  <>
    <div>
      <div>Counter: {model.counter}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={command}>mod</button>
      <button onClick={toggle}>toggle</button>
    </div>
  </>
);

const subscriptions = model =>
  model.toggled && Sub.interval(10, Cmd(5, modify));

engine({
  init,
  update,
  view,
  subscriptions
})({ node: document.getElementById("root") });
