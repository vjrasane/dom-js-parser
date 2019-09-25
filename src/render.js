import { isFunction, exists } from "~/utils";
import { isMechanismElement } from "~/mechanism";

const isEventProp = name => /^on/.test(name);

const extractEventName = name => name.slice(2).toLowerCase();

const removeBooleanProp = ($target, name) => {
  $target.removeAttribute(name);
  $target[name] = false;
};

const removeProp = ($target, name, value) => {
  if (name === "className") {
    $target.removeAttribute("class");
  } else if (typeof value === "boolean") {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
};

const setBooleanProp = ($target, name, value) => {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
};

const propChanged = (firstProp, secondProp) =>
  !(
    firstProp === secondProp ||
    (isFunction(firstProp) &&
      isFunction(secondProp) &&
      firstProp.toString() === secondProp.toString())
  );

const nodeChanged = (firstNode, secondNode) =>
  !(
    firstNode === secondNode ||
    (isMechanismElement(firstNode) &&
      isMechanismElement(secondNode) &&
      firstNode.type === secondNode.type)
  );

export default eventListenerCallback => {
  const wrapEventListener = listener => (...args) =>
    eventListenerCallback(listener(...args));

  const setProp = ($target, name, value) => {
    if (isEventProp(name)) {
      $target.addEventListener(
        extractEventName(name),
        wrapEventListener(value)
      );
    } else if (name === "className") {
      $target.setAttribute("class", value);
    } else if (typeof value === "boolean") {
      setBooleanProp($target, name, value);
    } else {
      $target.setAttribute(name, value);
    }
  };

  const setProps = ($target, props) => {
    Object.keys(props).forEach(name => {
      setProp($target, name, props[name]);
    });
  };

  const updateProp = ($target, name, newValue, oldValue) => {
    if (!newValue) {
      removeProp($target, name, oldValue);
    } else if (!oldValue || propChanged(newValue, oldValue)) {
      setProp($target, name, newValue);
    }
  };

  const updateProps = ($target, newProps, oldProps = {}) => {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
      updateProp($target, name, newProps[name], oldProps[name]);
    });
  };

  const createElement = node => {
    if (isMechanismElement(node)) {
      const $el = document.createElement(node.type);
      setProps($el, node.props);
      node.children.map(createElement).forEach($el.appendChild.bind($el));
      return $el;
    }
    return document.createTextNode(node);
  };

  const updateElement = ($parent, newNode, oldNode, index = 0) => {
    if (!exists(oldNode)) {
      $parent.appendChild(createElement(newNode));
    } else if (!exists(newNode)) {
      $parent.removeChild($parent.childNodes[index]);
    } else if (nodeChanged(newNode, oldNode)) {
      $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    } else if (isMechanismElement(newNode)) {
      updateProps($parent.childNodes[index], newNode.props, oldNode.props);
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i
        );
      }
    }
  };

  return updateElement;
};
