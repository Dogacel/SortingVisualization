
var warnedData = false;
var slider, sliderVal;

function setup() {
  // put setup code here

  textSize(14);


  slider = createSlider(1, 200, 100, 1);


  slider.style('width', '800px');
  console.log('Slider now functioning.');

  createElement('hr');
  createCanvas(800,800);
  sliderVal = 0;
}


function draw() {


  if (sliderVal != slider.value()) {
    sliderVal = slider.value();
    background(0);
    plotData(randomArray(slider.value(),0,100), 800, 800);
  }
}

function randomArray(size, min, max) {
  var data = [];
  for(var i = 0 ; i < size ; i++) {
    append(data, random(min, max));
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

    if (color == "rainbow") {
      var i = map(index, 0, dataWidth, 0, 255);

      var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
      var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
      var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);

      fill(r,g,b);
    } else if (color != null) {
      fill(color);
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
