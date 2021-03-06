
//Global variables

var world;

var warnedData = false;

var sizeSlider, sizeSliderValue;
var maxSlider, maxSliderValue;
var timeSlider;
var functionChooser;

var rainbow;

var updateCaller = true;

var canvas;

var currentArray;

var colors, specialRows;

var is3d = false;

//Various functions

function warnDataOnce(scale) {
  if (!warnedData) {
    console.warn("Dataset can't fit to desired area. Graph will show 1 column for " + scale + " element.");
    warnedData = !warnedData;
  }
}

function randomArray(size, min, max) {
  var data = [];
  for(var i = 0 ; i < size ; i++) {
    append(data,  int(random(min, max)));
  }
  return data;
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



//Setup canvas and other tools.

function setup() {


  colors = [color(0,0,255), color(0,255,0), color(255,0,0), color(255,255,0), color(255,0,255), color(0,255,255)];
  specialRows = [];

  let canvasWidth = 600, canvasHeight = 600;

  hr();

  let resetButton = createButton("Reset");
  resetButton.mouseClicked(() => {
    sizeSlider.value(20);
    maxSlider.value(canvasHeight / 8);
    updateSent()
  });

  let regenButton = createButton("Regenerate Data");
  regenButton.mouseClicked(() => {
    updateSent()
  });

  let sortButton = createButton("Sort Data with : ");
  sortButton.mouseClicked(() => {
    window[functionChooser.value()](currentArray);
  });


  functionChooser = createSelect('Algorithm: ');

  functionChooser.child(createElement('option', 'bubbleSort'));
  functionChooser.child(createElement('option', 'selectionSort'))


  colorButton = createCheckbox('Rainbow mode');
  colorButton.mouseClicked(() => {
    rainbow = colorButton.checked();
  });

  let button3d = createCheckbox('3D mode');
  button3d.mouseClicked(() => {
    is3d = button3d.checked();
  });

  hr();

  sizeSlider = createSlider(2, canvasWidth / 4, 20, 1);
  maxSlider = createSlider(2, canvasHeight / 4, canvasHeight / 8, 1);
  hr();
  timeSlider = createSlider(1, 10, 9, 1);

  sizeSlider.style('width', canvasWidth / 2 - 5 + 'px');
  maxSlider.style('width', canvasWidth / 2 - 5 + 'px');
  timeSlider.style('width', canvasWidth + 'px');

  let pressed = false;

  hr();

  canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);

  world = new World(canvas);
  console.log("Setup complete !");


  maxSliderValue = maxSlider.value();
  let tmp = randomArray(100, 0, maxSliderValue);

  console.log(tmp);
  addArray(tmp);

}


//Draw method

function draw() {

  if (updateCaller || sizeSliderValue != sizeSlider.value() || maxSliderValue != maxSlider.value()) {

    maxSliderValue = maxSlider.value();
    sizeSliderValue = sizeSlider.value();

    currentArray = randomArray(sizeSlider.value(), 0, maxSlider.value());
    addArray(currentArray);
    updateRecieved();
  }



  if (is3d) {
    //ambientLight(255);
    //normalMaterial()
    background(0);
    rotateX(-PI/16);
    rotateY(PI/4.5);
    rotateZ(-1*PI/18);
    //rotateZ(PI/4);
    strokeWeight(1);
    plotData3D(currentArray, canvas.width, canvas.height);
  } else {
    translate(-canvas.width/2, -canvas.height/2);
    stroke(1);
    world.tick();
    world.drawWorld();
  }

}


function addArray(newArray) {
  world.wobjects = [];

  var width = world.canvas.width, height = world.canvas.height;
  var dataWidth = newArray.length;
  var maxS = Math.max.apply(null, newArray);
  var minS = Math.min.apply(null, newArray);
  var dataHeight = maxS - minS;

  var scale = 1;
  if (dataWidth > width / 4) {
    scale = (4 * dataWidth / width);
    warnDataOnce(scale);
  }


  for (let i = 0 ; i < newArray.length ; i++) {
    var tmp = new WObject(
      (scale * width / dataWidth),
      map(newArray[i], 0, maxSliderValue, 0, height),
      (i) * (scale * width / dataWidth),
      height - map(newArray[i], 0, maxSliderValue, 0, height)
    );
    world.addWObject(tmp);
  }
}

//Plotting and updating
function plotData3D(inData, canvasWidth, canvasHeight) {

  translate(-canvasWidth/2 + 100, 0);
  for (let i = 0 ; i < inData.length ; i++) {
    fill(255);
    for (let j = 0 ; j < specialRows.length ; j += 2) {
      if (specialRows[j] == i) {
        fill(specialRows[j+1]);
      }
    }

    translate(20*i + 5 , - inData[i] / 2 , 0);
    box(20 , inData[i], 20);
    translate(-20*i + 5, + inData[i] / 2 , 0);
  }
}

function plotData(inData, canvasWidth, canvasHeight, color) {

  var width = canvasWidth, height = canvasHeight;
  var dataWidth = inData.length;
  var maxS = Math.max.apply(null, inData);
  var minS = Math.min.apply(null, inData);
  var dataHeight = maxS - minS;

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

    rect((index) * (scale * width / dataWidth),
    height - map(inData[index], 0, maxSliderValue, 0, height),
    (scale * width / dataWidth),
    map(inData[index], 0, maxSliderValue, 0, height));
  }
}

async function tick(dataArray, ...pivots) {
  addArray(dataArray);
  if (dataArray == currentArray) {
    specialRows = [];
    for (let index = 0 ; index < pivots.length ; index++) {
      let c = colors[index];
      append(specialRows, pivots[index]);
      append(specialRows, c);
    }
    await sleep(pow(2, timeSlider.value()));
    //console.log('running');
  }
}




//Sorting

async function selectionSort(arr) {
  for (let i = 0 ; i < arr.length - 1 ; i++) {
    let min = i
    for (let j = i + 1 ; j < arr.length ; j++) {

      await tick(arr, i, j, min);

      if (arr[j] < arr[min]) {
        min = j;
      }

    }

    await tick(arr, i, -1, min);

    let tmp = arr[min];
    arr[min] = arr[i];
    arr[i] = tmp;

    await tick(arr, min, -1, i);
    await tick(arr);
  }
}


async function bubbleSort(arr) {
  let c1 = 0, c2 = 0;
  for (let i = 0 ; i < arr.length ; i++) {
    let ok = true;
    for (let j = 0 ; j < arr.length - 1 ; j++) {
      c1 = j;
      c2 = j+1;

      await tick(arr, c1, c2);
      if (arr[c1] > arr[c2]) { //Swap
        let tmp = arr[c1];
        arr[c1] = arr[c2];
        arr[c2] = tmp;
        ok = false;
        await tick(arr, c2, c1);
      }


    }
    await tick(arr);
    if(ok) {
      break;
    }
  }
  specialRows = [];
  console.log("Finished");
}
