# mathly

clean step-by-step math. photo, text, or draw.

### preview
- **vercel**: `https://mathy-sigma.vercel.app/`

### what it does
- **solve mode**: drop a photo, use camera, type a problem, or draw it → get clean step cards
- **stepspeak**: every step has **why / move / check** toggles so it teaches without essays
- **practice mode**: drill/timed/exam sheets generated from what you just solved (with “explain this one” jump)
- **exam rescue**: a quick-access drawer with saveable cards when you need speed
- **history**: sessions save automatically + you can restore past solves
- **ocr + math rendering**: ocr text is shown, math renders with katex

### the vibe / ui
- matte dark theme + one accent violet
- minimal motion (fast fades + staggers), mobile friendly
- glassy floating nav, clean inputs, clean cards

### run it locally
```bash
npm install
npm run dev
```

### env
create `.env.local`:
```bash
MATHGO_API_KEY=your_key_here
NEXT_PUBLIC_USE_MOCK=false
```

### stack
- next.js (app router) + typescript
- tailwind css
- framer motion
- katex (remark-math + rehype-katex)
