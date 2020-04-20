import { GPU } from 'gpu.js';
import { rgbKernel, hsv2rgb, rgb2hsv, hsvKernel, rgb2cmyk, cmyk2rgb, cmykKernel } from '../kernels';
import { createCanvas } from '../utils';

const CANVAS_STYLE = 'max-height: 75vh; max-width: 100%;';

export function setupRGBKernel(image) {
  const canvasContainer = document.getElementById('canvas-container');
  const canvas = createCanvas([image.width, image.height], {
    el: canvasContainer,
    style: CANVAS_STYLE
  });

  const gpu = new GPU({
    canvas,
    // Need to preserve the drawing buffer for ability to save images.
    context: canvas.getContext('webgl2', { preserveDrawingBuffer: true })
  });

  return gpu.createKernel(rgbKernel, {
    graphical: true,
    output: [image.width, image.height]
  });
}

export function setupHSVKernel(image) {
  const canvasContainer = document.getElementById('canvas-container');
  let canvas = createCanvas([image.width, image.height], {
    el: canvasContainer,
    style: CANVAS_STYLE
  });

  let gpu = new GPU({
    canvas,
    // Need to preserve the drawing buffer for ability to save images.
    context: canvas.getContext('webgl2', { preserveDrawingBuffer: true })
  });

  gpu.addFunction(rgb2hsv);
  gpu.addFunction(hsv2rgb);

  let kernel = gpu.createKernel(hsvKernel, {
    graphical: true,
    output: [image.width, image.height]
  });

  return kernel;
}

export function setupCMYKKernel(image) {
  const canvasContainer = document.getElementById('canvas-container');
  let canvas = createCanvas([image.width, image.height], {
    el: canvasContainer,
    style: CANVAS_STYLE
  });

  let gpu = new GPU({
    canvas,
    // Need to preserve the drawing buffer for ability to save images.
    context: canvas.getContext('webgl2', { preserveDrawingBuffer: true })
  });

  gpu.addFunction(cmyk2rgb);
  gpu.addFunction(rgb2cmyk);

  let kernel = gpu.createKernel(cmykKernel, {
    graphical: true,
    output: [image.width, image.height]
  });

  return kernel;
}