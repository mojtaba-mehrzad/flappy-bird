# Flappy Bird

A lightweight HTML5 Canvas recreation of the classic flap-and-dodge game. Guide the bird through procedurally positioned pipes, avoid collisions, and beat your best score.

## Play Online

[Play Flappy Bird in your browser](https://mojtaba-mehrzad.github.io/flappy-bird/)

The game is hosted as a static site and requires no installation or account.

## Features

- Canvas-based gameplay with a compact 320x480 game board
- Responsive input for desktop and mobile browsers
- Keyboard, mouse, touch, and pointer controls
- Animated bird movement and rotation
- Procedurally generated pipe positions
- Collision detection with pipes and the ground
- Score and persistent best score using `localStorage`
- Sound effects for starting, flapping, scoring, collisions, and game over
- No external libraries or build tools required

## Controls

| Input | Action |
| --- | --- |
| Click or tap | Start the game or flap |
| Spacebar | Start the game or flap |
| Click or tap after game over | Restart |

## Run Locally

This is a static browser project. You can open `flappy bird.html` directly in a browser, or serve the project with any local HTTP server.

For example, with Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000/flappy%20bird.html](http://localhost:8000/flappy%20bird.html).

Serving the project over HTTP is recommended because it matches the way the deployed version is hosted and avoids browser restrictions that can affect local media loading.

## Project Structure

```text
.
├── flappy bird.html   # Canvas page and browser entry point
├── game.js            # Game state, physics, rendering, input, and scoring
├── img/
│   └── sprite.png     # Game sprite sheet
└── sounds/
    ├── die.wav        # Game-over sound
    ├── flap.wav       # Flap sound
    ├── hit.wav        # Collision sound
    ├── score.wav      # Scoring sound
    └── start.wav      # Start sound
```

## How It Works

The game runs in a browser animation loop using `requestAnimationFrame`. The bird uses gravity and flap impulses, while pipes move from right to left and are generated at timed intervals. Movement is calculated with elapsed frame time so gameplay remains more consistent across devices with different refresh rates.

The current game state is managed with three modes:

- **Ready:** Displays the start prompt and keeps the bird in place.
- **Playing:** Updates physics, pipes, collisions, animation, and score.
- **Game Over:** Displays the final score and best score until the player restarts.

The best score is stored locally in the browser with `localStorage`.

## Technologies

- HTML5
- CSS3
- JavaScript
- Canvas 2D API
- Web Audio API
- Browser `localStorage`

## Browser Support

The game is designed for modern browsers with support for HTML5 Canvas, `requestAnimationFrame`, pointer events, audio playback, and `localStorage`.

## License

No license has been specified for this project yet. Add a license file before distributing or reusing the code publicly.
