
var warnedData = false;

function setup() {
  // put setup code here
  createCanvas(800,800);

}

function draw() {
  // put drawing code here
  if (frameCount % 60 == 0) {
    background(0);
    plotData(randomArray(10,0,10), 800, 800);
  }
}

function randomArray(size, min, max) {
  var data = [];
  for(var i = 0 ; i < 50 ; i++) {
    append(data, random(0,100));
  }
  return data;
}


function plotData(inData, canvasWidth, canvasHeight) {

  var width = canvasWidth, height = canvasHeight;
  var dataWidth = inData.length;
  var dataHeight = Math.max.apply(null, inData) - Math.min.apply(null, inData);

  var scale = 1;
  if (dataWidth > canvasWidth / 4) {
    scale = (4 * dataWidth / canvasWidth);
    warnDataOnce(scale);
  }



  for (var index in inData) {

    var i = map(index, 0, dataWidth, 0, 255);

    var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
    var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
    var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);

    fill(r,g,b);

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
