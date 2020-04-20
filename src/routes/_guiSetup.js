import dat from 'dat.gui';
import throttle from 'lodash.throttle';

export function setupRGBGui(kernel, params) {
  const guiContainer = document.getElementById('gui');
  const gui = new dat.GUI({ autoPlace: false });
  guiContainer.appendChild(gui.domElement);

  const onChange = throttle(() => {
    kernel(params.image, params.red, params.green, params.blue);
  }, 50);

  const fns = {
    reset: () => {
      params.red = 1;
      params.green = 1;
      params.blue = 1;
      onChange();
    }
  }

  gui.add(params, 'red', 0, 3).onChange(onChange).listen();
  gui.add(params, 'green', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(params, 'blue', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(fns, 'reset');

  return [gui, onChange];
}

export function setupHSVGui(kernel, params) {
  const guiContainer = document.getElementById('gui');
  const gui = new dat.GUI({ autoPlace: false });
  guiContainer.appendChild(gui.domElement);

  const onChange = throttle(() => {
    kernel(params.image, params.hue, params.saturation, params.value);
  }, 50);

  const fns = {
    reset: () => {
      params.hue = 0;
      params.saturation = 1;
      params.value = 1;
      onChange();
    }
  }

  gui.add(params, 'hue', -180, 180).onChange(onChange).listen();
  gui.add(params, 'saturation', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(params, 'value', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(fns, 'reset');

  return [gui, onChange];
}

export function setupCMYKGui(kernel, params) {
  const guiContainer = document.getElementById('gui');
  const gui = new dat.GUI({ autoPlace: false });
  guiContainer.appendChild(gui.domElement);

  const onChange = throttle(() => {
    kernel(params.image, params.cyan, params.magenta, params.yellow, params.key);
  }, 50);

  const fns = {
    reset: () => {
      params.cyan = 1;
      params.magenta = 1;
      params.yellow = 1;
      params.key = 1;
      onChange();
    }
  }

  gui.add(params, 'cyan', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(params, 'magenta', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(params, 'yellow', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(params, 'key', 0, 3).step(0.01).onChange(onChange).listen();
  gui.add(fns, 'reset');

  return [gui, onChange];
}