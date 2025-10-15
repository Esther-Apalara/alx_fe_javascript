// ===== Quotes array =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// ===== Show Random Quote =====
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes yet.";
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

  // Save last viewed quote category in session storage
  sessionStorage.setItem("lastViewedCategory", randomQuote.category);
}

function displayRandomQuote() {
  showRandomQuote();
}

// ===== Add Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = catInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  // Try syncing new quote to the server
  syncQuoteToServer(newQuote);

  textInput.value = "";
  catInput.value = "";
}

// ===== Filter Quotes =====
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

// ===== Web Storage =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== JSON Export =====
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// ===== JSON Import =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Server Sync Simulation =====
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API endpoint

// Fetch quotes from server (simulated)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes
    const serverQuotes = [
      { text: "Success is not in what you have, but who you are.", category: "Success" },
      { text: "Programming is the art of algorithm design and the craft of debugging.", category: "Programming" }
    ];

    handleServerSync(serverQuotes);
  } catch (error) {
    console.error("Failed to fetch from server:", error);
  }
}

// Push a new quote to the server (simulated)
async function syncQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    console.log("Quote synced with server:", quote);
  } catch (error) {
    console.error("Failed to sync quote:", error);
  }
}

// Handle conflict resolution — server always wins
function handleServerSync(serverQuotes) {
  const localTexts = quotes.map(q => q.text);
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    if (!localTexts.includes(serverQuote.text)) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    notifyUser("Quotes updated from server.");
  }
}

// Notify user about updates/conflicts
function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#fffae6";
  note.style.border = "1px solid #ccc";
  note.style.padding = "10px";
  note.style.margin = "10px 0";
  document.body.prepend(note);

  setTimeout(() => note.remove(), 4000);
}

// Periodic sync every 10 seconds
setInterval(fetchQuotesFromServer, 10000);

// ===== Initialize Page =====
document.addEventListener("DOMContentLoaded", function () {
  populateCategories();

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = savedCategory;

  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", displayRandomQuote);

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

  displayRandomQuote();
  fetchQuotesFromServer();
});