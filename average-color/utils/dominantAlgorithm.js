/**
 * @typedef {Object} FastAverageColorAlgorithmOptions 自定义局部变量
 * @property {[number, number, number, number]} defaultColor
 * @property {number} step
 */

/**
 * @param {FastAverageColorRgba} value
 * @returns {string}
 */
const prepareResult = (value) => {
  const rgba = [value[0], value[1], value[2], value[3] / 255];

  return 'rgba(' + rgba.join(',') + ')'
}

/**
 * 图像平均色算法
 * @see https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md
 * @param {number[] | Uint8ClampedArray | Uint8Array} arr
 * @param {number} bytesPerPixel
 * @param {FastAverageColorAlgorithmOptions} options
 * @returns {string}
 */
export const dominantAlgorithm = (
    arr,
    bytesPerPixel = 4,
    options = {defaultColor: [0,0,0,0], step: 4}
  ) => {
    const arrLength = arr.length
    const len = arrLength - arrLength % bytesPerPixel;

    if (arrLength < bytesPerPixel) {
      return prepareResult(options.defaultColor)
    }

    const colorHash = {};
    const divider = 24;
    const step = options.step;
    let max = [0, 0, 0, 0, 0];

    for (let i = 0; i < len; i += step) {
        const red = arr[i];
        const green = arr[i + 1];
        const blue = arr[i + 2];
        const alpha = arr[i + 3];

        console.log('rgba', red, green, blue, alpha)

        const key = Math.round(red / divider) + ',' +
                Math.round(green / divider) + ',' +
                Math.round(blue / divider);

        if (colorHash[key]) {
            colorHash[key] = [
                colorHash[key][0] + red * alpha,
                colorHash[key][1] + green * alpha,
                colorHash[key][2] + blue * alpha,
                colorHash[key][3] + alpha,
                colorHash[key][4] + 1
            ];
        } else {
            colorHash[key] = [red * alpha, green * alpha, blue * alpha, alpha, 1];
        }

        if (max[4] < colorHash[key][4]) {
            max = colorHash[key];
        }
    }

    const redTotal = max[0];
    const greenTotal = max[1];
    const blueTotal = max[2];

    const alphaTotal = max[3];
    const count = max[4];

    return prepareResult(alphaTotal ? [
        Math.round(redTotal / alphaTotal),
        Math.round(greenTotal / alphaTotal),
        Math.round(blueTotal / alphaTotal),
        Math.round(alphaTotal / count)
    ] : options.defaultColor);
}
