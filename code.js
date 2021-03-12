var score=0;
var hole=-1;
var wind;
var strength;
var count=0;
var hole_x;
var hole_y;
var distance;
var meter_y=100;
var meter_dir=1;
var hit=0;
var arrowLoop;
var angle;
var ball_y=365;
var ball_x=160;
var ballLoop;
var ball_FinalY;
var ball_FinalX;
setScreen("play_Screen");
//aiming buttons
onEvent("image_rightArrow", "click", function(event) {
  show();
  moveTo(170, 371);
  turnRight(3);
  angle=getDirection();
  if (angle==60) {
    turnTo(0);
  }
});
onEvent("image_leftArrow", "click", function(event) {
  show();
  moveTo(170, 371);
  turnLeft(3);
  angle=getDirection();
  if (angle==300) {
    turnTo(0);
  }
});
//hitting button 
onEvent("hit_Button", "click", function(event) {
  hide();
  //swing animation
  timedLoop(80, function() {
    count=count+1;
    if (count==1) {
     hideElement("image1");
     showElement("image3");
    } else if ((count == 2)) {
      hideElement("image3");
      showElement("image4");
    } else if (count==3) {
      hideElement("image4");
      showElement("image3");
    } else if ((count == 4)) {
      hideElement("image3");
      showElement("image1");
    } else {
      stopTimedLoop();
      count=0;
    }
  });
  //variable set up for meter timed loop to stop
  hit=1;
  //ball animation  affectd by strength and wind
    //setting up the strength and wind 
    strength=Math.round((190-getYPosition("image_MeterPointer"))/1.8);
    console.log("strength is "+strength);
    console.log("angle of shot is "+angle);
    console.log("wind is "+wind);
    angle=angle+wind;
    //make sure the angle never defined as negative so trig functions work
    if (angle<=0){
      angle=360+angle;
    }
    console.log("new angle of shot is "+angle);
    //calculate the final position that the ball should land in based on angle and strength
    //angle converted to radians
    ball_FinalX=160+Math.sin(angle*0.01745329)*3*strength;
    ball_FinalY=365-Math.cos(angle*0.01745329)*3*strength;
    //timed loop to get the ball to move at the right angle
    //timeout delays when the ball starts moving so looks like getting hit
    setTimeout(function() {
      ballLoop=timedLoop(1, function() {
        ball_x=ball_x+Math.sin(angle*0.01745329)*2;
        ball_y=ball_y-Math.cos(angle*0.01745329)*2;
        setPosition("image_ball",ball_x,ball_y,20,20);
        //stop the ball when it reaches the final position
        if (ball_y<=ball_FinalY) {
          stopTimedLoop(ballLoop);
          ball_y=365;
          ball_x=160;
        }
      });
    }, 400);
});
onEvent("nextHole_Button", "click", function(event) {
  //variable to get meter loop to start
  hit=0;
  //setting up the next hole os that it is listed and drawn
  hole=hole+1;
  setText("text_Hole", "Hole   "+(hole+1));
  defineHole_PinPlacement();
  //update the score from last hole 
  updateScore();
  //resetting the ball position
  setPosition("image_ball",160,365);
  setWind();
  //loop so that the meter will begin oscillating again
  arrowLoop=timedLoop(1, function() {
    meter_y=meter_y-meter_dir;
    setPosition("image_MeterPointer", 210, meter_y,100,100);
    if (meter_y>=190) {
      meter_dir=1;
    }
    if (meter_y<=10) {
      meter_dir=-1;
    }
    if (hit==1) {
      stopTimedLoop(arrowLoop);
    }
  });
});
onEvent("finish_Button", "click", function(event) {
  //end of game
  updateScore();
  setScreen("gameOver_Screen");
});
onEvent("retry_Button", "click", function(event) {
  //resetting variables, text and screen
  setScreen("play_Screen");
  showElement("image2");
  resetOriginal_Variables();
  resetOriginal_Texts();
  setPosition("image_ball",160,365);
});
//start of game and tutorial walk through
onEvent("play_Button", "click", function(event) {
  setScreen("tutorial_Screen");
  drawHole_Tutorial();
  hideElement("totorial_next2-3");
  hideElement("tutorial_play");
  hideElement("tutorial_2");
  hideElement("tutorial_3");
  showElement("tutorial_skip");
  showElement("tutorial_next1-2");
  showElement("tutorial_1");
  hideElement("image3");
  hideElement("image4");
  hideElement("image2");
  hideElement("image5");
  hideElement("image1");
  hideElement("finish_Button");
  hideElement("image_meter");
  hideElement("image_MeterPointer");
  hideElement("image_ball");
  hideElement("nextHole_Button");
  hideElement("hit_Button");
  hideElement("text_Wind");
  hideElement("text_Hole");
  hideElement("text_Score");
  hideElement("image_rightArrow");
  hideElement("image_leftArrow");
  setWind();
});
onEvent("tutorial_next1-2", "click", function(event) {
  hideElement("tutorial_next1-2");
  hideElement("tutorial_1");
  showElement("tutorial_2");
  showElement("totorial_next2-3");
});
onEvent("totorial_next2-3", "click", function(event) {
  hideElement("tutorial_2");
  hideElement("totorial_next2-3");
  showElement("tutorial_play");
  showElement("tutorial_3");
});
onEvent("tutorial_play", "click", function(event) {
  hideElement("tutorial_3");
  hideElement("tutorial_play");
  hideElement("tutorial_skip");
  showElement("image_ball");
  showElement("image5");
  showElement("image1");
  showElement("image_meter");
  showElement("image_MeterPointer");
  showElement("nextHole_Button");
  showElement("hit_Button");
  showElement("text_Hole");
  showElement("text_Score");
  showElement("text_Wind");
  showElement("image_rightArrow");
  showElement("image_leftArrow");
  //loop to get meter to start moving 
  arrowLoop=timedLoop(1, function() {
    meter_y=meter_y-meter_dir;
    setPosition("image_MeterPointer", 210, meter_y,100,100);
    if (meter_y>=190) {
      meter_dir=1;
    }
    if (meter_y<=10) {
      meter_dir=-1;
    }
    if (hit==1) {
      stopTimedLoop(arrowLoop);
    }
  });
});
//if someone already knows how to play press this button to skip tutorial texts
onEvent("tutorial_skip", "click", function(event) {
  hideElement("tutorial_1");
  hideElement("tutorial_2");
  hideElement("tutorial_3");
  hideElement("tutorial_next1-2");
  hideElement("totorial_next2-3");
  hideElement("tutorial_play");
  hideElement("tutorial_skip");
  showElement("image_ball");
  showElement("image5");
  showElement("image1");
  showElement("image_meter");
  showElement("image_MeterPointer");
  showElement("nextHole_Button");
  showElement("hit_Button");
  showElement("text_Hole");
  showElement("text_Score");
  showElement("text_Wind");
  showElement("image_rightArrow");
  showElement("image_leftArrow");
  //loop to get meter to start moving
  arrowLoop=timedLoop(1, function() {
    meter_y=meter_y-meter_dir;
    setPosition("image_MeterPointer", 210, meter_y,100,100);
    if (meter_y>=190) {
    meter_dir=1;
    }
    if (meter_y<=10) {
    meter_dir=-1;
    }
    if (hit==1) {
    stopTimedLoop(arrowLoop);
    }
  });
});
//updating scoring function/calculating score
function updateScore() {
  distance = Math.sqrt((Math.abs(hole_x- getXPosition("image_ball")+10)
  *Math.abs(hole_x- getXPosition("image_ball")+10)) +(Math.abs(hole_y- 
  getYPosition("image_ball")+10)*Math.abs(hole_y- getYPosition("image_ball")+10)));
  score= score + Math.round(distance);
  setText("text_Score","Score: "+score);
  setText("text_FinalScore","Final Score: "+score);
}
//setting the wind
function setWind() {
  wind=randomNumber(-25,25);
  if (wind > 0) {
    setText("text_Wind", "Wind: " + Math.abs(wind)+" mph Right");
  } else if ((wind ===0)) {
    setText("text_Wind", "Wind: "+ wind +" mph");
  } else {
    setText("text_Wind", "Wind: "+ Math.abs(wind)+ " mph Left");
  }
}
function defineHole_PinPlacement(){
  //drawing the hole based on variable 
  //and defining the pin placement for later score calculation
  if (hole===0){
    drawHole_1();
    //keeping the score 0 for the practice hole
    hole_x=getXPosition("image_ball")-10;
    hole_y=getYPosition("image_ball")-10;
  } else if (hole==1) {
    drawHole_2();
    hole_x=232;
    hole_y=169;
  } else if (hole==2) {
    drawHole_3();
    hole_x=190;
    hole_y=177;
  } else if (hole==3) {
    drawHole_4();
    hole_x=118;
    hole_y=147;
  } else if (hole==4) {
    drawHole_5();
    hole_x=134;
    hole_y=194;
  } else if (hole==5) {
    drawHole_6();
    hole_x=241;
    hole_y=189;
  } else if (hole==6) {
    drawHole_7();
    hole_x=216;
    hole_y=156;
  } else if (hole==7) {
    drawHole_8();
    hole_x=147;
    hole_y=168;
  } else if (hole==8) {
    drawHole_9();
    hole_x=196;
    hole_y=148;
    hideElement("nextHole_Button");
    showElement("finish_Button");
  } else {
    hole_x=158;
    hole_y=149;
  }
}
//resetting the variables to original so the game can restart properly
function resetOriginal_Variables() {
  score=0;
  hole=-1;
  count=0;
  meter_y=100;
  meter_dir=1;
  hit=0;
  ball_y=365;
  ball_x=160;
}
//resetting the original texts so that games looks like it reset
function resetOriginal_Texts() {
  setText("text_Hole","Hole Tutorial");
  setText("text_Score","Score: 0");
  setText("text_Wind","Wind: ");
  setText("nextHole_Button","Next Hole!");
}
//high score board 

