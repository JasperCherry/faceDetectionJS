var Promise = require("bluebird");
var getPixels = Promise.promisify(require("pixel-getter").get);
var getDimensions = Promise.promisify(require("get-pixels"));
var zeros = require("zeros")
var savePixels = require("save-pixels")

const saveImage = (pixelsArray, targetX, targetY) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;

  var buffer = require('fs').createWriteStream('./out/faceX' + targetX + 'Y' + targetY + '.png');
  var x = zeros([width, height])
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (Math.abs(targetX - w) < 10 && Math.abs(targetY - h) < 10) {
        x.set(w, h, 0);
      } else {
        x.set(w, h, pixelsArray[h][w]);
      }
    }
  }

  savePixels(x, 'png').on('end', function() {
    console.log("final image has been saved");
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

// areas selection

const selectAreaA = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(16 * scale); h < valueY; h++) {
    for (let w = valueX - Math.round(16 * scale); w < valueX + Math.round(16 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaB = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY; h < valueY + Math.round(16 * scale); h++) {
    for (let w = valueX - Math.round(16 * scale); w < valueX + Math.round(16 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaC = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(42 * scale); h < valueY - Math.round(26 * scale); h++) {
    for (let w = valueX - Math.round(16 * scale); w < valueX + Math.round(16 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaK = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(106 * scale); h < valueY - Math.round(84 * scale); h++) {
    for (let w = valueX - Math.round(14 * scale); w < valueX + Math.round(14 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaD = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(84 * scale); h < valueY - Math.round(62 * scale); h++) {
    for (let w = valueX - Math.round(14 * scale); w < valueX + Math.round(14 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaI = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(106 * scale); h < valueY - Math.round(84 * scale); h++) {
    for (let w = valueX - Math.round(39 * scale); w < valueX - Math.round(11 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaE = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(84 * scale); h < valueY - Math.round(62 * scale); h++) {
    for (let w = valueX - Math.round(39 * scale); w < valueX - Math.round(11 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaG = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(62 * scale); h < valueY - Math.round(40 * scale); h++) {
    for (let w = valueX - Math.round(39 * scale); w < valueX - Math.round(11 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaJ = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(106 * scale); h < valueY - Math.round(84 * scale); h++) {
    for (let w = valueX + Math.round(11 * scale); w < valueX + Math.round(39 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaF = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(84 * scale); h < valueY - Math.round(62 * scale); h++) {
    for (let w = valueX + Math.round(11 * scale); w < valueX + Math.round(39 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const selectAreaH = (pixelsArray, valueX, valueY, scale) => {
  let height = pixelsArray.length;
  let width = pixelsArray[0].length;
  let allColorValues = [];
  let averageColorValue = 0;

  for (let h = valueY - Math.round(62 * scale); h < valueY - Math.round(40 * scale); h++) {
    for (let w = valueX + Math.round(11 * scale); w < valueX + Math.round(39 * scale); w++) {
      if (h >= 0 && h < pixelsArray.length && w >= 0 && w < pixelsArray[0].length) {
        allColorValues.push(pixelsArray[h][w]);
      }
    }
  }

  if (allColorValues.length) {
    averageColorValue = allColorValues.reduce((acc, val) => acc + val) / allColorValues.length;
  }

  return averageColorValue;
}

const run = async (image) => {

  let dimensions = await getDimensions(image).then(data => data.shape.slice());
  let width = dimensions[0];
  let height = dimensions[1];
  console.log('image width:', width, 'image height:', height);
  let pixels = await getPixels(image).then(data => data);
  let pixelsArray = formPixelsArray(pixels, height, width);
  pixelsArray = transformGray(pixelsArray);

  for (let scale = 0.5; scale <= 2; scale = scale + 0.5) {
    console.log('Checking for face with SCALE =', scale);
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {

        const A = selectAreaA(pixelsArray, w, h, scale);
        const B = selectAreaB(pixelsArray, w, h, scale);
        const C = selectAreaC(pixelsArray, w, h, scale);
        const D = selectAreaD(pixelsArray, w, h, scale);
        const E = selectAreaE(pixelsArray, w, h, scale);
        const F = selectAreaF(pixelsArray, w, h, scale);
        const G = selectAreaG(pixelsArray, w, h, scale);
        const H = selectAreaH(pixelsArray, w, h, scale);
        const I = selectAreaI(pixelsArray, w, h, scale);
        const J = selectAreaJ(pixelsArray, w, h, scale);
        const K = selectAreaK(pixelsArray, w, h, scale);

        if (E < I && E < K && E < D && E < G && E < J && E < H && E < B && E < C
          && F < J && F < K && F < D && F < H && F < I && F < G && F < B && F < B &&
           A < G && A < C && A < H && A < B && A < I && A < K && A < J && A < D &&
            C < I && C < K && C < J) {

          console.log('Face with its lips detected at:', w, h);
          saveImage(pixelsArray, w, h);
        }

        /*
      console.log('A', A);
      console.log('B', B);
      console.log('C', C);
      console.log('D', D);
      console.log('E', E);
      console.log('F', F);
      console.log('G', G);
      console.log('H', H);
      console.log('I', I);
      console.log('J', J);
      console.log('K', K);

      // first rule
      if (A < B && A < C && A < D && A < G && A < H && F < D && F < G && F < H && E < D && E < G && E < H && E < C
         && E < A && E < B && F < C && F < A && F < B && C < D && C < G && C < H) {
        console.log('Face with its lips detected at:', w, h);
        saveImage(pixelsArray, w, h);
      }
      */

      }
    }
  }

};

run("faces/mt.jpg");
