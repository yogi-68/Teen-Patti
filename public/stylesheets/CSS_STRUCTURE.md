# CSS Organization

This document describes the modular CSS structure for the Teen Patti game.

## Structure

The original `style.css` (631 lines) has been split into organized, maintainable modules:

```
public/stylesheets/
├── style.css                 # Main file - imports all modules
├── style.css.backup          # Original monolithic file (backup)
├── style.less                # LESS source (if used)
├── bootstrap/                # Bootstrap framework
│   └── bootstrap.min.css
├── common/                   # Shared/reusable styles
│   ├── base.css             # Base styles, body, animations
│   ├── icons.css            # Icon sprites and logo styles  
│   └── cards.css            # Playing card component styles
└── pages/                    # Page-specific styles
    ├── startup.css          # Startup/login page
    ├── play-menu.css        # Game menu selection page
    └── gameplay.css         # Main gameplay/table page

```

## File Descriptions

### Common Styles

- **`common/base.css`** (~70 lines)
  - Body styling and layout
  - Global animations (border-animate, etc.)
  - Utility classes (right-align, animate-bet)

- **`common/icons.css`** (~60 lines)
  - Icon sprite positions from grid-icons.png
  - Logo styling
  - Dealer icons
  - User, chips, and other game icons

- **`common/cards.css`** (~170 lines)
  - Playing card structure and layout
  - Card suits (spade, diamond, heart, club)
  - Face cards (J, Q, K)
  - Card text and number styling

### Page-Specific Styles

- **`pages/startup.css`** (~65 lines)
  - Startup page layout and header
  - Join button styles
  - User icon variations

- **`pages/play-menu.css`** (~55 lines)
  - Game menu container
  - Menu item cards (tournament, pub-table, pvt-table)
  - Player info panel

- **`pages/gameplay.css`** (~330 lines)
  - Table layout and info
  - Player seats (main, side, current)
  - Cards positioning and animation
  - Bet controls and actions
  - Winner highlights and notifications
  - Dealer positioning

## Usage

The main `style.css` uses CSS `@import` to load all modules:

```css
/* Common/Shared Styles */
@import url('common/base.css');
@import url('common/icons.css');
@import url('common/cards.css');

/* Page-Specific Styles */
@import url('pages/startup.css');
@import url('pages/play-menu.css');
@import url('pages/gameplay.css');
```

**No changes needed to your HTML/Jade templates** - they continue to reference `/stylesheets/style.css` as before.

## Benefits

✅ **Maintainability**: Easy to find and update specific styles  
✅ **Organization**: Logical separation by purpose and page  
✅ **Collaboration**: Multiple developers can work on different files  
✅ **Debugging**: Smaller files are easier to debug  
✅ **Performance**: Browser can cache individual modules  

## Backup

The original `style.css` is preserved as `style.css.backup` - you can restore it anytime if needed:

```powershell
# To restore original (if needed)
cd public/stylesheets
Copy-Item style.css.backup style.css -Force
```

## Adding New Styles

When adding new styles:

1. **Common elements** → Add to appropriate file in `common/`
2. **Page-specific** → Add to corresponding file in `pages/` or create new page file
3. **New page** → Create new file in `pages/` and add `@import` to main `style.css`

## Notes

- All `@import` statements use relative URLs
- Image paths remain absolute (`/images/...`)
- Load order matters - common styles load before page-specific
- Original file totaled 631 lines, now split into 6 focused modules
