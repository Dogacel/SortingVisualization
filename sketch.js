
var warnedData = false;

var sizeSlider, sizeSliderValue;
var maxSlider, maxSliderValue;
var rainbow;

var updateCaller = true;

var canvas;

function setup() {

  let canvasWidth = 600, canvasHeight = 600;

  hr();

  let resetButton = createButton("Reset");
  resetButton.mouseClicked(() => {
    sizeSlider.value(canvasWidth / 8);
    maxSlider.value(canvasHeight / 8);
    updateSent()
  });

  colorButton = createCheckbox('Rainbow mode');
  colorButton.mouseClicked(() => {
    rainbow = colorButton.checked();
    updateSent();
  });

  hr();

  sizeSlider = createSlider(2, canvasWidth / 4, canvasWidth / 8, 1);
  maxSlider = createSlider(2, canvasHeight / 4, canvasHeight / 8, 1);

  sizeSlider.style('width', canvasWidth / 2 - 5 + 'px');
  maxSlider.style('width', canvasWidth / 2 - 5 + 'px');

  let pressed = false;

  sizeSlider.mousePressed(() => {
    pressed = true;
  });

  sizeSlider.mouseReleased(() => {
    pressed = false;
  });

  sizeSlider.mouseMoved(() => {
    if (pressed)
      updateSent();
  });

  maxSlider.mousePressed(() => {
    pressed = true;
  });

  maxSlider.mouseReleased(() => {
    pressed = false;
  });

  maxSlider.mouseMoved(() => {
    if (pressed)
      updateSent();
  });

  hr();

  canvas = createCanvas(canvasWidth, canvasHeight);

  console.log("Setup complete !");

}

function hr() {
  createElement('hr');
}

function updateSent() {
  updateCaller = true;
}

function updateRecieved() {
  updateCaller = false;
}

function draw() {

  if (updateCaller) {
    updateRecieved();

    background(0);
    plotData(randomArray(sizeSlider.value(), 0, maxSlider.value()), canvas.width, canvas.height, rainbow);
  }
}

function randomArray(size, min, max) {
  var data = [];
  for(var i = 0 ; i < size ; i++) {
    append(data,  int(random(min, max)));
  }
  return data;
}


function plotData(inData, canvasWidth, canvasHeight, color) {

  var width = canvasWidth, height = canvasHeight;
  var dataWidth = inData.length;
  var dataHeight = Math.max.apply(null, inData) - Math.min.apply(null, inData);

  var scale = 1;
  if (dataWidth > canvasWidth / 4) {
    scale = (4 * dataWidth / canvasWidth);
    warnDataOnce(scale);
  }


  for (var index in inData) {

    if (color == "rainbow" || color == true) {
      var i = map(index, 0, dataWidth, 0, 255);

      var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
      var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
      var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);

      fill(r,g,b);
    } else if (color != null && color != false) {
      fill(color);
    } else {
      fill(255);
    }


    rect(
      (index) * (scale * width / dataWidth),
      height - ((inData[index]) * (height / dataHeight)),
      (scale * width / dataWidth),
      (inData[index]) * (height / dataHeight));
    }
  }

  function warnDataOnce(scale) {
    if (!warnedData) {
      console.warn("Dataset can't fit to desired area. Graph will show 1 column for " + scale + " element.");
      warnedData = !warnedData;
    }

  }
