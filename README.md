# Hak-Nim — Professional Invoice Generator

> A fully client-side invoice generator with live preview and PDF export. No backend, no API, no signup. Just open and invoice.

---

## ✨ Features

- **Live Split-Panel Preview** — Every keystroke instantly updates the invoice on the right
- **Logo Upload** — Drag or click to add your business logo
- **Custom Branding** — Pick accent color and text color for a personalized invoice
- **Line Items** — Add, remove, and edit unlimited items with auto-calculated totals
- **Tax & Discount** — Apply percentage-based tax and discount
- **Multiple Currencies** — NGN ₦, USD $, EUR €, GBP £, GHS GH₵, KES KSh
- **PDF Download** — Uses browser print to save a clean, print-ready PDF
- **Zoom Controls** — Scale the preview for comfort
- **Zero Dependencies** — Pure HTML, CSS, Vanilla JS

---

## 🖥️ Live Demo

> **[View Live Demo](#)** ← *(github.com/Follytechnologies)*

---

## 🚀 Getting Started

```bash
git clone https://github.com/Follytechnologies/ledger-invoice-generator.git
cd haknim-invoice-generator
open index.html
```

No install. No server. Works completely offline.

---


## 📁 Project Structure

```
ledger-invoice-generator/
│
├── index.html    ← Layout: editor panel + preview panel
├── style.css     ← All styles including @media print rules
├── app.js        ← All logic: live update, totals, PDF export
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (grid, custom properties, print media query) |
| Logic | Vanilla JavaScript (ES6+) |
| PDF Export | Browser native `window.print()` |
| Fonts | Google Fonts — Libre Baskerville, Outfit, JetBrains Mono |

---

## 📄 How PDF Export Works

The app uses CSS `@media print` rules to:
- Hide the editor panel and toolbar
- Expand the invoice to full A4 dimensions
- Force color printing (`print-color-adjust: exact`)
- Remove box shadows and browser chrome

When you click **Download PDF**, the browser opens its print dialog. Select **"Save as PDF"** as the destination.

---

## 💡 Invoice Fields

| Field | Description |
|---|---|
| Business Name / Email / Phone / Address | Your company details |
| Client Name / Email / Address | Who you're billing |
| Invoice # | Auto-formatted as `#INV-001` |
| Issue & Due Date | Date pickers |
| Line Items | Description, Qty, Rate → auto Amount |
| Tax % | Applied after discount |
| Discount % | Applied to subtotal |
| Notes | Payment instructions, bank details |
| Terms | T&Cs |

---

## 📄 License

MIT — free to use and modify.

---

## 👤 Author

**Abdulhakeem** — Pure Mathematics student & Software Developer  
🖨️ Founder of **Folly Technologies & D'BEST Design & Prints**

- GitHub: [@Abdulhakeem Ahmad Folorunso](https://github.com/Follytechnologies)

---
