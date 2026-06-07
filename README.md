# Rohit Anand — Personal Portfolio Website

A **modern, premium, fully functional personal portfolio** built for Rohit Anand — B.Tech CS Student & Full Stack Developer. Features a dark futuristic aesthetic with neon blue/purple gradients, glassmorphism, particle animations, **real email delivery via EmailJS**, and **one-click CV download**.

---

## ✅ Completed Features

### 🔧 Fully Functional Features (New)
| Feature | Status | How It Works |
|---------|--------|-------------|
| **Real Email Delivery** | ✅ Ready (needs EmailJS keys) | EmailJS SDK — sends email directly to Rohit's inbox |
| **DB Backup** | ✅ Always active | Every message also saved to `contact_messages` table |
| **CV Download** | ✅ Ready (needs PDF file) | Smart fetch-check — auto-validates file exists before download |
| **Setup Guide Banner** | ✅ Active | Dismissible top banner with "View Setup Guide" link |
| **Setup Modal** | ✅ Active | In-app step-by-step guide to activate EmailJS + CV |
| **CV Missing Toast** | ✅ Active | Beautiful toast notification if CV not yet uploaded |
| **Form Error States** | ✅ Active | Separate success/error message boxes with context |

### Design & Sections
- Hero (particles, typing animation, glow effects)
- About Me (stats counters, spinning rings avatar)
- Skills (6 cards with animated progress bars)
- Projects (6 cards, 3D tilt, category filter)
- Learning Journey (timeline, 6 milestones)
- Contact (live form + social links)
- Footer + Back to Top

---

## 🚀 Quick Activation Guide (2 Steps)

### Step 1 — Real Email via EmailJS (FREE)

1. Go to **[emailjs.com](https://www.emailjs.com)** → Create free account
2. **Email Services** → Add New Service → Connect Gmail/Outlook
3. **Email Templates** → Create New Template with these variables:
   ```
   {{from_name}}   — sender's name
   {{from_email}}  — sender's email (set as Reply-To)
   {{subject}}     — message subject
   {{message}}     — message body
   {{to_name}}     — will be "Rohit Anand"
   ```
4. **Account → API Keys** → Copy your Public Key
5. Open **`js/config.js`** and paste your 3 values:
   ```js
   const EMAILJS_PUBLIC_KEY  = 'abc123XYZ';         // Your Public Key
   const EMAILJS_SERVICE_ID  = 'service_xxxxxx';    // Your Service ID
   const EMAILJS_TEMPLATE_ID = 'template_xxxxxx';   // Your Template ID
   ```

### Step 2 — CV Download

1. Name your CV file: **`Rohit_Anand_CV.pdf`**
2. Upload it to the **root folder** (same level as `index.html`)
3. Done! The Download CV button will work automatically.

> 💡 The in-app **Setup Guide** button (top banner) walks you through this visually too.

---

## 📁 File Structure

```
index.html                 ← Main HTML (all sections + modal/banner)
css/
  style.css                ← All styles (glassmorphism, animations, modal, responsive)
js/
  config.js                ← ⭐ EDIT THIS — EmailJS keys + CV filename
  main.js                  ← All JavaScript (20 modules)
Rohit_Anand_CV.pdf         ← Add your CV here (not yet uploaded)
README.md                  ← This file
```

---

## 🌐 Entry Points

| Path | Description |
|------|-------------|
| `/index.html` | Full portfolio |
| `#hero` | Hero section |
| `#about` | About Me + CV download |
| `#skills` | Skills |
| `#projects` | Projects |
| `#experience` | Learning Journey |
| `#contact` | Contact Form |

---

## 💾 Data Model

### `contact_messages` Table (auto-backup for every form submission)
| Field | Type | Description |
|-------|------|-------------|
| id | text | Auto UUID |
| name | text | Sender name |
| email | text | Sender email |
| subject | text | Subject line |
| message | rich_text | Full message |
| sent_at | datetime | ISO timestamp |

**API:** `POST tables/contact_messages`

---

## 🎨 How to Customize

| What | Where |
|------|-------|
| EmailJS credentials | `js/config.js` |
| CV filename | `js/config.js` → `CV_FILE_NAME` |
| Personal info, about text | `index.html` — `#about` section |
| Profile photo | Replace `.about-img-placeholder` with `<img>` |
| Project links | Replace `href="#"` in `#projects` |
| Social links | Search `rohitanand` → replace with real handles |
| Email address | Search `rohit.anand@example.com` → replace |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| HTML | HTML5 semantic |
| CSS | CSS3, Custom Properties, Glassmorphism, Grid/Flex |
| JS | Vanilla ES6+ (20 modules, zero frameworks) |
| Email | EmailJS (free, CORS-enabled) |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Inter + JetBrains Mono |
| Particles | HTML5 Canvas API |
| Scroll | IntersectionObserver API |
| Data | REST Table API (contact backup) |

---

*Built with ❤️ for Rohit Anand — B.Tech CSE & Full Stack Developer*
