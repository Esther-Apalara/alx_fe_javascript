// An array of quote objects, each with text and category
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// Function to display a random quote on the page
function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `${randomQuote.text} — (${randomQuote.category})`;
}

// Function to add a new quote and update the DOM
function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');
  
  const newText = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newText !== "" && newCategory !== "") {
    quotes.push({ text: newText, category: newCategory });

    // Update the displayed quote immediately after adding
    displayRandomQuote();

    // Clear the input fields
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  } else {
    alert("Please enter both quote text and category!");
  }
}

// Add event listener for “Show New Quote” button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Dynamically create the Add Quote form
function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Run when the page loads
createAddQuoteForm();