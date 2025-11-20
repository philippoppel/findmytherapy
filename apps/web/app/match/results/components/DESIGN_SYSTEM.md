# Design System - FindMyTherapy Matching

## Farben
- **Primary**: Amber (amber-500 to orange-600)
- **Background**: Gradient from amber-50/30 → white → stone-50/20
- **Cards**: White mit rounded-3xl und shadow-xl
- **Borders**: border-2 statt border
- **Hover**: border-amber-300, scale-[1.01]
- **Active**: border-amber-500, shadow-md, scale-[1.02]

## Spacing
- Container padding: p-6 sm:p-8 lg:p-10
- Section margins: mb-6 sm:mb-8
- Element gaps: gap-3
- Grid gaps: gap-3

## Typography
- Headers: text-xl sm:text-2xl, font-bold
- Labels: text-sm, font-semibold, text-gray-900
- Body: text-sm sm:text-base, text-gray-600
- Optional tags: text-gray-400, font-normal

## Components

### Buttons
- Primary: `bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02]`
- Secondary: `border-2 border-gray-200 bg-white hover:border-amber-300`
- Pills: `rounded-xl px-4 py-2.5`

### Cards
- Base: `bg-white rounded-3xl shadow-xl border border-gray-100`
- Selectable: `rounded-xl border-2 p-4`
  - Inactive: `border-gray-200 bg-white`
  - Active: `border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md`

### Icons
- Emoji mit background: `w-10 h-10 rounded-lg bg-gray-50`
- Bei selected: `bg-white shadow-sm`

### Progress
- Active step: `ring-4 ring-amber-100 scale-110`
- Completed: `bg-gradient-to-br from-amber-500 to-orange-500`
- Progress bar: `bg-gradient-to-r from-amber-500 to-orange-500`

### Inputs
- Text: `px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500`
- Select: same
- Range: `accent-amber-500`

## Emojis
Alle Labels sollten passende Emojis haben:
- 💭 Gedanken/Therapie
- 📍 Standort
- 📏 Entfernung
- 🌐 Sprachen
- 💰 Kosten
- ⏰ Zeit
- 🧠 Methoden
- 👤 Person
- 💶 Preis
- 💬 Kommunikation
- 🔒 Sicherheit
- 🎯 Ergebnis
