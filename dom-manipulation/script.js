// Retrieve quotes from local storage or set default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// ✅ ALX expects this name for Task 0
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
}

// Keep alias for backwards compatibility
const displayRandomQuote = showRandomQuote;

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add a new quote
function addQuote(text, category) {
  if (!text || !category) return;
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 3).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Post new quote to mock server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Sync quotes between local storage and mock server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  quotes = [...serverQuotes, ...quotes.filter(q => !serverQuotes.find(sq => sq.text === q.text))];
  saveQuotes();
  showRandomQuote();
  populateCategories();
  alert("Quotes synced with server!");
}

// Periodically sync every 10 seconds
setInterval(syncQuotes, 10000);

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      }
    } catch (error) {
      alert("Invalid file format!");
    }
  };
  reader.readAsText(file);
}

// Populate categories dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  if (!categorySelect) return;

  const categories = ["All", ...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuotes();
  }
}

// Filter quotes by category
function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  const selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory);
  }

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
  } else {
    quoteDisplay.textContent = "No quotes found for this category.";
  }
}

// ✅ Event listeners for buttons
document.getElementById("showQuoteBtn")?.addEventListener("click", showRandomQuote);
document.getElementById("syncBtn")?.addEventListener("click", syncQuotes);
document.getElementById("exportBtn")?.addEventListener("click", exportToJsonFile);
document.getElementById("importFile")?.addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter")?.addEventListener("change", filterQuotes);

// Initial setup
window.onload = function () {
  populateCategories();
  showRandomQuote();
};