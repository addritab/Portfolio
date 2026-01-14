var pre = document.getElementById('trace');
var traceChars = document.getElementById('trace-chars');

var i = -1;
var dir = 'inc';
var max = frames.length;
var fps = 35;

// size knob
var SCALE = 0.65;

setPreCharSize();
startAnimating();
window.addEventListener('resize', setPreCharSize);

function setPreCharSize() {
  var charRatio = 0.66;
  var sampleLine = frames[0].split('\n')[1] || frames[0];

  var charWidth = fitTextToContainer(
    sampleLine,
    getComputedStyle(pre).fontFamily,
    pre.clientWidth
  ) * charRatio;

  var charHeight = charRatio * charWidth;

  pre.style.fontSize = (charWidth * SCALE) + "px";
  pre.style.lineHeight = (charHeight * SCALE) + "px";
}

var fpsInterval, then;
function startAnimating() {
  fpsInterval = 1000 / fps;
  then = Date.now();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  var now = Date.now();
  var elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    step();
  }
}

function step() {
  if (dir === 'inc') {
    if (i === max - 1) { dir = 'dec'; i--; }
    else { i++; }
  } else {
    if (i === 0) { dir = 'inc'; i++; }
    else { i--; }
  }
  traceChars.innerText = frames[i];
}

function fitTextToContainer(text, fontFace, containerWidth) {
  const PIXEL_RATIO = getPixelRatio();

  let canvas = createHiDPICanvas(containerWidth, 0),
    context = canvas.getContext('2d'),
    longestLine = getLongestLine(split(text)),
    fittedFontSize = getFittedFontSize(longestLine, fontFace);

  return fittedFontSize;

  function getPixelRatio() {
    let ctx = document.createElement("canvas").getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
  }

  function split(text) { return text.split('\n'); }

  function getLongestLine(lines) {
    let longest = -1, idx;
    lines.forEach((line, ii) => {
      let lineWidth = context.measureText(line).width;
      if (lineWidth > longest) {
        idx = ii;
        if (!line.includes('exempt-from-text-fit-calculation')) {
          longest = lineWidth;
        }
      }
    });
    return (typeof idx === 'number') ? lines[idx] : null;
  }

  function getFittedFontSize(text, fontFace) {
    const fits = () => context.measureText(text).width <= canvas.width;
    const font = (size, face) => size + "px " + face;

    let fontSize = 300;
    do {
      fontSize--;
      context.font = font(fontSize, fontFace);
    } while (!fits());

    fontSize /= (PIXEL_RATIO / 1.62);
    return fontSize;
  }

  function createHiDPICanvas(w, h) {
    let canvas = document.createElement("canvas");
    canvas.width = w * PIXEL_RATIO;
    canvas.height = h * PIXEL_RATIO;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    return canvas;
  }
}
