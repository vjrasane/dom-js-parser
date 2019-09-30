import Mechanism from "~/mechanism";
import { engine, Cmd, Update, Init, Sub } from "~/engine";

const setTimeoutPromise = ms => new Promise(resolve => setTimeout(resolve, ms));

const init = () => Init({ counter: 0 }, Sub.listen("keypress", keypress));

const decrement = { action: "decrement" };
const increment = { action: "increment" };
const command = { action: "command" };
const modify = amount => ({ action: "modify", amount });
const toggle = { action: "toggle" };
const keypress = event => ({ action: "keypress", event });

const update = (msg, model) => {
  switch (msg.action) {
    case "increment":
      return { ...model, counter: model.counter + 1 };
    case "decrement":
      return { ...model, counter: model.counter - 1 };
    case "modify":
      return { ...model, counter: model.counter + msg.amount };
    case "command":
      return Update(model, Cmd(setTimeoutPromise(1000).then(() => 5), modify));
    case "toggle":
      let interval;
      if (!model.interval) {
        interval = Sub.interval(increment, 10);
      } else {
        model.interval.clear();
      }

      return Update({ ...model, interval }, interval);
    case "keypress":
      console.log(msg.event);
      return;
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

engine({
  init,
  update,
  view
})({ node: document.getElementById("root") });
