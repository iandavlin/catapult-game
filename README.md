# Catapult Game

Two-player local multiplayer physics game. Tanks climb walls and ceilings, fire projectiles to break opponent blocks and destroy tanks.

## Quick Start

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build & Deploy

```bash
npm run build
```

Outputs static files to `dist/` — upload to any static host.

### Deploy to Nginx (e.g. your EC2)

```bash
npm run build
scp -r dist/* user@server:/var/www/catapult/
```

Nginx config:
```nginx
location /catapult {
    root /var/www;
    try_files $uri /catapult/index.html;
}
```

### Deploy to Vercel/Netlify
Push to GitHub, connect repo, auto-deploys.

## Controls

- **← →** Move tank along perimeter
- **Mouse** Aim (180° relative to surface)
- **Scroll** Adjust power
- **< >** Adjust spin
- **Click** Lock aim / Fire
- **Space** Rematch (game over screen)

## Gameplay

- Projectiles bounce off YOUR blocks, break OPPONENT blocks
- Points double per consecutive hit: 1→2→4→8→16...
- Grey blocks take multiple hits
- Powerups spawn a second ball at impact
- Tank kills award bonus points
- New blocks drop in between rounds
