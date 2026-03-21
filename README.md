# String Utils

A static single-page text manipulation tool. Open `index.html` directly in Chrome or Edge — no server needed.

## How to use

1. Paste text into the large textarea
2. Click a function in the sidebar
3. Fill in any parameters and press `Enter` (or click **RUN**, or press `Cmd+Enter`)

The output replaces the textarea content. The function list is sorted alphabetically; new functions added in the future will appear in order automatically.

---

## Functions

### Append Before/After
Adds text to the start or end of every line.
- **Position** — `After line` or `Before line`
- **Text** — the string to add (supports escape sequences)

### Change Case
Changes the case of all text.
- **Case** — `Upper` or `Lower`

### De-dupe
Removes duplicate lines, keeping the first occurrence of each unique line. No parameters.

### Delete Before/After
Deletes everything before or after the first occurrence of a search string on each line. Lines that don't contain the string are left unchanged.
- **Delete** — `Before text` or `After text`
- **Search text** — the marker string
- **Delete search text** — if checked, the marker string itself is also removed; otherwise it is kept

### Delete Lines With/Without
Filters lines based on whether they contain a search string.
- **Delete lines** — `With text` (removes matching lines) or `Without text` (keeps only matching lines)
- **Search text** — the string to match

### Format JSON
Reformats JSON with 2-space indentation. Uses a character-walk approach (no `JSON.parse`) so it degrades gracefully on invalid JSON rather than erroring. No parameters.

### Normalize Columns
Pads each column so they align vertically, using a configurable delimiter.
- **Delimiter** — the character that separates columns (e.g. `|` or `,`)

### Replace
Replaces all occurrences of a string with another string across the entire text.
- **Find** — the string to search for (supports escape sequences)
- **Replace with** — the replacement string (supports escape sequences)

### Replace from Clipboard
Replaces a search string on each line with the corresponding line from the clipboard. Line N in the textarea gets line N from the clipboard as its replacement.
- **Search text** — the text on each line to replace

> **Browser note:** Requires Chrome or Edge. Firefox blocks clipboard reads from `file://` pages. If Chrome prompts for permission on every use, serve the page from `localhost` instead (`python3 -m http.server 8080`) and Chrome will remember the permission permanently.

### Repeat
Repeats the entire text N times, joined by newlines.
- **Count** — number of repetitions

### Sort
Sorts lines alphabetically.
- **Direction** — `Ascending` or `Descending`
- **Case sensitive** — if unchecked, sort ignores case

### Trim
Removes whitespace from each line.
- **Direction** — `Both`, `Before (left)`, or `After (right)`

---

## Escape sequences

The **Append Before/After** and **Replace** functions support escape sequences in their text inputs:

| Sequence | Meaning |
|----------|---------|
| `\n` | Newline |
| `\t` | Tab |
| `\\` | Literal backslash |

---

## Status bar

The bar at the bottom shows:

- **Ln N** — current line number (1-based)
- **N lines** — total line count
- **U+XXXX (N)** — Unicode code point of the character at the cursor
- **N selected** — number of selected characters (replaces the code point when text is selected)

---

## Keyboard shortcuts

- `Enter` — runs the current function when focus is in the parameter panel
- `Cmd+Enter` / `Ctrl+Enter` — runs the current function from anywhere on the page
