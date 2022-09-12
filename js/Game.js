class Game {
  constructor() {
    this.resetTit = createElement("h2");
    this.resetbutton = createButton("");
    this.leaderTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getcount();

    voltron = createSprite(width / 2 - 50, height - 100);
    voltron.addImage("kart1", voltronImg);
    voltron.scale = 0.07;

    macquenn = createSprite(width / 2 + 100, height - 100);

    macquenn.addImage("kart2", macquennImg);
    macquenn.scale = 0.07;

    cars = [voltron, macquenn];
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image },
    ];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    this.all(5, fuel, 0.02, fuels);
    this.all(15, coin, 0.09, coins);
    this.all(
      obstaclesPositions.length,
      obstacle1Image,
      0.04,
      obstacles,
      obstaclesPositions
    );
  }
  PLAY() {
    form.hide();
    this.showElements();
    this.resetar();

    player.getCarEnd();

    Player.readPlayer();
    if (allPlayers !== undefined) {
      image(road, 0, -height * 5, width, height * 6);
      var index = 0;
      this.showleaders();
      this.showLife();
      this.showFuelBar();

      for (var Plr in allPlayers) {
        index += 1;
        var x = allPlayers[Plr].positionX;
        var y = height - allPlayers[Plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          fill("black");
          textAlign("center");
          text(player.name, x, y - 50);
          camera.position.y = cars[index - 1].position.y;
          this.addfuel(index);
          this.addcoin(index);
          this.touchLife(index);
        }
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      this.control();

      const finish = height * 6 - 100;
      if (player.positionY > finish) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsEnd(player.rank);
        player.update();
        this.showRank("");
      }
      drawSprites();
    }
  }

  getState() {
    var stateref = database.ref("gameState");
    stateref.on("value", (data) => {
      gameState = data.val();
    });
  }

  update(value) {
    database.ref("/").update({
      gameState: value,
    });
  }

  control() {
    if (keyIsDown(87)) {
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(65) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(68) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }
  showElements() {
    this.resetTit.html("RECHANGE");
    this.resetTit.position(width / 2 + 200, 50);
    this.resetTit.class("resetText");

    this.resetbutton.class("resetButton");
    this.resetbutton.position(width / 2 + 230, 120);

    form.titleImg.position(50, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.leaderTitle.html("POINT");
    this.leaderTitle.position(width / 3 - 60, 50);
    this.leaderTitle.class("resetText");

    this.leader1.position(width / 3 - 60, 100);
    this.leader1.class("leadersText");

    this.leader2.position(width / 3 - 60, 150);
    this.leader2.class("leadersText");
  }

  resetar() {
    this.resetbutton.mousePressed(() => {
      database.ref("/").set({
        carsEnd: 0,
        gameState: 0,
        playerCount: 0,
        players: {},
      });
      location.reload();
    });
  }

  showleaders() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  all(num, image, scale, Group, position = []) {
    for (var i = 0; i < num; i++) {
      var x;
      var y;
      if (position.length > 0) {
        x = position[i].x;
        y = position[i].y;
        image = position[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage(image);
      sprite.scale = scale;
      Group.add(sprite);
    }
  }
  addfuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 200;
      collected.remove();
    });

    // reduzindo o combustível do carro
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  addcoin(index) {
    cars[index - 1].overlap(coins, function (collector, collected) {
      player.score += 100;
      collected.remove();
      player.update();
    });
  }
  showRank() {
    swal({
      title: `WINNER WORLD ${"\n"}${player.rank}º Lugar `,
      text: "eu sou a velocidade",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "PRO",
    });
  }

  showLife() {
    push();
    image(life, width / 2, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 200, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuel, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 200, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  touchLife(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (player.life > 0) {
        player.life -= 200 / 4;
      }

      player.update();
    }
  }
}
