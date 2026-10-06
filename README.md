# 4급 1권 Study Guide

Grammar explanations, vocabulary usage notes and example sentences for the 10 chapters of the 4급 (book 1) Korean textbook. The explanations are available in English, 日本語, 中文 (简体) and Türkçe.

## Files

- `index.html` – the page
- `app.js` – page logic (chapters, search, language switch, hide-translation quiz mode)
- `guide-en.js`, `guide-ja.js`, `guide-zh.js`, `guide-tr.js` – the content, one file per language

It's a plain static site with no build step. Opening `index.html` directly in a browser also works.

## Publishing on GitHub Pages

1. Create a new public repository on GitHub, for example `korean-4geup-guide`.
2. Upload all the files to the repository root (there are no subfolders, so this also works from a phone with **Add file → Upload files**).
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, then select `main` and `/ (root)`, and save.
4. After a minute or two the site will be live at `https://<your-username>.github.io/korean-4geup-guide/`.

## Sharing links

- Open in a specific language: add `?lang=ja`, `?lang=zh`, `?lang=tr` or `?lang=en`
- Jump to a chapter: add `#ch3` (chapters 1–10)
- Both: `index.html?lang=tr#ch7`

Without `?lang`, the page uses the visitor's last choice, otherwise their browser language, otherwise English.
