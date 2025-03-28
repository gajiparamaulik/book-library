let allBooks = [];
const loader = document.getElementById("loader");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");

let currentPage = 1;
const pageSize = 10;

async function fetchBooks(page) {
    try {
        loader.classList.remove("hidden"); // Show loader
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${page}&limit=${pageSize}`);
        const data = await response.json();
        allBooks = data.data.data;
        displayBooks(allBooks);
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        setTimeout(() => {
            loader.classList.add("hidden"); // Hide loader after 500ms (smooth effect)
        }, 500);
    }
}

function displayBooks(books) {
    const bookListContainer = document.getElementById('bookList');
    bookListContainer.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : './assets/images/default-book.jpg';
        const bookUrl = book.volumeInfo.infoLink || '#';

        bookCard.innerHTML = `
            <img src="${thumbnail}" alt="${book.volumeInfo.title}">
            <div class="book-details">
                <h3>${book.volumeInfo.title}</h3>
                <p>Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
                <p>Publisher: ${book.volumeInfo.publisher || 'Unknown'}</p>
                <p>Published: ${book.volumeInfo.publishedDate || 'Unknown'}</p>
            </div>
        `;
        bookCard.addEventListener("click", () => {
            window.open(bookUrl, "_blank"); // Opens in a new tab
        });
        bookListContainer.appendChild(bookCard);
    });
    pageNumber.textContent = `Page ${currentPage}`;
}

// View change function
function toggleView(viewType) {
    const bookListContainer = document.getElementById('bookList');
    if (viewType === 'grid') {
        bookListContainer.classList.add('grid');
        bookListContainer.classList.remove('list');
    } else {
        bookListContainer.classList.add('list');
        bookListContainer.classList.remove('grid');
    }
}

// Sorting function
function sortBooks(criteria) {
    const sortedBooks = [...allBooks].sort((a, b) => {
        if (criteria === 'alphabetical') {
            return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
        } else if (criteria === 'publishedDate') {
            return new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate);
        }
    });
    displayBooks(sortedBooks);
}

// Search function
function searchBooks(query) {
    const filteredBooks = allBooks.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(query.toLowerCase()) || 
        book.volumeInfo.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
    );
    displayBooks(filteredBooks);
}

// Go To Previous Page Button
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage);
    }
});

// Go To Next Page Button
nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchBooks(currentPage);
});

// Event listeners for UI interactions
document.getElementById('gridView').addEventListener('click', () => toggleView('grid'));
document.getElementById('listView').addEventListener('click', () => toggleView('list'));

document.getElementById('sortBooks').addEventListener('change', (e) => {
    sortBooks(e.target.value);
});

document.getElementById('searchInput').addEventListener('input', (event) => {
    searchBooks(event.target.value.trim());
});

// Fetch books on page load
fetchBooks(currentPage);
