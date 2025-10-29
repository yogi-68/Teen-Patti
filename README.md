# Teen Patti Card Game

A real-time multiplayer Teen Patti (Indian Poker) card game built with Node.js, Express, Socket.IO, and MongoDB.

## 🎮 Game Features

- **Real-time Multiplayer**: Play with 2-5 players simultaneously
- **Socket.IO Integration**: Real-time gameplay updates
- **Chip System**: Start with 100 chips, boot amount of 1
- **Auto-fold Protection**: Automatic fold when insufficient chips
- **Responsive UI**: Angular.js powered frontend with Bootstrap

## 📁 Project Structure

```
Teen-Patti/
├── src/                      # Source code (new organized structure)
│   ├── config/              # Configuration files
│   ├── models/              # Game models (Card, Deck, Table)
│   ├── services/            # Business logic services
│   └── utils/               # Utility functions
├── lib/                      # Legacy game logic (to be migrated)
│   ├── base/                # Base utilities
│   ├── dal/                 # Data access layer
│   ├── card.js              # Card model
│   ├── cardComparer.js      # Card comparison logic
│   ├── deck.js              # Deck management
│   ├── dal.js               # MongoDB connection
│   ├── io.js                # Socket.IO handlers
│   └── tabledecks.js        # Table/game management
├── routes/                   # Express routes
│   ├── index.js             # Main routes
│   ├── startup.js           # Startup/login routes
│   ├── gameMenu.js          # Game menu routes
│   ├── gameplay.js          # Gameplay routes
│   └── user.js              # User management routes
├── views/                    # Jade/Pug templates
│   ├── layout.jade          # Main layout
│   ├── index.jade           # Home page
│   ├── startup.jade         # Login page
│   ├── gameMenu.jade        # Game menu
│   ├── gameplay.ajax.jade   # Game templates
│   └── *.ajax.jade          # AJAX partial templates
├── public/                   # Static assets
│   ├── stylesheets/         # CSS files
│   │   ├── common/          # Shared styles
│   │   ├── pages/           # Page-specific styles
│   │   └── bootstrap/       # Bootstrap framework
│   ├── javascripts/         # Client-side JS
│   │   ├── main.js          # Main Angular app
│   │   └── vendor/          # Third-party libraries
│   └── images/              # Image assets
├── docs/                     # Documentation
│   ├── MONGODB_ATLAS_SETUP.md
│   └── CSS_STRUCTURE.md
├── bin/                      # Executable scripts
│   └── www                  # Server startup script
├── app.js                    # Express app configuration
├── config.js                 # App configuration
├── package.json              # Dependencies
└── .gitignore               # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yogi-68/Teen-Patti.git
cd Teen-Patti
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
   - Update `lib/dal.js` with your MongoDB connection string
   - Or set environment variable: `MONGODB_URI`

4. Start the server:
```bash
npm start
# or
node app.js
# or (Windows)
start.bat
```

5. Open browser:
```
http://localhost:3000
```

## 🎯 Game Configuration

### Chip Economy
- **Starting Chips**: 100 per player
- **Boot Amount**: 1 (entry fee per game)
- **Max Bet**: 128
- **Pot Limit**: 2,048
- **Min Chips to Play**: 10

### Game Rules
- **Players**: 2-5 players per table
- **Blind Limit**: 4 blind bets before forced card view
- **Auto-fold**: Players with insufficient chips automatically fold
- **Side Show**: Available after 2 active players remain

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Jade/Pug** - Template engine

### Frontend
- **Angular.js 1.2** - Frontend framework
- **Bootstrap 3** - UI framework
- **jQuery** - DOM manipulation
- **Angular UI Router** - Routing

## 📝 API Routes

- `GET /` - Home page
- `GET /startup` - Login page
- `POST /user/register` - Register new user
- `GET /gameMenu` - Game menu
- `GET /gameplay` - Game table

## 🔧 Development

### File Organization Status
- ✅ CSS modularized (common/, pages/)
- ✅ Game logic in lib/
- 🚧 Moving to src/ structure (planned)
- ✅ Documentation in docs/

### Recent Changes
- Set initial chips to 100
- Boot amount reduced to 1
- Added auto-fold protection
- Minimum play requirement: 10 chips
- Database validation checks

## 🐛 Known Issues

- MongoDB TLS using `tlsAllowInvalidCertificates` (development only)
- npm vulnerabilities exist (37 total)
- Hardcoded credentials in fallback (use env vars)

## 📄 License

This project is open source. Please check the repository for license details.

## 👥 Contributors

- yogi-68 (Owner)

## 🔗 Links

- GitHub: https://github.com/yogi-68/Teen-Patti
- Issues: https://github.com/yogi-68/Teen-Patti/issues
