# Ciclo 1 · Tela Hoje · prompts para `to-img`

Direção aprovada: mistura (wireframe `mocks/1-wire-mix.txt`).
Formato: celular em pé, `aspect-ratio=9:16`, `model=gpt2`, `resolution=1K`.

## Base comum (vai no começo de todos os prompts)

High-fidelity mobile UI mockup of a real, usable fitness app called GymFlow
(diet, workout and progress tracking, Brazilian Portuguese UI). Screen: "Hoje"
(today dashboard), portrait phone, full screen, no device frame. Dark theme,
deep black background with a soft animated-looking aurora glow in emerald
green and violet, frosted-glass cards with subtle rim light, custom soft 3D
icons (no generic line icons), brand accent emerald green #00d084 with neon
glow. Premium, modern, energetic, designed to stand out on social media.
All text in Brazilian Portuguese, crisp and legible.

Layout, top to bottom:
1. Header: small avatar, "Terça · 19 out", "Oi, Lucas", streak flame badge "12".
2. Hero: label "TREINO DE HOJE", huge condensed bold headline "DIA DE / PEITO.",
   a 3D anatomical body with chest and triceps glowing neon green, meta line
   "7 exercícios · 22 séries · 41 min", big pill button "▶ BORA TREINAR".
3. Bento grid: large widget with three concentric activity rings (calorias,
   água, treino) and "1.640 kcal restantes"; tall widget with a glass of water
   showing a wavy liquid at "1,2 L" and a "+250" button; small widget "🔥 12 dias";
   wide widget "Macros" with three vertical tubes filling (C 120g, P 98g, G 41g).
4. "REFEIÇÕES" horizontal carousel with food photo cards: "Café da manhã 420 kcal",
   "Almoço 0 / 686 kcal", each with a round "+" button, next card peeking.
5. Weight card: "82,0 kg", small sparkline, "meta 76 kg".
6. Bottom nav: Hoje (active), Dieta, raised glowing center "+" button, Treino, Evolução.

## Variantes

- filename=mocks/1-a.png
  prompt="<base> Variant: emerald green dominant, violet only in the aurora, very clean and Apple-like spacing."
  aspect-ratio=9:16

- filename=mocks/1-b.png
  prompt="<base> Variant: more aggressive sports-brand feel, Nike-like condensed typography, stronger neon glow, lime green highlights on the body map."
  aspect-ratio=9:16

- filename=mocks/1-c.png
  prompt="<base> Variant: softer and more playful, rounder bento widgets, pastel glass reflections, celebratory confetti bursting from the completed rings."
  aspect-ratio=9:16
