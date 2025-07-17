# 🌟 EchoWorld - Adventure Game

A modern, engaging 2D adventure game built with HTML5 Canvas and JavaScript. Navigate through challenging levels, collect echoes, avoid obstacles, and advance through portals in this beautifully designed game.

## 🎮 Game Features

- **Modern UI Design**: Beautiful gradient backgrounds, glassmorphism effects, and smooth animations
- **Progressive Difficulty**: Levels get more challenging with increased speed and more enemies
- **Multiple Game Elements**:
  - ⭐ **Echoes**: Collectible stars that increase your score
  - 🔴 **Obstacles**: Static red blocks to avoid
  - 🔵 **Enemies**: Moving circular enemies that bounce around
  - 🌀 **Portal**: Appears when all echoes are collected to advance levels
- **Particle Effects**: Visual feedback for collisions and achievements
- **Responsive Design**: Works on both desktop and mobile devices
- **Game States**: Menu, playing, paused, and game over screens

## 🕹️ How to Play

### Controls
- **Movement**: Use ARROW KEYS or WASD to move your green player character
- **Game Controls**: 
  - Start Game button to begin
  - Pause button to pause/unpause
  - Reset button to restart

### Objective
1. **Collect all echoes** (⭐) in each level to activate the portal
2. **Avoid obstacles** (🔴) and enemies (🔵) - they reduce your lives
3. **Reach the portal** (🌀) to advance to the next level
4. **Survive as long as possible** and achieve the highest score!

### Scoring
- **100 points** per echo collected
- **500 × level number** bonus points when completing a level
- Game speed increases with each level for added challenge

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Running the Game
1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Click "Start Game"** and enjoy!

### File Structure
```
EchoWorld/
├── index.html      # Main HTML file
├── styles.css      # Game styling and animations
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## 🎯 Game Mechanics

- **Lives System**: Start with 3 lives, lose one when hitting obstacles or enemies
- **Level Progression**: Each level has more echoes and obstacles
- **Enemy Behavior**: Enemies move randomly and bounce off walls
- **Portal Activation**: Portal only appears after collecting all echoes
- **Particle System**: Visual effects for collisions and level completion

## 🎨 Technical Features

- **HTML5 Canvas**: Smooth 2D graphics rendering
- **Object-Oriented JavaScript**: Clean, modular code structure
- **CSS3 Animations**: Modern styling with gradients and blur effects
- **Responsive Design**: Adapts to different screen sizes
- **Efficient Game Loop**: Optimized rendering and update cycles

## 🏆 Tips for High Scores

1. **Plan your route** to collect echoes efficiently
2. **Watch enemy patterns** to avoid collisions
3. **Use the walls** to your advantage for movement
4. **Collect echoes quickly** to minimize exposure to enemies
5. **Practice movement** to improve reaction time

## 🔧 Customization

The game is designed to be easily customizable. You can modify:
- Player speed and size in the `player` object
- Number of echoes, obstacles, and enemies per level
- Colors and visual effects
- Game mechanics and scoring system

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎉 Enjoy Playing EchoWorld!

Have fun exploring the echo-filled dimensions and see how far you can progress through the challenging levels!