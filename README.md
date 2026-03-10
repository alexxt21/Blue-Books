# The Blue Books — Research Publishing Site

A clean, mobile-optimized research paper publishing site built with React.

## 🚀 Deploy to Netlify (your existing workflow)

1. Push this folder to a GitHub repo
2. Connect the repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy!

## ➕ Adding a New Paper

Open `src/papers.json` and add a new entry to the array:

```json
{
  "id": 7,
  "title": "Your Paper Title Here",
  "authors": ["Dr. First Last", "Prof. Another Author"],
  "date": "2025-03-01",
  "category": "Your Field",
  "abstract": "Your abstract text goes here...",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "pdfUrl": "https://your-link-to-pdf.com/paper.pdf",
  "pages": 24
}
```

Then commit and push — Netlify will auto-deploy in ~30 seconds.

## 📁 Project Structure

```
blue-books/
├── public/
│   └── index.html
├── src/
│   ├── App.js         ← Main UI (edit styles here)
│   ├── index.js       ← React entry point
│   └── papers.json    ← ⭐ Add/edit papers here
├── package.json
└── README.md
```

## 🎨 Customizing

- **Colors/fonts**: Edit the `s` object at the bottom of `src/App.js`
- **Site name**: Search for "The Blue Books" in `App.js` and `public/index.html`
- **Categories**: Auto-generated from paper data — just add new categories in `papers.json`
