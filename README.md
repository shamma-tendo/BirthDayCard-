# Birthday Surprise Page

A single-file, no-build interactive birthday card. Tap the seal on the cover screen to open it, then scroll through a letter, a photo strip, a song player, and a cake with candles to blow out.

## Files

 — the whole thing: HTML, CSS, and JS in one file. No dependencies to install, just open it in a browser.

## Customize

1. **Message** — edit the paragraphs inside `<div class="letter-card">`.
2. **Photos** — find the three `<div class="photo-slot">` blocks and replace the commented line with `<img src="YOUR_PHOTO_URL" alt="">`.
3. **Song** — near the top of the `<script>` tag, set `SONG_URL` and `SONG_NAME`.
4. **Candle count** — in the script, change the `22` in `for (let i = 0; i < 22; i++)` to however many you want.

## Deploy

- **Quick and private:** drag the HTML file into [netlify.app/drop](https://app.netlify.com/drop) — instant link, no account, nothing public or indexed.
- **GitHub Pages:** push this repo, then go to Settings → Pages and set the source to your main branch. Note: the free GitHub plan only serves Pages from *public* repos — a private repo needs GitHub Pro.


