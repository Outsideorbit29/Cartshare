# 🛒 CartShare — Collaborative Shopping Cart

**Stack the cart. Share the cost.**

CartShare is a real-time collaborative shopping cart web app designed for shared living environments — student dorms, office teams, and travel groups. It solves the chaos of coordinating joint purchases by providing a shared, transparent, and synchronized cart experience.

## Features

- **🔑 Room System**: Create or join a unique room using a 6-character code
- **🛍️ Shared Cart**: Add/remove items with prices and quantities, visible to everyone in the room
- **⚡ Real-time Sync**: Cross-tab synchronization using the Browser's BroadcastChannel API — changes in one tab instantly reflect in all others
- **📋 Activity Log**: See who added, removed, or updated what, with timestamps
- **🧾 Printable Receipt**: Generate an audit-ready, formatted receipt for the group
- **📱 Fully Responsive**: Works on phones, tablets, and desktops (Bootstrap 5 + custom styles)
- **💾 Persistent Data**: Cart state is saved to localStorage — refresh without losing items

## How It Works

1. **Create a Room**: Enter your name and click "Create a Room" — you'll get a unique 6-character code
2. **Invite Others**: Share the code with your group. They open the app, enter their name and code, and click "Join Room"
3. **Add Items**: Everyone can add items with prices and quantities — the cart updates in real-time for all participants
4. **Track Activity**: The activity log shows who did what and when
5. **Generate Receipt**: When the order is ready, generate a printable receipt with itemized totals

> **Note**: Since there's no backend, "multiple users" are simulated by opening the room in multiple browser tabs with different usernames. All tabs sync via the BroadcastChannel API.

## Live Demo

[Deploy to Vercel, Netlify, or GitHub Pages — see instructions below]

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, Grid, custom properties, responsive design
- **Bootstrap 5** — Responsive grid, components, utilities
- **JavaScript (Vanilla ES6)** — No frameworks, pure DOM manipulation
- **BroadcastChannel API** — Cross-tab real-time synchronization
- **localStorage** — Client-side data persistence
- **Font Awesome 6** — Icons

## Folder Structure

```
├── index.html              # Landing page: create/join room
├── room.html               # Room page: shared cart + activity + receipt
├── css/
│   ├── style.css           # Main stylesheet (design tokens, layout, components)
│   └── print.css           # Print media rules for receipt
├── js/
│   ├── utils.js            # Helper utilities (ID generation, formatting, toasts)
│   ├── storage.js          # localStorage CRUD operations
│   ├── sync.js             # BroadcastChannel cross-tab sync
│   ├── room.js             # Room management (create, join, leave)
│   ├── cart.js             # Cart item logic + rendering
│   ├── activity.js         # Activity log + rendering
│   ├── receipt.js          # Receipt generation + print
│   └── app.js              # Main entry point, page router
├── assets/
│   └── favicon.svg         # Cart icon
└── README.md               # This file
```

## How to Run Locally

### Option 1: Direct (No Server)
Simply open `index.html` in your browser. Due to module loading via `<script>` tags (not ES modules), this works directly from the file system.

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` in your browser.

### Testing Multi-User Collaboration
1. Open the app in your browser
2. Enter a name and create a room
3. Copy the room code
4. Open a **new tab** and navigate to the same URL
5. Enter a **different name** and join using the same room code
6. Both tabs are now in the same room — add items in one tab and watch them appear in the other

## Deployment

### Deploy to Netlify
1. Push the repository to GitHub
2. Go to [netlify.com](https://netlify.com) and click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Deploy settings: No build command needed, publish directory: root (`/`)
5. Click "Deploy site"

### Deploy to Vercel
1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and click "Add New" → "Project"
3. Import your GitHub repository
4. Framework preset: "Other", no build command
5. Click "Deploy"

### Deploy to GitHub Pages
1. Go to your repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, folder: `/ (root)`
4. Save — your site will be live at `https://<username>.github.io/<repo>/`

## Design

CartShare uses a custom design system with:
- **Color palette**: Indigo (#4361EE) for trust, Pink (#F72585) for energetic CTAs, Gold (#F9C74F) for highlights — a distinctive alternative to typical green/orange shopping apps
- **Typography**: Space Grotesk (headings) + Inter (body) + JetBrains Mono (codes/prices)
- **Signature element**: Animated room code badge that pulses with activity, making collaboration visible at a glance

## Submission

This project was built as part of an internship program. Submission format: `BatchID_FullName_CartShare`

## License

MIT
