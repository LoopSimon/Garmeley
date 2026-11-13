# grid.css documentation

Reference for `.obsidian/snippets/grid.css`, the CSS snippet behind the layout blocks (grids, columns, infoboxes, timelines, battle boxes) used in the Garmeley vault.

This file lives in `.docs/` on purpose. Obsidian ignores folders that start with a dot, so these notes never appear in the vault and cannot be selected in Obsidian Publish.

## 1. File overview

`grid.css` has two parts:

1. **Lines 1 to about 200: the base theme.** This is "Minimal Publish" by Steph Ango (MIT) with Rosé Pine colours, followed by a minified block of Minimal's helper classes. It is third-party code. Avoid editing it. It styles headings, tables, cards, image grids and colours for the whole site.
2. **From the comment `1. MAIN GRID SYSTEM` onward: Garmeley's own layout classes.** This is the part documented below. It is plain, hand-written CSS.

All the custom classes are used by writing raw HTML inside a note, for example `<div class="grid-2x2">...</div>`.

### Where the CSS is actually loaded from

| File | Used by | Contains grid classes? |
| --- | --- | --- |
| `.obsidian/snippets/grid.css` | Obsidian desktop, only if the snippet is enabled in Settings, Appearance, CSS snippets | Yes, including sections 1 to 7 |
| `publish.css` (vault root) | Obsidian Publish | Yes, sections 1 to 7 plus the responsive block |

Obsidian Publish never reads `.obsidian/snippets/`. If you change `grid.css` and want the change on the published site, the same change has to be made in `publish.css`. Keep the custom part of the two files identical. Everything from `1. MAIN GRID SYSTEM` onward should match in both.

## 2. Colour variables used

The custom classes only use variables from the theme block, so they follow light and dark mode automatically:

| Variable | Meaning here |
| --- | --- |
| `--bg1` | Card and infobox background |
| `--bg2` | Slightly different background, used for the battle box headers |
| `--tx3` | Faint text colour, reused for every border and divider line |
| `--text-normal` | Normal text colour |
| `--color-orange` | Timeline date colour (fallback `#d4af37`) |

## 3. Section 1: Main grid system

A two column card grid. Put `grid-item` blocks inside a `grid-2x2` block.

| Class | What it does |
| --- | --- |
| `.grid-2x2` | The container. Two equal columns (`1fr 1fr`), `1rem` gap, rows at least `100px` high. Uses `!important` so it wins over Obsidian's own display rules. |
| `.grid-item` | A card: background `--bg1`, 1px `--tx3` border, 8px rounded corners, `1rem` padding, full height of its row. Content is **vertically centred**. |
| `.grid-item-uncentered` | Same card, but content starts at the **top**. Use it for long text next to a short card. |
| `.span-col-2` | Makes an item span both columns. Content is centred. |
| `.span-col-2-single-block` | Spans both columns, content starts at the top and stretches, `1.5rem` padding, height follows the content. For one big text block. |
| `.span-row-2` | Makes an item span two rows (tall card next to two short ones). |

Example:

```html
<div class="grid-2x2">
  <div class="grid-item">
    <h3>Climate</h3>
    <p>Cold winters, short summers.</p>
  </div>
  <div class="grid-item-uncentered span-row-2">
    <h3>History</h3>
    <p>Long text here...</p>
  </div>
  <div class="grid-item">
    <h3>Capital</h3>
    <p>Aerthos</p>
  </div>
  <div class="grid-item span-col-2">
    <p>A full width card across both columns.</p>
  </div>
</div>
```

Notes:

- Combine `grid-item` (or `grid-item-uncentered`) with a span class on the same element, as in the example.
- Markdown inside HTML blocks only renders if there is a blank line after the opening tag. If bold or links show up as raw text, add blank lines around the content.

## 4. Section 2: Dual column layout (inner content)

Two columns of text inside a card with a vertical divider between them.

