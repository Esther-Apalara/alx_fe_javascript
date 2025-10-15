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

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  displayRandomQuote();

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

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
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

// ===== Initialize Page =====
document.addEventListener("DOMContentLoaded", function () {
  populateCategories();

  // Restore last selected filter
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = savedCategory;

  // Attach event listener for Show New Quote button
  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", displayRandomQuote);

  // Attach export button event
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

  displayRandomQuote();
});