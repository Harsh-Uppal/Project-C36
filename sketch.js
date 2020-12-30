// JavaScript source code
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

//All Variables
var foodImg,foodStock, dogImg, happyDogImg, database, nowImg, lastFed = 0,frame = 1;

function SetImg() {
    database.ref("lastFed").on("value", (e) => {
        if (e.val() < frame - 100000) {
            nowImg = dogImg;
        }
        else {
            nowImg = happyDogImg;
        }
    });
}

function setup() {


    createCanvas(1100, 700);

    engine = Engine.create();
    world = engine.world;

    //Give values to variables
    dogImg = loadImage("Dog.png");
    happyDogImg = loadImage("happydog.png");
    foodImg = loadImage("Milk.png");
    nowImg = dogImg;

    database = firebase.database();
    SetImg();

    foodStock = database.ref("foodStock");
    foodStock.on("value", function (data) { foodStock = data.val(); });
    database.ref("lastFed").on("value", function (data) { lastFed = data.val(); });
    database.ref("frame").on("value", function (data) { frame = data.val(); });

}

function draw() {
    background("white");
    Engine.update(engine);

    //display objects
    text("FoodStock : " + foodStock, 600, 100);
    rect(800, 100, 100, 50);
    text("Add Food", 820, 130);
    rect(800, 250, 100, 50);
    text("Feed Drago", 820, 280);
    SetFoodImgs();
    image(nowImg, 600, 200, 100, 100);
    if (lastFed < frame - 100000) {
        SetImg();
    }
    if (frame % 1000 == 0) {
        UpdateFrame();
        StopOverflow();
    }
    frame++;
}

function mousePressed() {
    if (mouseX > 800 && mouseX < 900) {
        if (mouseY > 250 && mouseY < 300) {
            SetLastFed();
            SetImg();
            foodStock--;
            lastFed = frame;
            database.ref("foodStock").set(foodStock);
        }
        else if (mouseY > 100 && mouseY < 150) {
            database.ref("foodStock").set(20);
            foodStock = 20;
        }
    }
}

function SetLastFed() {
    database.ref("lastFed").set(frame);
}

function UpdateFrame(){
    database.ref("frame").set(frame);
}

function StopOverflow() {
    if (frame > 0 && lastFed > 0) {
        database.ref("frame").set(frame - 1000);
        database.ref("lastFed").set(lastFed - 1000);
    }
}

function SetFoodImgs() {
    for (var i = 1; i <= foodStock; i++) {
        if (i > 10)
            image(foodImg, i * 30 - 300, 180, 70, 70);
        else
            image(foodImg, i * 30, 120, 70, 70);
    }
}