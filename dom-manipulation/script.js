// ===== Quotes Array =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// ===== Display Random Quote =====
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>- ${randomQuote.category}</small>`;
  sessionStorage.setItem("lastViewedCategory", randomQuote.category);
}

// ===== Add Quote =====
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ===== Filtering =====
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// ===== Populate Categories =====
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) categoryFilter.value = savedCategory;
}

// ===== Save to Local Storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Server Syncing =====
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Post data to server (mock API)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Sync quotes (fetch + merge + conflict resolution)
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulated server quotes
    const serverQuotes = [
      { text: "Success is not in what you have, but who you are.", category: "Success" },
      { text: "Programming is thinking, not typing.", category: "Programming" }
    ];

    let updated = false;
    const localTexts = quotes.map(q => q.text);

    serverQuotes.forEach(serverQuote => {
      if (!localTexts.includes(serverQuote.text)) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server successfully!");
    }
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Show notification to user
function showNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.backgroundColor = "#fffae6";
  note.style.border = "1px solid #ccc";
  note.style.padding = "10px";
  note.style.margin = "10px 0";
  document.body.prepend(note);

  setTimeout(() => note.remove(), 4000);
}

// Periodically check for updates from server
setInterval(syncQuotes, 10000);

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function() {
  populateCategories();
  displayRandomQuote();

  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", displayRandomQuote);

  syncQuotes(); // Initial sync on page load
});