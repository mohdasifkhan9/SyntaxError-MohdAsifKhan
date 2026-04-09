# ⚖️ NyayAI — AI Legal Document Simplifier

> Understand legal documents in seconds with AI-powered insights, risk analysis, and interactive explanations.

---

## 🚀 Overview

**NyayAI** is a full-stack AI-powered web application that simplifies complex legal documents into easy-to-understand language. It helps users identify risks, understand clauses, and get actionable advice — all in a clean, interactive dashboard.

---

## 🎯 Problem

Most people sign legal documents without understanding them due to:

* Complex legal language
* Hidden clauses and penalties
* Lack of affordable legal guidance

This often leads to:

* Financial loss
* Unfair agreements
* Legal complications

---

## 💡 Solution

NyayAI transforms legal documents into:

* 📝 Simple summaries
* ⚠️ Risk analysis
* 📊 Safety scores
* 💡 AI-powered advice
* 🔍 Interactive clause highlighting

---

## ✨ Key Features

### 📄 Document Analysis

* Upload **PDF, DOCX, TXT**
* AI-generated summary & key points
* Risk detection with severity levels

---

### 📊 Safety Score System

* Score from **0–100**
* Based on risk severity
* Visual indicator (Safe / Moderate / Risky)

---

### 🔍 Interactive Clause Highlight (WOW Feature 🔥)

* Click a clause → highlight in document
* Smooth scroll to relevant section
* Visual explanation of risks

---

### 💡 AI Advice System

* Practical suggestions
* What to avoid
* What to negotiate

---

### 💬 AI Chat (Multi-language)

* Ask questions about document
* Supports:

  * English
  * Hindi
  * Hinglish
* Context-aware responses

---

### 📁 Dashboard System

* Upload & manage documents
* View history & insights
* Clean, modern UI

---

## 🧠 Tech Stack

### Frontend

* Next.js 14 (App Router)
* Tailwind CSS
* Framer Motion + GSAP

### Backend

* Supabase (Auth, Database, Storage)

### AI

* Google Gemini API

### Document Processing

* pdf-parse (PDF)
* mammoth (DOCX)

---

## 🏗️ Architecture

```
Upload Document
      ↓
Extract Text (PDF/DOCX/TXT)
      ↓
Gemini AI Analysis
      ↓
Store Results (Supabase)
      ↓
Display in Dashboard
```

---

## 📂 Project Structure

```
/app
  /dashboard
  /login
  /signup
  /api
/components
/lib
  supabaseClient.ts
  gemini.ts
  extractText.ts
```

---

## ⚙️ Setup & Installation

```bash
git clone https://github.com/your-username/nyayai.git
cd nyayai
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_api_key
```

---

## 📸 Demo Flow

1. Upload a legal document
2. AI analyzes content
3. View:

   * Summary
   * Safety Score
   * Risky Clauses
4. Click clause → highlight in document
5. Ask AI questions

---

## 🏆 Hackathon Highlights

* Real-world impactful problem
* AI-powered automation
* Interactive UX (not just static output)
* Multi-language support
* Production-ready architecture

---

## 🔮 Future Scope

* 📱 Mobile app
* 🌍 Multi-language expansion
* 👨‍⚖️ Lawyer consultation integration
* 📤 Export/share reports
* 🔐 Secure document storage

---

## 👨‍💻 Author

**Asif Khan**

* 💼 GitHub: https://github.com/your-username
* 🌐 Portfolio: (Add your link)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

> “We didn’t just analyze legal documents — we made them understandable, interactive, and actionable.”
