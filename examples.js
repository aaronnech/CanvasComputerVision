// Draw giraffe on all canvases
var giraffe = document.getElementById("giraffe");

if(giraffe.complete) {
    process(giraffe);
}else {
    giraffe.onload = function() {
        process(giraffe);
    };
}

function process(img) {
    var canvases = document.querySelectorAll("canvas");
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    }


    var cvCanvas = null;

//    // Invert
//    cvCanvas = new CVCanvas('inverted');
//    cvCanvas.captureAll();
//    cvCanvas.invert();
//    cvCanvas.put(0, 0);
//
//
//    // Red
//    cvCanvas = new CVCanvas('redCh');
//    cvCanvas.captureAll();
//    cvCanvas.wipeBlueChannel();
//    cvCanvas.wipeGreenChannel();
//    cvCanvas.put(0, 0);
//
//    // Green
//    cvCanvas = new CVCanvas('greenCh');
//    cvCanvas.captureAll();
//    cvCanvas.wipeBlueChannel();
//    cvCanvas.wipeRedChannel();
//    cvCanvas.put(0, 0);
//
//
//    // Blue
//    cvCanvas = new CVCanvas('blueCh');
//    cvCanvas.captureAll();
//    cvCanvas.wipeGreenChannel();
//    cvCanvas.wipeRedChannel();
//    cvCanvas.put(0, 0);
//
//    // B&W
//    cvCanvas = new CVCanvas('bw');
//    cvCanvas.captureAll();
//    cvCanvas.toGreyScale();
//    cvCanvas.put(0, 0);
//
//    // Edge Convolution
//    cvCanvas = new CVCanvas('edge');
//    cvCanvas.captureAll();
//    cvCanvas.convolve(CVCanvas.MASKS.EDGE_DETECT);
//    cvCanvas.put(0, 0);

    // Horizontal Derivative Convolution
    cvCanvas = new CVCanvas('hder');
    cvCanvas.captureAll();
    cvCanvas.toGreyScale();
    cvCanvas.convolve(CVCanvas.MASKS.HORIZONTAL_DERIVATIVE);
    cvCanvas.normalize();
    cvCanvas.put(0, 0);

    // Vertical Derivative Convolution
    cvCanvas = new CVCanvas('vder');
    cvCanvas.captureAll();
    cvCanvas.toGreyScale();
    console.log(cvCanvas.HOG(16, 9));
    cvCanvas.convolve(CVCanvas.MASKS.VERTICAL_DERIVATIVE);
    cvCanvas.normalize();
    cvCanvas.put(0, 0);

    // Motion blur Convolution
//    cvCanvas = new CVCanvas('mb');
//    cvCanvas.captureAll();
//    cvCanvas.convolve(CVCanvas.MASKS.MOTION_BLUR);
//    cvCanvas.normalize();
//    cvCanvas.put(0, 0);
}