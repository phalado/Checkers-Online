<br />
<h1 align="center">Checkers Online</h1>

This is a personal project. My objective was to test my skills doing an online, multiplayer game.

In this project I built a CHeckers game using JavaScript's framework [Phaser 3][phaser-url], a "fast, free and fun open-source framework for Canvas and WebGL powered browser games".

<h1 align="center"><img src="https://raw.githubusercontent.com/phalado/Checkers-Online/develop/images/game-screen.png"></h1>


## Table of Contents

- [Table of Contents](#table-of-contents)
- [The game](#the-game)
  - [The rules](#the-rules)
  - [How to play](#how-to-play)
- [Contact](#contact)


## The game

This is a simple checkers game, but it is multiplayer only -  you can only play if someone click on 'Join Game' and insert your code. Doing an AI to play a single game is in my future plans.


### The rules

Some of the common rules were aplied, other were not. Here are the rules:

* **Hoving** over a piece show if it can moved. **Clicking** on it show the possible moves, including jumps and multiple jumps.
* Jumping over an opponent piece will destroy that piece. It is called **eating**.
* All pieces walk in **diagonal** and **forwards**, and one spot at time, unless it is possible to do eat multiple pieces.
* If a piece reach the last spot of the table this piece will be turned into a **king**. The king can eat and walk backwards.
* In this version of the game you are not obligated to eat if you can.
* You win if the opponent ends with no pieces or movements.


### How to play

Youn can play it online clicking [here][live-version] or locally following these steps:

* Click on the green button "Clone or Download"
* Click on Download ZIP
* Extract the game
* In your terminal, navigate to the game's folder
* Run 'node server.js'
* Open, in your browser, 'localhost:8082'
* Humiliate your friends.


## Contact

Author: Raphael Cordeiro

Follow me on [twitter][rapha-twitter],  visit my [Github portfolio][rapha-github], my [Linkedin][rapha-linkedin] or my [personal portfolio][rapha-personal].




<!-- Links -->
[live-version]: https://checkers-online-phalado.herokuapp.com/
[phaser-url]: https://phaser.io/
[rapha-github]: https://github.com/phalado
[rapha-twitter]: https://twitter.com/phalado
[rapha-linkedin]: https://www.linkedin.com/in/raphael-cordeiro/
[rapha-personal]: https://phalado.github.io/