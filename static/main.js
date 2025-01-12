function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-toggle');
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    icon.id = newTheme === 'dark' ? 'fas_fa-sun' : 'fas_fa-moon';
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    document.querySelector('.theme-toggle').id = savedTheme === 'dark' ? 'fas_fa-sun' : 'fas_fa-moon';
}

// Clear search input field
function clearSearch() {
document.getElementById('search-input').value = ''; // Clear input
document.querySelector('.search-form').submit(); // Trigger form submit with empty query
}

// Filter videos dynamically (optional)
function filterVideos() {
const searchQuery = document.getElementById('search-input').value.toLowerCase();
const videoCards = document.querySelectorAll('.video-card');

videoCards.forEach(card => {
const title = card.querySelector('.video-title').textContent.toLowerCase();
if (title.includes(searchQuery)) {
    card.style.display = 'block';
} else {
    card.style.display = 'none';
}
});

// Show/hide clear button based on input field content
const clearButton = document.querySelector('.clear-btn');
if (searchQuery) {
clearButton.style.display = 'block'; // Show the clear button
} else {
clearButton.style.display = 'none'; // Hide the clear button
}
}

