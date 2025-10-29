# Teen Patti - Project Organization Guide

## 📁 Current Folder Structure

```
Teen-Patti/
│
├── 📂 src/                          [NEW - Future organized code]
│   ├── 📂 config/                   Configuration modules
│   ├── 📂 models/                   Data models (planned)
│   ├── 📂 services/                 Business logic services (planned)
│   └── 📂 utils/                    Utility functions (planned)
│
├── 📂 lib/                          [CURRENT - Game Logic]
│   ├── 📂 base/                     Base utilities
│   │   ├── Lite.js                  Lightweight utility class
│   │   └── utils.js                 General utilities (GUID, etc.)
│   ├── 📂 dal/                      Data Access Layer
│   │   └── users.js                 User data operations
│   ├── card.js                      Card model definition
│   ├── cardComparer.js              Card comparison logic
│   ├── deck.js                      Deck management
│   ├── dal.js                       MongoDB connection & config
│   ├── io.js                        Socket.IO event handlers
│   └── tabledecks.js                Table & game state management
│
├── 📂 routes/                       [EXPRESS ROUTES]
│   ├── index.js                     Main route handler
│   ├── startup.js                   Login/startup routes
│   ├── gameMenu.js                  Game menu routes
│   ├── gameplay.js                  Gameplay page routes
│   └── user.js                      User registration/auth routes
│
├── 📂 views/                        [TEMPLATES - Jade/Pug]
│   ├── layout.jade                  Master layout template
│   ├── index.jade                   Home page
│   ├── error.jade                   Error page
│   ├── startup.jade                 Login page
│   ├── startup.ajax.jade            Login AJAX partials
│   ├── gameMenu.jade                Game menu page
│   ├── gameMenu.ajax.jade           Menu AJAX partials
│   └── gameplay.ajax.jade           Game UI templates (cards, players, etc.)
│
├── 📂 public/                       [STATIC ASSETS]
│   ├── 📂 stylesheets/              CSS files
│   │   ├── 📂 common/               Shared styles
│   │   │   ├── base.css             Global styles & animations
│   │   │   ├── icons.css            Icon sprites
│   │   │   └── cards.css            Playing card styles
│   │   ├── 📂 pages/                Page-specific styles
│   │   │   ├── startup.css          Login page styles
│   │   │   ├── play-menu.css        Game menu styles
│   │   │   └── gameplay.css         Game table styles
│   │   ├── 📂 bootstrap/            Bootstrap framework
│   │   │   └── bootstrap.min.css
│   │   ├── 📂 fonts/                Font files
│   │   │   └── glyphicons-*         Bootstrap icon fonts
│   │   ├── style.css                Main CSS (imports all modules)
│   │   ├── style.css.backup         Original monolithic CSS backup
│   │   └── style.less               LESS source (if used)
│   │
│   ├── 📂 javascripts/              Client-side JavaScript
│   │   ├── 📂 vendor/               Third-party libraries
│   │   │   ├── angular-1.2.0.js     Angular.js framework
│   │   │   ├── angular-ui-router.js UI Router for Angular
│   │   │   ├── jquery-1.10.2.js     jQuery library
│   │   │   ├── bootstrap.js         Bootstrap JS
│   │   │   └── ui-bootstrap-*.js    Angular Bootstrap components
│   │   └── main.js                  Main Angular app & directives
│   │
│   └── 📂 images/                   Image assets
│       ├── grid-icons.png           Icon sprite sheet
│       ├── deck-bg.jpg              Card deck background
│       ├── poker-table.png          Poker table image
│       ├── ajax-loader.gif          Loading spinner
│       └── pre-loader-*.gif         Various loading indicators
│
├── 📂 docs/                         [DOCUMENTATION]
│   ├── MONGODB_ATLAS_SETUP.md       MongoDB setup guide
│   ├── CSS_STRUCTURE.md             CSS organization doc
│   └── ADD_TABLE_IMAGE.md           Table image integration notes
│
├── 📂 bin/                          [EXECUTABLES]
│   └── www                          Server startup script
│
├── 📂 node_modules/                 NPM dependencies (ignored in git)
│
├── app.js                           Express app configuration
├── config.js                        App configuration file
├── package.json                     NPM dependencies & scripts
├── package-lock.json                Dependency lock file
├── .gitignore                       Git ignore rules
├── .env.example                     Environment variables template
├── start.bat                        Windows startup script
└── README.md                        Project documentation

```