//draw the course functions with pin coordinates 
function drawHole_Tutorial() {
  //x=193,y=135
  show();
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,60,0,0);
  drawGreen(220,140,25,290,25);
  drawBunker(83,171,12);
  drawBunker(247,253,20);
  drawWater(235,183,25);
}
function drawHole_1() {
  //x=232 y=170
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,40,20,40);
  drawWater(90,180,33);
  drawBunker(73,235,12);
  drawBunker(151,144,15);
  drawBunker(249,292,15);
  drawGreen(260,185,30,325,20);
}
function drawHole_2() {
  //x=192 y=177
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,30,0,0);
  drawWater(220,229,40);
  drawBunker(85,215,25);
  drawBunker(171,136,12);
  drawGreen(202,177,10,290,25);
}
function drawHole_3() {
  //x=120 y=148
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(20,30,330,40);
  drawBunker(194,154,25);
  drawBunker(242,200,27);
  drawGreen(141,137,25,270,20);
}
function drawHole_4() {
  //x=135 y=193
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,25,0,0);
  drawGreen(219,180,85,290,27);
}
function drawHole_5() {
  //x=241 y=189
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(350,25,50,30);
  drawWater(122,163,40);
  drawWater(156,162,30);
  drawGreen(264,211,30,340,18);
}
function drawHole_6() {
  //x=216 y=156
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,23,0,0);
  drawBunker(245,234,20);
  drawBunker(83,208,23);
  drawWater(168,184,30);
  drawWater(185,190,25);
  drawGreen(249,174,35,325,17);
}
function drawHole_7() {
  //x=147 y=168
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(0,40,0,0);
  drawBunker(226,179,20);
  drawBunker(243,209,28);
  drawBunker(76,206,28);
  drawGreen(183,150,40,270,17);
}
function drawHole_8() {
  //x=196 y=148
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(45,60,350,35);
  drawWater(101,182,40);
  drawWater(93,210,35);
  drawGreen(236,144,40,290,20);
}
function drawHole_9() {
  //x=157 y=151
  drawSky_Rough();
  drawAllTrees();
  drawTeeBox();
  drawFairway(315,60,20,30);
  drawWater(218,186,25);
  drawWater(231,210,35);
  drawWater(242,237,25);
  drawBunker(67,172,15);
  drawBunker(77,338,20);
  drawBunker(234,146,15);
  drawGreen(198,146,40,290,25);
}
//basic drawing functions needed to draw the holes
function drawSky_Rough() {
  hide();
  penDown();
  penRGB(0,220,255);
  dot(400);
  moveTo(0, 300);
  penRGB(0,200,0);
  penWidth(400);
  turnTo(90);
  moveForward(320);
  penUp();
}
function drawTree() {
  penUp();
  penRGB(155, 100, 0, 1);
  penWidth(15);
  turnTo(0);
  penDown();
  moveForward(25);
  penUp();
  turnRight(90);
  penRGB(0, randomNumber(50, 190), 0, 1);
  penWidth(20);
  penDown();
  moveForward(20);
  turnTo(340);
  moveForward(58.5);
  turnTo(200);
  moveForward(58.5);
  turnTo(90);
  moveForward(20);
  turnTo(0);
  moveForward(20);
  penUp();
}
function drawAllTrees(){
  moveTo(85,113);
  for (var i = 0; i < 5; i++) {
  drawTree();
  turnTo(195);
  moveForward(65);
  }
  turnTo(90);
  moveForward(15);
  for (var i = 0; i < 9; i++) {
    drawTree();
    turnTo(180);
    moveForward(70);
  }
  moveTo(85,113);
  turnTo(90);
  moveForward(25);
  for (var i = 0; i < 6; i++) {
    drawTree();
    turnTo(153);
    moveForward(50);
  }
  moveTo(235,113);
  for (var i = 0; i < 5; i++) {
    drawTree();
    turnTo(165);
    moveForward(65);
  }
  turnTo(270);
  moveForward(15);
  for (var i = 0; i < 9; i++) {
    drawTree();
    turnTo(180);
    moveForward(70);
  }
}
function drawTeeBox(){
  penRGB(0,180,0);
  moveTo(67,428);
  turnTo(0);
  penWidth(20);
  penDown();
  arcRight(60, 55);
  penUp();
  moveTo(253,428);
  penRGB(0,180,0);
  turnTo(0);
  penWidth(20);
  penDown();
  arcLeft(60, 55);
  penUp();
  penRGB(0,180,0);
  moveTo(236,412);
  turnTo(270);
  penWidth(50);
  penDown();
  moveForward(153);
  penUp();
  moveTo(93,378);
  turnTo(90);
  penWidth(20);
  penRGB(0,220,0);
  penDown();
  moveForward(125);
  penUp();
  turnLeft(180);
  moveForward(15);
  penRGB(0,0,255);
  dot(2);
  moveForward(95);
  dot(2);
}
function drawFairway(w,x,y,z){
  penRGB(0,225,0);
  turnTo(w);
  moveTo(160,300);
  penWidth(120);
  penDown();
  moveForward(x);
  turnTo(y);
  moveForward(z);
  penUp();
}
function drawBunker(Xpos,Ypos,r){
  penRGB(255,222,173);
  moveTo(Xpos,Ypos);
  dot(r);
}
function drawGreen(Xpos,Ypos,pinPlacement,angle,size){
  penRGB(0,255,0);
  moveTo(Xpos,Ypos);
  turnTo(angle);
  penWidth(size);
  penDown();
  arcLeft(40,size*6);
  turnTo(angle-180);
  arcLeft(40,size*6);
  turnTo(angle-30);
  penUp();
  moveForward(pinPlacement);
  penDown();
  drawPin();
}
function drawPin(){
  penUp();
  penRGB(0, 0, 0, 1);
  dot(2);
  penWidth(2);
  penDown();
  turnTo(0);
  moveForward(45);
  penWidth(5);
  penRGB(255, 0, 0, 1);
  turnRight(120);
  moveForward(8.5);
  turnRight(120);
  moveForward(8.5);
  turnRight(120);
  moveForward(8.5);
  penUp();
}
function drawWater(Xpos,Ypos,size){
  moveTo(Xpos,Ypos);
  penRGB(0,170,255);
  dot(size);
}