# 🧠 Advanced DOM JavaScript Assignment

This repository contains two advanced DOM manipulation projects built with **HTML**, **CSS**, and **Vanilla JavaScript**.  
Both projects demonstrate real-time interactivity, data persistence using `localStorage`, and event delegation.

[![View Live](https://img.shields.io/badge/View-Live-blue?style=for-the-badge&logo=github)](https://devdrop-gc.github.io/advanced-dom-javascript-assignment/)

---

## 📁 Project Structure
```
advanced-dom-javascript-assignment/
├── contact-form/
│ ├── index.html
│ ├── style.css
│ └── script.js
└── todo-app/
├── index.html
├── style.css
└── script.js
```

---

## 📨 Project 1: Smart Contact Form

A web form implementation featuring performance-optimized validation and persistent message history.

### 🎯 Features Implemented
* ✅ **Real-time Validation:** Error messages appear as the user types.
* ✅ **Debounced Validation (300ms):** Performance optimization ensures full validation (and button state update) only after the user pauses typing.
* ✅ **Form Submission:** Prevents page reload (`e.preventDefault()`) and shows a success message.
* ✅ **Message History:** Displays all submitted messages below the form.
* ✅ **Persistence:** Messages survive browser refresh using `localStorage`.
* ✅ **Delete Functionality:** Individual messages can be removed using **Event Delegation**.
* ✅ **Empty State:** Shows "No messages yet" when the history is clear.

### ⚙️ Technical Implementation

* All interactions use `addEventListener`.
* Custom `debounce` utility implemented.
* Validation logic controls the `submit` button's disabled state.

### 🧩 Technologies
- HTML5
- CSS3
- JavaScript (ES6)

### 🖥️ How to Run
1. Navigate to `contact-form/`
2. Open `index.html` in your browser

---

## ✅ Project 2: Dynamic Todo List with Search

A robust todo application featuring dynamic filtering and a performance-optimized search function.

### 🎯 Features Implemented
* ✅ **Todo Management:** Add, toggle completion, and delete individual todos.
* ✅ **Persistence:** Todos are stored and retrieved using `localStorage`.
* ✅ **Todo Counter:** Displays total and completed task counts.
* ✅ **Debounced Search (400ms):** Search results update live only after the user pauses typing, optimizing performance.
* ✅ **Filter Options:** Users can filter between "All," "Active," and "Completed" todos.
* ✅ **Efficient Interactions:** All list interactions (toggle, delete) use **Event Delegation** on the main `<ul>` container.
* ✅ **No Results State:** Custom message shown when no todos match the current search or filter.

### Data Structure

Each Todo object is stored with a unique ID and timestamp:

```javascript
{
  id: 1642123456789, // Unique timestamp ID
  text: "Learn JavaScript DOM",
  completed: false,
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### 🧩 Technologies
- HTML5
- CSS3
- JavaScript (ES6)

### 🖥️ How to Run
1. Navigate to `todo-app/`
2. Open `index.html` in your browser

---

## ⚙️ Technical Highlights
- **Debouncing:** Implemented using custom debounce utility
- **localStorage:** Used for data persistence
- **Event Delegation:** Efficient handling of dynamic elements
- **Validation:** Real-time user feedback with non-blocking UI
- **Clean UI:** Minimalist CSS design

---

## 📚 Learning Outcomes
- Mastery of **DOM manipulation** and **event handling**
- Understanding of **debounce functions** and **UX optimization**
- Practical use of **localStorage API**
- Handling **edge cases** in UI applications

---

## 👨‍💻 Author
**GC**

---

## 📄 License
This project is licensed under the **MIT License** — you are free to use and modify it.