| Class | What it does |
| --- | --- |
| `.dual-column-grid` | Container with two equal columns (`minmax(0, 1fr)` so long words cannot stretch a column), `1rem` gap, full width. |
| `.dual-column-grid::after` | Draws the divider: a 1px `--tx3` line positioned at 50% width, top to bottom. |
| `.dual-column-grid > div:first-child` | Left column, gets right padding and margin. |
| `.dual-column-grid > div:last-child` | Right column, gets left padding. |
| `.v-center` | Helper: a full-height flex column with centred content. Put it on a column div to centre that column vertically. |

Also in this section:

- The first `h3` or `h4` inside a `.dual-column-grid` or `.grid-item` has its top margin and padding removed, so headings line up with the top of the card.
- `p`, `h2` and `h3` inside the dual columns have `break-inside: avoid` so printing or PDF export does not split them across pages.

Example:

```html
<div class="grid-item">
  <div class="dual-column-grid">
    <div>

### Allies
Text for the left side.

    </div>
    <div class="v-center">

### Enemies
Text for the right side.

    </div>
  </div>
</div>
```

Notes:

- The column rules target **direct child `div`s**, so each column must be a `div` that is a direct child of `.dual-column-grid`. Exactly two columns are expected.
- On narrow screens the columns stack and the divider becomes a horizontal line under the first column (see Responsive).

## 5. Section 3: Wiki infobox and images

A Wikipedia style box that floats to the right of the page text.

| Class | What it does |
| --- | --- |
| `.wiki-infobox` | The box. Floats right, 300px wide, `--bg1` background, 1px border, 6px corners, slightly smaller text (`0.9em`), soft shadow. Sits left of the following text with a `1.5rem` margin. |
| `.wiki-infobox h4` | Centred title inside the box, no top margin. |
| `.wiki-header` | Alternative title (any element): centred, bold, with a line underneath. |
| `.wiki-row` | One label and value row. Flex layout: label on the left, value on the right, `1rem` gap. |
| `.wiki-row strong` | The label. Never wraps and never shrinks. |
| `.wiki-row span`, `.wiki-row a` | The value. Takes the remaining space, right aligned, long words wrap. |
| `.wiki-hr` | A thin divider line inside the box (use on an `<hr class="wiki-hr">`). Half transparent. |
| `.wiki-image` | An image that fills the width of its container, rounded corners, no extra margin. |
| `.grid-item img` | Any image inside a grid card gets the same treatment as `.wiki-image`. |

Example:

```html
<div class="wiki-infobox">
  <h4>Kingdom of Aerthos</h4>
  <img class="wiki-image" src="Aerthos flag.png">
  <hr class="wiki-hr">
  <div class="wiki-row"><strong>Capital</strong><span>Aerthos</span></div>
  <div class="wiki-row"><strong>Ruler</strong><a href="#">King Aldric</a></div>
</div>

The article text starts here and wraps around the box.
```

Notes:

- Place the infobox **before** the paragraph it should sit next to. A float only affects content that comes after it.
- Values must be a `span` or an `a` that is a direct child of `.wiki-row`. Plain text without a tag is not right aligned.
- `clear: right` means two infoboxes stack vertically rather than sitting side by side.
- The box width is a fixed 300px. On screens under 900px it becomes full width and stops floating.

## 6. Section 4: General content and lists

Only applies to lists inside elements with the class `.grid-item`. Cards that use only `.grid-item-uncentered` do not get these list rules.

| Rule | What it does |
| --- | --- |
| `.grid-item ul:not(.timeline-list)` | Pulls bullet lists left by `1rem` and removes left padding so bullets line up with the text. |
| `.grid-item li` | `0.25rem` space between items, normal text colour. |
| `.grid-item li::marker` | Bullets in the faint `--tx3` colour. |

## 7. Section 5: Timeline

A date and event list built from `div`s instead of `ul`/`li`, because Obsidian rewrites real lists unpredictably.

| Class | What it does |
| --- | --- |
| `.timeline-list` | The container. A vertical flex column, `0.5rem` between rows. |
| `.timeline-item` | One row. A two column grid: 80px for the date, the rest for the text, `1rem` gap, aligned on the text baseline. |
| `.timeline-item::before` | Draws the date from the row's `data-date` attribute: right aligned, bold, orange, never wrapping. |

