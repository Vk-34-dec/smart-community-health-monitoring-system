# SIH Dashboard — Style Guide

This style guide documents the visual tokens, typography, spacing, and component rules used in the Smart Community dashboard.

## Color palette

- Primary gradient: `linear-gradient(90deg,#2563eb,#6fb1ff)`
- Accent: `#2563eb` (blue)
- Secondary accent: `#7c3aed` (purple)
- Background (page): `#f5f9ff` / `#eef6ff` (soft blue)
- Card background: `#ffffff`
- Muted text: `#6b7280`
- Success: `#16a34a`
- Danger background accent: `#fff0f0` / `#ffecec`

## Typography

- Font family: `Poppins, system-ui, -apple-system, 'Segoe UI', Roboto`.
- Heading 1: 40px, 700
- Heading 3 / panel titles: 18-20px, 600
- Body text: 14px, 400
- Small / caption: 12px

## Spacing scale

- xs: 6px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

## Radius / shadows

- Card radius: 12-18px
- Big radius (hero image / mockups): 18-22px
- Shadows: soft large shadows for hero and cards: `0 14px 40px rgba(16,24,40,0.08)`

## Components

- Sidebar: dark blue background (`--sidebar`), white icon tiles, active row highlighted with faint white gradient.
- Cards: white background, bold value, muted label above, subtle drop shadow.
- Panels: padding 16-20px, rounded corners, small section titles.

## Usage

Use the CSS variables in `css/styles.css` and `react-app/src/app.css`. Update `:root` tokens to change global theme colors and spacing.

## Exports available
- `assets/icons.svg` — SVG sprite used for sidebar icons.
- `assets/exported/` — (created) contains optimized SVG copies and placeholders.
