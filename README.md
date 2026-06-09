# 🎨 Emoji Studio

A fun, interactive, kid-friendly studio for designing your very own emoji — then
"publishing" it to the (pretend) official Emoji Specifications Body!

Built with [Next.js](https://nextjs.org) + [Tailwind CSS](https://tailwindcss.com).
Everything runs in the browser — no accounts, no backend, no API keys.

## ✨ What you can do

There are **three ways to create** an emoji, all feeding the same canvas:

1. **Draw it** 🖌️ — paint on a chunky 16×16 pixel grid with a bright color
   palette. Tools: Draw, Fill (bucket), Erase, Undo, and Clear. Click-and-drag
   works with mouse *and* touch.
2. **Remix an existing one** 🐱 — load a starter emoji (Smiley, Heart, Star,
   Kitty, Ghost, Rainbow) and change it however you like. Or hit **🎲 Surprise
   me!** for a random recolored starter.
3. **Describe it with words** 💬 — type something like *"a blue happy cat"* or
   *"spooky purple ghost"* and the studio assembles a starting emoji, picks the
   colors, and even names it.

Then **publish** 🚀:

- Fill in a fun, real-ish emoji **proposal form** (name, artist, why it should
  exist).
- Get a celebratory **certificate** with confetti and a playful `U+1F…`
  codepoint.
- **Download** your emoji as a 512×512 transparent **PNG** and a text
  **proposal document**.
- Your creations are saved to a **gallery** (in your browser) where you can
  remix or delete them.

> 🧠 **Real-world tie-in:** the app links to the actual
> [Unicode Consortium emoji proposal process](https://www.unicode.org/emoji/proposals.html)
> so curious kids can learn how real emoji are made — anyone can submit one for free!

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # run the production build
```

## 🗂️ Project structure

```
app/
  page.tsx                 # entry point — renders the studio
  layout.tsx               # metadata + global styles
  globals.css              # kid-friendly theme, animations, confetti
  components/
    EmojiStudio.tsx        # main orchestrator (state, tools, layout)
    PixelCanvas.tsx        # the 16x16 drawing surface (pointer/touch)
    PublishModal.tsx       # proposal form + certificate + downloads
    Gallery.tsx            # published-emoji gallery
    Confetti.tsx           # dependency-free confetti burst
  lib/
    types.ts               # grid model + PublishedEmoji type
    palette.ts             # color palette + color-word mapping
    templates.ts           # pixel-art starter emoji (string art + parser)
    describe.ts            # words -> emoji + colors + name
    export.ts              # grid -> PNG, downloads, codepoints
    storage.ts             # gallery localStorage + proposal text
```

Have fun, and keep drawing! 🌈
