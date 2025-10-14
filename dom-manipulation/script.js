// ===== initial quotes (in-memory) =====
let quotes = [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "Life is better when you're laughing.", category: "Funny" },
  { text: "Start where you are. Use what you have. Do what you can.", category: "Inspiration" }
];

// ===== DOM references =====
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const status = document.getElementById('status');

// ===== helpers =====
function renderQuote(quoteObj) {
  // displays one quote object
  quoteDisplay.innerHTML = `
    <p>"${escapeHtml(quoteObj.text)}"</p>
    <small>- ${escapeHtml(quoteObj.category)}</small>
  `;
}

// basic small sanitizer for text nodes (prevents accidental HTML)
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes yet. Add one below!";
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  renderQuote(quotes[idx]);
}

// Add quote function triggered by button
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    showStatus("Please fill both fields.", true);
    return;
  }

  // create new quote object and add to array
  const newQ = { text, category };
  quotes.push(newQ);

  // show the added quote immediately
  renderQuote(newQ);

  // clear inputs
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  showStatus("Quote added successfully!");
}

// small status helper (error flag = red)
function showStatus(message, isError = false) {
  status.textContent = message;
  status.style.color = isError ? 'crimson' : 'green';
  // hide after 3s
  setTimeout(() => { status.textContent = ''; }, 3000);
}

// ===== event listeners =====
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// show a quote on first load
showRandomQuote();