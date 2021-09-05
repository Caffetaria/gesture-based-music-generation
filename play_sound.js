let posX = [0, 0, 0, 0, 0, 0];
let posY = [0, 0, 0, 0, 0, 0];

let gotPose = false;

let numCorrect = 0;

let videoWidth, videoHeight;

var playSound = function() {

  var beepsound = new Audio('http://www.vibrationdata.com/piano_G.mp3');
  beepsound.play();
  console.log("Played G");

};

var playSound1 = function() {

  var beepsound = new Audio('http://www.vibrationdata.com/piano_E.mp3');
  beepsound.play();
  console.log("Played E");

};

var playSound2 = function() {

  var beepsound = new Audio('http://www.vibrationdata.com/piano_F.mp3');
  beepsound.play();
  console.log("Played F");

};

var playSound3 = function() {

  var beepsound = new Audio('http://www.vibrationdata.com/piano_A.mp3');
  beepsound.play();
  console.log("Played A");

};

let fr = 1;

function setup() {
  createCanvas(windowHeight * 1.4, windowHeight * 0.8);
  video = createCapture(VIDEO);
  videoWidth = width;
  videoHeight = width * 0.75;
  video.size(videoWidth, videoHeight);
  video.hide();
  const poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function modelLoaded() {
  let options = {
    imageScaleFactor: 1,
    minConfidence: 0.9,
  };
}

//recognize poses
function gotPoses(poses) {
  let options = {
    imageScaleFactor: 1,
    minConfidence: 0.9,
  };

  if (poses.length > 0) {
    let newPosX = [];
    let newPosY = [];

    for (let i = 0; i <= 5; i++) {
      newPosX[i] = poses[0].pose.keypoints[i + 5].position.x;
      newPosY[i] = poses[0].pose.keypoints[i + 5].position.y;

      posX[i] = lerp(newPosX[i], posX[i], 0.5);
      posY[i] = lerp(newPosY[i], posY[i], 0.5);
    }

    gotPose = true;
  } else {
    gotPose = false;
  }
}

function draw(poses) {
  frameRate(fr);
  push();
  translate(video.width, 0);
  scale(-1.0, 1.0);
  image(video, 0, 0, videoWidth, videoHeight);

  fill(255);

  if (gotPose == true) {
    getUserAngle(); //temporary
    drawDots();
  }
}
//draw dots and lines on the person
function drawDots() {
  for (let i = 0; i < posX.length; i++) {
    ellipse(posX[i], posY[i], 20);
  }
  stroke(255);
  strokeWeight(5);

  line(posX[9 - 5], posY[9 - 5], posX[7 - 5], posY[7 - 5]); //left wrist to elbow
  line(posX[7 - 5], posY[7 - 5], posX[5 - 5], posY[5 - 5]); //left elbow to shoulder
  line(posX[5 - 5], posY[5 - 5], posX[6 - 5], posY[6 - 5]); //left shoulder to right shoulder
  line(posX[6 - 5], posY[6 - 5], posX[8 - 5], posY[8 - 5]); //right shoulder to elbow
  line(posX[8 - 5], posY[8 - 5], posX[10 - 5], posY[10 - 5]); //right elbow to wrist
}
function getUserAngle() {
  userLeftAngle =
    (Math.atan2(posY[0] - posY[4], posX[0] - posX[4]) * 180) / Math.PI;
  userRightAngle =
    (Math.atan2(posY[1] - posY[5], posX[1] - posX[5]) * 180) / Math.PI;
  document.getElementById("p1").innerHTML = userLeftAngle;
  document.getElementById("p2").innerHTML = userRightAngle;
  if (userLeftAngle > 0 && userRightAngle > 0) {
    playSound();
  } else if (userLeftAngle < 0 && userRightAngle > 0) {
    playSound1();
  } else if (userLeftAngle > 0 && userRightAngle < 0) {
    playSound2();
  } else if (userLeftAngle < 0 && userRightAngle < 0) {
    playSound3();
  }

  return [userLeftAngle, userRightAngle];
}
