# 🛒 CartShare

> Stack the cart. Share the cost.

A real-time collaborative shopping cart for shared living — dorm rooms, office teams, and travel groups. Create a room, share the code, and everyone adds items to one cart with full transparency.

---

## Features

| Feature | Description |
|---------|-------------|
| **Room System** | Create or join a room via a 6-character code |
| **Product Catalog** | 57 products across 8 categories with search, filters, and quick-add (Blinkit-style) |
| **Shared Cart** | Add, remove, and update items — everyone sees the same cart |
| **Real-time Sync** | Changes sync across browser tabs instantly (BroadcastChannel API) |
| **Activity Log** | Timestamped feed showing who did what |
| **Printable Receipt** | Formatted receipt with itemized totals — click Print to get a clean copy |
| **Responsive** | Works on mobile, tablet, and desktop (Bootstrap 5) |
| **Persistent** | Cart data survives page refreshes (localStorage) |

## How It Works

1. Enter your name → **Create a Room** (or **Join** with a code)
2. Share the 6-character room code with your group
3. Everyone adds items with prices and quantities
4. The cart and activity log update for all participants in real-time
5. Click **Receipt** → **Print** for a clean, itemized summary

> Multiple users are simulated by opening the room in separate browser tabs with different names. All tabs sync via BroadcastChannel.

## Tech Stack

- **HTML5 / CSS3** — Flexbox, Grid, custom properties, Bootstrap 5
- **JavaScript (ES6)** — Vanilla, no frameworks, pure DOM manipulation
- **BroadcastChannel API** — Cross-tab real-time sync
- **localStorage** — Client-side data persistence
- **Font Awesome 6** — Icons

## Project Structure

```
├── index.html          # Landing page — create / join room
├── room.html           # Room page — cart, activity, receipt
├── css/
│   ├── style.css       # Design system, layout, components
│   └── print.css       # Print media rules for receipt
├── js/
│   ├── utils.js        # Helpers — IDs, formatting, toasts
│   ├── storage.js      # localStorage CRUD
│   ├── sync.js         # BroadcastChannel sync layer
│   ├── room.js         # Create / join / leave room
│   ├── cart.js         # Cart items + table rendering
│   ├── catalog.js      # Product catalog — data, categories, search, rendering
│   ├── activity.js     # Activity log + feed rendering
│   ├── receipt.js      # Receipt generation + print
│   └── app.js          # Page router + initialization
├── assets/
│   └── favicon.svg     # Cart icon
└── README.md
```

## Getting Started

**Option 1 — Local server (recommended):**
```bash
python -m http.server 8080
# then open http://localhost:8080
```

**Option 2 — Direct file open:**
Just double-click `index.html` in your file explorer.

### Testing Multi-User Collaboration

1. Open `index.html` in your browser
2. Enter a name and **Create a Room** → note the 6-character code
3. Open a **new tab**, go to the same URL
4. Enter a different name, switch to **Join Room**, enter the code
5. Add items in either tab — both tabs update instantly

## Deployment

**Netlify / Vercel:** Push to GitHub → import repo → publish directory is root (`/`) → deploy.

**GitHub Pages:** Settings → Pages → Source: `main` branch, folder `/ (root)` → Save.

No build step required — this is a static site.

## Product Catalog

Blinkit-style product browsing integrated into the room page:

- **8 categories**: Fruits & Vegetables, Dairy & Breakfast, Snacks & Munchies, Cold Drinks & Juices, Bakery & Biscuits, Cleaning Essentials, Chicken/Meat/Fish, Atta/Rice/Dal
- **57 products** with emoji icons, prices in ₹, and unit labels (per kg, per dozen, etc.)
- **Search bar** — filter products by name across all categories
- **Category tabs** — horizontally scrollable, click to filter
- **Quantity selector** (−/+) on each card — adjust before adding
- **Quick-add button** — "ADD" adds directly to the shared cart with visual feedback
- **Manual entry** — the custom add-item form is still available below the catalog

## Design

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#4361EE` (Indigo) | Brand, headers, active states |
| Accent | `#F72585` (Pink) | CTAs, add-to-cart button |
| Warm | `#F9C74F` (Gold) | Highlights, activity indicators |
| Display | Space Grotesk | Headings, room code badge |
| Body | Inter | All body text |
| Mono | JetBrains Mono | Prices, room codes |

**Signature element:** The room code badge in the header pulses with a green glow when activity happens in the room.

## Submission

Format: `BatchID_FullName_CartShare`
