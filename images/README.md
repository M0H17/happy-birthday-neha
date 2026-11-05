# Photos & decorations for Neha’s birthday site

## Birthday decorations (already included)
- `cake.jpg` — birthday cake
- `ribbon.jpg` — ribbon banner
- `party-decor.jpg` — gift / party accent
- `bubu-try-again.jpg` — wrong passcode flash
- `cake-knife.jpg` — cake cutting knife
- `cake-slice.jpg` — cake piece for Neha

## Bubu / Dudu corner GIFs (animated stickers on every page)
- `bubu-corner.gif`, `bubu-peek.gif`, `bubu-wave.gif`
- `dudu-corner.gif`, `dudu-cute.gif`, `dudu-wave.gif`, `dudu-love.gif`
- `bubu-dudu-love.gif`, `bubu-dudu-hug.gif`

Swap or reorder them in `config.js` → `cornerStickers`.

## Add your personal photos
| File | Used for |
|------|----------|
| `hero.jpg` | Neha’s photo after Open me → cake → this image |
| `finale.jpg` | Finale photo (falls back to cake if missing) |
| `moment-1.jpg` … `moment-6.jpg` | Swipe cards on Moments |

Edit About text in `config.js` → `about: { ... }`

**Open me sequence:** gift box → cake → (2 seconds later) `hero.jpg` via scramble-tile loader

Her name is set in `config.js` as `name: "Neha"`.

**Passcode gate:** change `passcode` in `config.js` (default `143`). Other pages stay locked until Home is unlocked in that browser tab.
