
var warnedData = false;

var sizeSlider, sizeSliderValue;
var maxSlider, maxSliderValue;
var timeSlider, timeScaleValue;
var rainbow;

var updateCaller = true;

var canvas;

var currentArray;

var colors, specialRows;

function setup() {

  colors = [color(0,0,255), color(0,255,0), color(255,0,0), color(255,255,0), color(255,0,255), color(0,255,255)];
  specialRows = [];

  let canvasWidth = 600, canvasHeight = 600;

  hr();

  let resetButton = createButton("Reset");
  resetButton.mouseClicked(() => {
    sizeSlider.value(canvasWidth / 8);
    maxSlider.value(canvasHeight / 8);
    updateSent()
  });

  let regenButton = createButton("Regenerate Data");
  regenButton.mouseClicked(() => {
    updateSent()
  });

  let sortButton = createButton("Sort Data");
  sortButton.mouseClicked(() => {
    bubbleSort(currentArray);
  });

  colorButton = createCheckbox('Rainbow mode');
  colorButton.mouseClicked(() => {
    rainbow = colorButton.checked();
  });

  hr();

  sizeSlider = createSlider(2, canvasWidth / 4, canvasWidth / 8, 1);
  maxSlider = createSlider(2, canvasHeight / 4, canvasHeight / 8, 1);
  hr();
  timeSlider = createSlider(1, 200, 20, 1);

  sizeSlider.style('width', canvasWidth / 2 - 5 + 'px');
  maxSlider.style('width', canvasWidth / 2 - 5 + 'px');
  timeSlider.style('width', canvasWidth + 'px');

  let pressed = false;

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

  if (updateCaller || sizeSliderValue != sizeSlider.value() || maxSliderValue != maxSlider.value()) {

    maxSliderValue = maxSlider.value();
    sizeSliderValue = sizeSlider.value();

    currentArray = randomArray(sizeSlider.value(), 0, maxSlider.value());

    updateRecieved();
  }

  background(0);
  plotData(currentArray, canvas.width, canvas.height, rainbow);
}

function randomArray(size, min, max) {
  var data = [];
  for(var i = 0 ; i < size ; i++) {
    append(data,  int(random(min, max)));
  }
  return data;
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort(arr) {
  let c1 = 0, c2 = 0;
  for (let i = 0 ; i < arr.length ; i++) {
    let ok = true;
    for (let j = 0 ; j < arr.length - 1 ; j++) {
      c1 = j;
      c2 = j+1;
      if (arr[c1] > arr[c2]) { //Swap
        let tmp = arr[c1];
        arr[c1] = arr[c2];
        arr[c2] = tmp;
        ok = false;
      }
      await tick(arr, c1, c2);
    }
    if(ok) {
      break;
    }
  }
  console.log("Finished");
}

async function tick(dataArray, ...pivots) {
  if (dataArray == currentArray) {
    await sleep(timeSlider.value());
    specialRows = [];
    for (let index = 0 ; index < pivots.length ; index++) {
      let c = colors[index];
      append(specialRows, pivots[index]);
      append(specialRows, c);
    }
      //console.log('running');
  }
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
      fill(233, 233, 233);
    }

    for (let i = 0 ; i < specialRows.length ; i += 2) {
      if (specialRows[i] == index) {
        fill(specialRows[i+1]);
      }
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
