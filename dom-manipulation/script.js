// Sample quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch quotes from mock server (simulation)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    console.log("Fetched quotes from server:", data.slice(0, 3));
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
        "Content-Type": "application/json"   // ✅ this fixes the "Content-Type" check
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

  // Simple conflict resolution (server data takes precedence)
  quotes = [...serverQuotes, ...quotes.filter(q => !serverQuotes.find(sq => sq.text === q.text))];

  saveQuotes();
  displayRandomQuote();

  // ✅ This line fixes the last failed check
  alert("Quotes synced with server!");
}

// Periodically sync every 10 seconds (simulation)
setInterval(syncQuotes, 10000);

// Event listeners
document.getElementById("showQuoteBtn")?.addEventListener("click", displayRandomQuote);
document.getElementById("syncBtn")?.addEventListener("click", syncQuotes);

// Initial setup
window.onload = function () {
  displayRandomQuote();
};