class Player {
  constructor() {
    this.name = null;
    this.positionX = 0;
    this.positionY = 0;
    this.index = null;
    this.score = 0;
    this.rank = 0;
    this.fuel = 200;
    this.life = 200;
  }

  getcount() {
    var playercountref = database.ref("playerCount");
    playercountref.on("value", (data) => {
      playerCount = data.val();
    });
  }

  updateCount(value) {
    database.ref("/").update({
      playerCount: value,
    });
  }
  addPlayer() {
    var playerIndex = "players/player" + this.index;

    if (this.index === 1) {
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      score: this.score,
      rank: this.rank,
      fuel: this.fuel,
      life: this.life,
    });
  }
  static readPlayer() {
    var playerInfo = database.ref("players");
    playerInfo.on("value", (data) => {
      allPlayers = data.val();
    });
  }
  getdistance() {
    var playerdistance = database.ref("players/player" + this.index);
    playerdistance.on("value", (data) => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }

  update() {
    var playerIndex = "players/player" + this.index;

    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      score: this.score,
      rank: this.rank,
      fuel: this.fuel,
      life: this.life,
    });
  }
  getCarEnd() {
    database.ref("carsEnd").on("value", (data) => {
      this.rank = data.val();
    });
  }
  static updateCarsEnd(rank) {
    database.ref("/").update({
      carsEnd: rank,
    });
  }
}
