import { isFunction } from "./utils";

const listeners = {};

window.$mechanism = { listeners };

const mechanism = program => {
  const value = 'HENLO!<<<"';
  const html = render(
    <div style="border: solid 0.1px" onClick={() => console.log("ASD!")}>
      {"HELLO WORLD!<'\""}
      <ul>
        HERP
        <li>{value}</li>
      </ul>
    </div>
  );
  program.elem.innerHTML = html;
};

// const elem = curry((elem, attrs, inner) => ({ elem, attrs, inner }));
// const ul = elem("ul");
// const li = elem("li");

// const attr = curry((key, value) => ({ key, value }));
// const className = attr("class");
// const style = attr("style");

// const div = elem("div");

const renderInner = inner => inner.map(render).join("");

const renderAttrs = attrs =>
  Object.entries(attrs)
    .map(([key, value]) => {
      if (isFunction(value)) {
        listeners[key] = value;
        return `${key}=$mechanism.listeners['${key}']()`;
      }
      return `${key}="${value}"`;
    })
    .join(" ");

const renderElem = ({
  elementName: elem,
  attributes: attrs,
  children: inner
}) =>
  `<${elem} ${attrs ? renderAttrs(attrs) : ""}>
    ${inner ? renderInner(inner) : ""}
    </${elem}>`;

const render = dom => (dom.elementName ? renderElem(dom) : dom);

const init = flags => {};

const update = (msg, model) => {};

const view = model => {};

export default mechanism;
