function isArray(o) {
  return Array.isArray(o);
}

function createEl(name) {
  return document.createElement(name);
}

function byId(a) {
  return document.getElementById(a);
}

function byClass(cl) {
  return document.querySelectorAll(cl);
}

function remove(parent, child) {
  parent.removeChild(child);
}

function addClass(el, classname) {
  if (isArray(classname)) {
    classname.map((cl) => {
      el.classList.add(cl);
    });
  } else {
    el.classList.add(classname);
  }
}

function hasClass(el, classname) {
  return el.classList.contains(classname);
}

function removeClass(el, classname) {
  if (isArray(classname)) {
    classname.map((cl) => {
      el.classList.remove(cl);
    });
  } else {
    el.classList.remove(classname);
  }
}

function toggleClass(el, classname) {
  if (isArray(classname)) {
    classname.map((cl) => {
      el.classList.toggle(cl);
    });
  } else {
    el.classList.toggle(classname);
  }
}

function appendChild() {
  var el = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    el.appendChild(arguments[i]);
  }
}

function trigger(ele, eventName, isBubbleing) {
  var event = new Event(eventName, { bubbles: isBubbleing !== undefined ? isBubbleing : false, cancelable: false });
  ele.dispatchEvent(event);
}