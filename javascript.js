class Escena extends Phaser.Scene {

  preload() {
    this.load.image("fondo", "img//julio/concierto.jpg");
    this.load.image("bola", "img/julio/pildora.png");

    this.load.image("mano1", "img/julio/guitarra.png");
    this.load.image("mano2", "img/julio/bajo.png");
    this.load.image("leftbtn", "img/julio/flecha.png");

    this.load.audio('musicaFondo', 'sounds/fondo.mp3');
    this.load.audio('sonidoMano1', 'sounds/colision1.mp3');
    this.load.audio('sonidoMano2', 'sounds/colision3.mp3');
    this.load.audio('puntoSonido', 'sounds/colision2.mp3');
  }

  create() {

    this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.3 });
    this.musica.play();

    this.input.addPointer();
    this.input.addPointer();
    this.input.addPointer();

    this.add.sprite(480, 320, 'fondo');
    this.bola = this.physics.add.image(480, 320, 'bola').setScale(0.3);



    this.bola.setBounce(1);
    this.mano1 = this.physics.add.sprite(80, 320, "mano1").setScale(0.3);
    this.mano1.body.immovable = true;
    this.bola.setBounce(10);
    this.mano1.setSize(60, 250);
    this.physics.add.collider(this.bola, this.mano1, () => {
      this.sound.play('sonidoMano1', { volume: 0.2 });
    });
    this.mano1.setCollideWorldBounds(true);

    this.mano2 = this.physics.add.sprite(872, 320, "mano2").setScale(0.3);
    
    this.mano2.body.immovable = true;
    this.bola.setBounce(10);
    this.mano2.setSize(60, 250);
    this.physics.add.collider(this.bola, this.mano2, () => {
      this.sound.play('sonidoMano2', { volume: 0.2 });
    });
    this.mano2.setCollideWorldBounds(true);


    const velocidad = 500;

    let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
    const derechaOIzq = Math.floor(Math.random() * 2);
    if (derechaOIzq === 1) {
      anguloInicial = anguloInicial + Math.PI;
    }



    const vx = Math.sin(anguloInicial) * velocidad;
    const vy = Math.cos(anguloInicial) * velocidad;

    this.bola.setBounce(1);
    this.bola.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(false, false, true, true);


    this.bola.body.velocity.x = vx;
    this.bola.body.velocity.y = vy;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.controlesVisaules(
      {
        x: 50,
        y: 50,
      },
      {
        x: 50,
        y: 590,
      },
      this.mano1
    );

    this.controlesVisaules({
      x: 910,
      y: 50
    }, {
      x: 910,
      y: 590
    }, this.mano2);

    this.alguienGano = false;
    this.pintarMarcador();

  }

  update() {
    this.bola.rotation += 0.1;

    if (this.bola.x < 0 && this.alguienGano === false) {
      this.sound.play('puntoSonido', { volume: 0.2 });

      this.alguienGano = true;
      this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
      this.colocarPelota();
    } else if (this.bola.x > 960 && this.alguienGano === false) {
      this.sound.play('puntoSonido', { volume: 0.2 });
      this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
      this.colocarPelota();
    }

    if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
      this.mano1.y = this.mano1.y - 5;
    } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === 1) {
      this.mano1.y = this.mano1.y + 5;
    }

    if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
      this.mano2.y = this.mano2.y - 5;
    } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
      this.mano2.y = this.mano2.y + 5;
    }

  }

  pintarMarcador() {
    this.marcadorMano1 = this.add.text(440, 75, '0', {
      fontFamily: 'font1',
      fontSize: 80,
      color: '#ffffff',
      align: 'right'
    }).setOrigin(1, 0);
    this.marcadorMano2 = this.add.text(520, 75, '0', {
      fontFamily: 'font1',
      fontSize: 80,
      color: '#ffffff',
    });
  }

  colocarPelota() {
    const velocidad = 500;

    let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
    const derechaOIzq = Math.floor(Math.random() * 2);
    if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;


    const vx = Math.sin(anguloInicial) * velocidad;
    const vy = Math.cos(anguloInicial) * velocidad;


    this.bola = this.physics.add.image(480, 320, 'bola').setScale(0.3);


    this.bola.setBounce(1);
    this.physics.world.enable(this.bola);


    this.bola.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.bola.body.velocity.x = vx;
    this.bola.body.velocity.y = vy;
    this.physics.add.collider(this.bola, this.mano1, () => {
      this.sound.play('sonidoMano1', { volume: 0.2 });
    });

    this.physics.add.collider(this.bola, this.mano2, () => {
      this.sound.play('sonidoMano2', { volume: 0.2 });
    });

    this.alguienGano = false;
  }

  controlesVisaules(btn1, btn2, player) {
    const upbtn = this.add.sprite(btn1.x, btn1.y, "leftbtn").setInteractive().setScale(0.3);
    const downbtn = this.add.sprite(btn2.x, btn2.y, "leftbtn").setInteractive().setScale(0.3);
    downbtn.flipY = true;

    downbtn.on("pointerdown", () => {
      player.setData("direccionVertical", -1);
    });
    upbtn.on("pointerdown", () => {
      player.setData("direccionVertical", 1);
    });
    downbtn.on("pointerup", () => {
      player.setData("direccionVertical", 0);
    });
    upbtn.on("pointerup", () => {
      player.setData("direccionVertical", 0);
    });
  }


}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scene: Escena,
  physics: {
    default: 'arcade',
  }
}

new Phaser.Game(config);
