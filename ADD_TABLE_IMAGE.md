# Add Poker Table Image

To use the poker table image in your game:

## Step 1: Save the Image

1. Save the Teen Patti poker table image as `poker-table.png`
2. Place it in: `C:\Users\yoges\OneDrive\Desktop\Teen-Patti\public\images\`

## Step 2: That's It!

The CSS is already configured to use `/images/poker-table.png` as the background.

## Alternative Image Formats

If you prefer a different format, you can use:
- `poker-table.jpg` (smaller file size)
- `poker-table.webp` (best compression)

Just update line 4 in `public/stylesheets/pages/gameplay.css`:

```css
background: #000 url('/images/poker-table.png') no-repeat center center;
```

Change `poker-table.png` to match your filename.

## Current Configuration

The table image will:
- ✅ Be centered on the page
- ✅ Scale to fit (background-size: contain)
- ✅ Have a black background behind it
- ✅ Work with all your existing player positions and game elements

## Restart Server

After adding the image, refresh your browser or restart the server:

```powershell
cd C:\Users\yoges\OneDrive\Desktop\Teen-Patti
node app.js
```

Then navigate to the gameplay page to see the table!
