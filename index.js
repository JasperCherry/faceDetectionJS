var Promise = require("bluebird");
var getPixels = Promise.promisify(require("pixel-getter").get);
var getDimensions = Promise.promisify(require("get-pixels"));
var zeros = require("zeros")
var savePixels = require("save-pixels")

const saveImage = (array, targetX, targetY) => {
  let pixelsArray = JSON.parse(JSON.stringify(array));
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;

  var buffer = require('fs').createWriteStream('./output/face' + targetX + targetY + '.png');
  var x = zeros([width, height])
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (w > targetX - 10 && w < targetX + 10 && h === targetY) {
        pixelsArray[h][w] = 0;
      }
      if (h > targetY - 10 && h < targetY + 10 && w === targetX) {
        pixelsArray[h][w] = 0;
      }

      x.set(w, h, pixelsArray[h][w]);
    }
  }

  savePixels(x, 'png').on('end', function() {
    console.log("image has been saved");
  }).pipe(buffer);
}

const formPixelsArray = (pixels, height, width) => {
  let pixelsArray = [];

  for (let h = 0; h < height; h++) {
    let widthColumn = [];
    for (let w = 0; w < width; w++) {
      widthColumn.push(pixels[0][((h * width) + w)]);
    }
    pixelsArray.push(widthColumn);
  }

  return pixelsArray;
}

const transformGray = (pixelsArray) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      pixelsArray[h][w] = (pixelsArray[h][w].r + pixelsArray[h][w].g + pixelsArray[h][w].b) / 3;
    }
  }

  return pixelsArray;
}

const drawVerticalLine = (pixelsArray, borderValue) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (w === borderValue) {
        pixelsArray[h][w] = 0;
      }
    }
  }

  return pixelsArray;
}

const drawHorizontalLine = (pixelsArray, borderValue) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (h === borderValue) {
        pixelsArray[h][w] = 0;
      }
    }
  }

  return pixelsArray;
}

const getSquareAverageColor = (pixelsArray, squareStartX, squareStartY) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let squareColorSum = 0;

  for (let h = squareStartY; h < 10 + squareStartY; h++) {
    for (let w = squareStartX; w < 10 + squareStartX; w++) {
      squareColorSum += pixelsArray[h][w];
    }
  }

  return squareColorSum / 100;
}

const getAverageForAllSquares = (pixelsArray, startingX, startingY) => {
  let allSquaresAverage = [];
  for (let z = 0; z < 12; z++) {
    let row = [];
    for (let x = 0; x < 10; x++) {
      row.push(getSquareAverageColor(pixelsArray, startingX + x * 10, startingY + z * 10));
    }
    allSquaresAverage.push(row);
  }
  return allSquaresAverage;
}

const getAverageManySquares = (allSquaresAverage, startX, endX, startY, endY) => {
  let totalAverage = 0;
  let counter = 0;

  for (let h = startY; h < endY; h++) {
    for (let w = startX; w < endX; w++) {
      totalAverage += allSquaresAverage[h][w];
      counter++;
    }
  }
  return totalAverage / counter;
}

// MAIN FUNCTION
const run = async (image) => {

  let dimensions = await getDimensions(image).then(data => data.shape.slice());
  let width = dimensions[0];
  let height = dimensions[1];
  //console.log('image width:', width, 'image height:', height);
  let pixels = await getPixels(image).then(data => data);
  let pixelsArray = formPixelsArray(pixels, height, width);
  pixelsArray = transformGray(pixelsArray);

  for (let w = 0; w < width - 100; w++) {
    for (let h = 0; h < height - 120; h++) {

      let allSquaresAverage = getAverageForAllSquares(pixelsArray, w, h);

      let leftEye = getAverageManySquares(allSquaresAverage, 0, 4, 1, 4);
      let rightEye = getAverageManySquares(allSquaresAverage, 6, 10, 1, 4);
      let mouth = getAverageManySquares(allSquaresAverage, 3, 7, 8, 11);

      let noseAreaUp = getAverageManySquares(allSquaresAverage, 4, 6, 0, 4);
      let noseAreaDown = getAverageManySquares(allSquaresAverage, 4, 6, 4, 8);

      let leftEyeAreaDown = getAverageManySquares(allSquaresAverage, 0, 4, 4, 7);
      let rightEyeAreaDown = getAverageManySquares(allSquaresAverage, 6, 10, 4, 7);

      let leftEyeAreaAbove = getAverageManySquares(allSquaresAverage, 0, 5, 0, 1);
      let rightEyeAreaAbove = getAverageManySquares(allSquaresAverage, 5, 10, 0, 1);

      let bothEyesAreaAbove = getAverageManySquares(allSquaresAverage, 0, 10, 0, 1);

      let mouthAreaLeft = getAverageManySquares(allSquaresAverage, 1, 3, 5, 8);
      let mouthAreaRight = getAverageManySquares(allSquaresAverage, 7, 9, 5, 8);
      let mouthAreaDown = getAverageManySquares(allSquaresAverage, 3, 7, 10, 11);

      let faceExists = true;

      if (leftEye > leftEyeAreaDown || leftEye > leftEyeAreaAbove || leftEye > noseAreaUp || leftEye > mouthAreaLeft) {
        faceExists = false;
      }

      if (rightEye > rightEyeAreaDown || rightEye > rightEyeAreaAbove || rightEye > noseAreaUp || rightEye > mouthAreaRight) {
        faceExists = false;
      }

      if (mouth > mouthAreaDown || mouth > mouthAreaLeft || mouth > mouthAreaRight || mouth > noseAreaUp || mouth > noseAreaDown) {
        faceExists = false;
      }

      if (faceExists) {
        console.log('Face detected');
        saveImage(pixelsArray, w + 50, h + 60);
      }

    }
  }

  /*
  // drawing lines in current configuration 10x12

  one line above and under 10x10 square
  pixelsArray = drawHorizontalLine(pixelsArray, 190);
  pixelsArray = drawHorizontalLine(pixelsArray, 80);

  // 10x10
  for (let x = 0; x < 10; x++) {
    pixelsArray = drawVerticalLine(pixelsArray, 50 + 10 * x);
    pixelsArray = drawHorizontalLine(pixelsArray, 90 + 10 * x);
  }
  */

};

run("faces/m18.jpg");
