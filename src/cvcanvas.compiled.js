///<reference path="./def/linlib.d.ts"/>
/**
 * Main interface to canvas CV library
 */
var CVCanvas = (function () {
    /**
     * Constructs a CV interface over a canvas
     * @param canvasId
     */
    function CVCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.imageData = null;
        this.red = null;
        this.green = null;
        this.blue = null;
        this.alpha = null;
    }
    /**
     * Captures all the canvas into matrix form
     */
    CVCanvas.prototype.captureAll = function () {
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.copyNativeToMatrix();
    };
    /**
     * Puts the current matrix data into the given coordinates on the canvas
     * @param x The y location to place the matrix data
     * @param y The x location to place the matrix data
     */
    CVCanvas.prototype.put = function (x, y) {
        if (this.imageData == null) {
            throw 'Nothing captured!';
        }
        this.copyMatrixToNative();
        this.ctx.putImageData(this.imageData, x, y);
    };
    /**
     * Converts the color data to grey scale
     */
    CVCanvas.prototype.toGreyScale = function () {
        var redArr = this.red.toArray();
        var greenArr = this.green.toArray();
        var blueArr = this.blue.toArray();
        var result = [];
        var third = LinLib.Fraction.make(1, 3);
        var half = LinLib.Fraction.make(1, 2);
        var eigth = LinLib.Fraction.make(1, 8);
        for (var row = 0; row < this.imageData.height; row++) {
            result.push([]);
            for (var col = 0; col < this.imageData.width; col++) {
                var brightness = redArr[row][col].mult(third).add(greenArr[row][col].mult(half)).add(blueArr[row][col].mult(eigth));
                result[row].push(brightness);
            }
        }
        var finished = new LinLib.Matrix(result);
        this.red = finished;
        this.green = finished;
        this.blue = finished;
    };
    /**
     * Zeros out the blue channel of matrix data
     */
    CVCanvas.prototype.wipeBlueChannel = function () {
        this.blue = this.blue.forEachElement(function (f) {
            return LinLib.Fraction.make(0, 1);
        });
    };
    /**
     * Zeros out the green channel of matrix data
     */
    CVCanvas.prototype.wipeGreenChannel = function () {
        this.green = this.green.forEachElement(function (f) {
            return LinLib.Fraction.make(0, 1);
        });
    };
    /**
     * Zeros out the red channel of matrix data
     */
    CVCanvas.prototype.wipeRedChannel = function () {
        this.red = this.red.forEachElement(function (f) {
            return LinLib.Fraction.make(0, 1);
        });
    };
    /**
     * Zeros out the alpha channel of matrix data
     */
    CVCanvas.prototype.wipeAlphaChannel = function () {
        this.alpha = this.alpha.forEachElement(function (f) {
            return LinLib.Fraction.make(0, 1);
        });
    };
    /**
     * Convolves a matrix mask over the RGB channels
     * @param mask The matrix mask to convolve with
     */
    CVCanvas.prototype.convolve = function (mask) {
        this.red = this.red.convolve(mask);
        this.green = this.green.convolve(mask);
        this.blue = this.blue.convolve(mask);
    };
    /**
     * Computes set of Histogram of Oriented Gradients features for the current
     * data set. A Histogram of Oriented Gradients is computed as follows:
     *
     * 1. Get the vertical derivative of the RGB data, normalize it.
     * 2. Get the horizontal derivative of the RGB data, normalize it.
     * 3. Create a series of 'bins' of the matrix data
     * 4. Compute a histogram of the gradient in each bin where the histogram is:
     *      4a. a 360 (degree) descrete histogram where the height of each data point is
     *          the sum of the gradient magnitudes in that direction, for that particular bin.
     *
     * @requires The data is in grey scale mode (RGB channels are equal)
     * @return number[] The array form of the histogram, concatenated L-to-R
     */
    CVCanvas.prototype.HOG = function (histSize, binSize) {
        var histograms = [];
        // Compute the gradient (step 1)
        var verDerivative = this.red.convolve(CVCanvas.MASKS.VERTICAL_DERIVATIVE);
        var horDerivative = this.red.convolve(CVCanvas.MASKS.HORIZONTAL_DERIVATIVE);
        for (var row = 0; row < verDerivative.rowCount(); row += histSize) {
            for (var col = 0; col < verDerivative.colCount(); col += histSize) {
                var histogram = [];
                for (var i = 0; i < binSize; i++) {
                    histogram.push(0);
                }
                for (var histRow = row; histRow < verDerivative.rowCount() && histRow < row + histSize; histRow++) {
                    for (var histCol = col; histCol < verDerivative.colCount() && histCol < col + histSize; histCol++) {
                        var gradX = horDerivative.get(histRow, histCol).toDec();
                        var gradY = verDerivative.get(histRow, histCol).toDec();
                        // Get gradient magnitude, and direction
                        var mag = Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2));
                        var direction = Math.atan2(gradY, gradX);
                        // Convert to 0-360 degrees
                        direction = ((direction > 0 ? direction : (2 * Math.PI + direction)) * 360 / (2 * Math.PI)) % 360;
                        // There are binSize number of histogram channels (bins), therefore we have 360/9 chunks of
                        // directional freedom in the gradient vectors, we must calculate which one this belongs to
                        // and add the gradient magnitude to that bin.
                        var bin = Math.floor(direction / (360 / binSize));
                        histogram[bin] += mag;
                    }
                }
                histograms.push(histogram);
            }
        }
        return histograms;
    };
    CVCanvas.prototype.normalize = function () {
        this.red.normalize(255);
        this.green.normalize(255);
        this.blue.normalize(255);
    };
    CVCanvas.prototype.invert = function () {
        var invertFrac = function (f) {
            return (LinLib.Fraction.make(255, 1)).sub(f);
        };
        this.red = this.red.forEachElement(invertFrac);
        this.green = this.green.forEachElement(invertFrac);
        this.blue = this.blue.forEachElement(invertFrac);
    };
    CVCanvas.prototype.copyNativeToMatrix = function () {
        var redArr = [];
        var greenArr = [];
        var blueArr = [];
        var alphaArr = [];
        for (var row = 0; row < this.imageData.height; row++) {
            redArr.push([]);
            greenArr.push([]);
            blueArr.push([]);
            alphaArr.push([]);
            for (var col = 0; col < this.imageData.width; col++) {
                var index = (col + (row * this.imageData.width)) * 4;
                var data = this.imageData.data;
                redArr[row].push(data[index]);
                greenArr[row].push(data[index + 1]);
                blueArr[row].push(data[index + 2]);
                alphaArr[row].push(data[index + 3]);
            }
        }
        this.red = LinLib.matrixFromNumberArray(redArr);
        this.green = LinLib.matrixFromNumberArray(greenArr);
        this.blue = LinLib.matrixFromNumberArray(blueArr);
        this.alpha = LinLib.matrixFromNumberArray(alphaArr);
    };
    CVCanvas.prototype.copyMatrixToNative = function () {
        var redArr = this.red.toArray();
        var greenArr = this.green.toArray();
        var blueArr = this.blue.toArray();
        var alphaArr = this.alpha.toArray();
        for (var row = 0; row < this.imageData.height; row++) {
            for (var col = 0; col < this.imageData.width; col++) {
                var index = (col + (row * this.imageData.width)) * 4;
                var data = this.imageData.data;
                data[index] = Math.round(redArr[row][col].toDec());
                data[index + 1] = Math.round(blueArr[row][col].toDec());
                data[index + 2] = Math.round(greenArr[row][col].toDec());
                data[index + 3] = Math.round(alphaArr[row][col].toDec());
            }
        }
    };
    CVCanvas.MASKS = {
        EDGE_DETECT: LinLib.matrixFromNumberArray([[0, 1, 0], [1, -4, 1], [0, 1, 0]]),
        HORIZONTAL_SOBEL: LinLib.matrixFromNumberArray([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]),
        VERTICAL_SOBEL: LinLib.matrixFromNumberArray([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]),
        HORIZONTAL_DERIVATIVE: LinLib.matrixFromNumberArray([[-1, 0, 1]]),
        VERTICAL_DERIVATIVE: LinLib.matrixFromNumberArray([[-1], [0], [1]]),
        MOTION_BLUR: LinLib.identity(6)
    };
    return CVCanvas;
})();