## 🎯 File Organization Principles

### By Responsibility

1. **Backend Logic** → `lib/`
   - Game rules, card logic, database operations

2. **Web Routes** → `routes/`
   - HTTP endpoints, page serving

3. **Frontend Views** → `views/`
   - HTML templates (Jade/Pug)

4. **Static Assets** → `public/`
   - CSS, JavaScript, Images

5. **Documentation** → `docs/`
   - Guides, setup instructions

6. **Configuration** → Root level
   - `app.js`, `config.js`, `.env`

### By Feature (Future Migration to `src/`)

When refactoring, consider organizing by feature:

```
src/
├── game/
│   ├── models/       (Card, Deck, Table)
│   ├── services/     (GameService, BettingService)
│   └── utils/        (cardComparer, validators)
├── user/
│   ├── models/       (User)
│   ├── services/     (UserService, AuthService)
│   └── routes/       (user.routes.js)
└── shared/
    ├── config/       (database, app config)
    └── utils/        (common utilities)
```

## 📋 Key Files Explained

### Core Application
- **`app.js`** - Express app setup, middleware, route mounting
- **`bin/www`** - Server startup, port binding, error handling
- **`config.js`** - Application configuration

### Game Logic
- **`lib/io.js`** - Socket.IO connection handling, real-time events
- **`lib/tabledecks.js`** - Table management, game state, player actions
- **`lib/deck.js`** - Card deck creation and shuffling
- **`lib/cardComparer.js`** - Teen Patti hand ranking logic
- **`lib/dal.js`** - Database connection and operations

### Frontend
- **`public/javascripts/main.js`** - Angular controllers, directives, services
- **`public/stylesheets/style.css`** - Main stylesheet (imports all CSS modules)
- **`views/gameplay.ajax.jade`** - Game UI templates (cards, players, dealer)

## 🔄 Migration Plan (Future)

### Phase 1: Documentation ✅
- [x] Create README.md
- [x] Organize docs/ folder
- [x] Create .env.example

### Phase 2: Configuration
- [ ] Move config.js to src/config/
- [ ] Create separate env configs (dev, prod)
- [ ] Externalize game constants

### Phase 3: Models
- [ ] Move card.js to src/models/
- [ ] Move deck.js to src/models/
- [ ] Create User model from dal/users.js

### Phase 4: Services
- [ ] Extract game logic from tabledecks.js
- [ ] Create GameService, TableService
- [ ] Create UserService from routes/user.js

### Phase 5: Testing
- [ ] Add test/ directory
- [ ] Unit tests for game logic
- [ ] Integration tests for API

## 💡 Best Practices

### File Naming
- **Routes**: `kebab-case.js` (e.g., `game-menu.js`)
- **Models**: `PascalCase.js` (e.g., `Card.js`, `User.js`)
- **Utilities**: `camelCase.js` (e.g., `cardComparer.js`)
- **Views**: `kebab-case.jade` (e.g., `game-menu.jade`)

### Directory Structure
- One feature per directory in `src/`
- Keep related files together
- Separate concerns (models, views, controllers)

### Code Organization
- Keep files under 300 lines
- One class/module per file
- Clear separation of concerns

## 📦 NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run `npm start`
5. Open `http://localhost:3000`

---

**Last Updated:** October 29, 2025
**Maintained By:** yogi-68