Example:

```html
<div class="timeline-list">
  <div class="timeline-item" data-date="1021">The founding of Aerthos.</div>
  <div class="timeline-item" data-date="1088">The first great war begins.</div>
</div>
```

Notes:

- The date comes from `data-date`, so it is **not** selectable text and is not searchable on the published site.
- Dates wider than about 80px (for example "1021 AE" in bold) overflow into the gap. If you need longer dates, raise the `80px` in `.timeline-item`.
- Do not use `<ul class="timeline-list">`. The class is excluded from the list rule in section 4 so it could in theory work, but the layout was designed for `div`s.

## 8. Section 6: Remove header underlines

Obsidian and Minimal draw a line under `h1` and `h2`. These rules remove it everywhere (`border-bottom: none !important` on `h1`, `h2` and their `.markdown-rendered` and `.markdown-preview-view` variants).

Gotcha: this rule used to be missing its closing `}` in `grid.css`, which swallowed the Battlebox and mobile rules. If that section ever stops working, check that every rule is closed.

## 9. Section 7: Battlebox

A Wikipedia style "infobox" for battles, with a header row and two sides. Present in both `grid.css` and `publish.css`.

| Class | What it does |
| --- | --- |
| `.battle-grid` | Container. Two equal columns, full width, a line on top. |
| `.battle-header` | A full width header row (`grid-column: 1 / -1`), `--bg2` background, bold, centred. Use for "Belligerents", "Commanders", "Strength" and so on. |
| `.battle-col-left` | Left cell: right border as the divider, `8px` padding, small text. |
| `.battle-col-right` | Right cell: `8px` padding, small text. |
| `.battle-col-left ul`, `.battle-col-right ul` | Lists inside the cells lose their bullets, margin and padding. |

Example:

```html
<div class="battle-grid">
  <div class="battle-header">Belligerents</div>
  <div class="battle-col-left">Kingdom of Aerthos</div>
  <div class="battle-col-right">Jeturlund Clans</div>
  <div class="battle-header">Commanders</div>
  <div class="battle-col-left">King Aldric</div>
  <div class="battle-col-right">Jarl Sigurd</div>
</div>
```

Each header row is followed by pairs of left and right cells. Cells fill the grid left to right, so always add them in pairs.

## 10. Responsive rules (under 900px wide)

Section 8 in `publish.css`. One `@media (max-width: 900px)` block at the end of the file:

- `.grid-2x2` becomes a single column with a smaller gap.
- `.grid-item` loses its fixed height and gets `0.5rem` padding.
- `.dual-column-grid` becomes one column. The first column gets a bottom line instead of the right divider.
- `.span-col-2` and `.span-row-2` stop spanning (`auto`), so they take one cell.
- `.wiki-infobox` stops floating and takes the full width.

Not covered: `.battle-grid` stays two columns on mobile, which is normally fine for short cells.

## 11. Known problems and gotchas

1. **Unclosed rules break everything after them.** A missing `}` makes browsers with CSS nesting treat all later rules as nested inside it (this happened in section 6 and is fixed). Check with a CSS validator after editing.
2. **Keep `grid.css` and `publish.css` in sync.** Obsidian Publish only reads `publish.css`.
3. **Wide `!important` use.** `.grid-2x2`, `.dual-column-grid` and `.span-col-2*` set `display` with `!important`. A later rule cannot override them without `!important` too.
4. **Markdown in HTML.** Obsidian only renders Markdown inside an HTML block when blank lines surround it. Raw HTML works without blank lines but then lists and bold are shown literally.
5. **Fixed values.** Infobox width (300px), timeline date column (80px) and the breakpoint (900px) are hard-coded. Change them in one place each.
6. **The base theme block is a copy.** It is a vendored copy of Minimal Publish. It also contains a mismatch inherited from upstream: `--img-grid-fit` is defined but the rules read `--image-grid-fit`. Image grid variables therefore do nothing. This does not affect the custom layout classes.
