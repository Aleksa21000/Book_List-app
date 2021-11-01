'use strict';

// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI constructor
function UI() { }

// Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.querySelector('#output');

  // Create tr element
  const liItem = document.createElement('tr');
  // Add class to the element
  liItem.classList.add('list-element');
  // Add text
  liItem.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete-item">X</a></td>
  `;

  // Append to list
  list.appendChild(liItem);
}

// Clear fields
UI.prototype.clearFields = function () {
  document.querySelector('#book-title').value = '';
  document.querySelector('#author').value = '';
  document.querySelector('#isbn').value = '';
}

// Show alerts
UI.prototype.showAlert = function (className, message) {
  // Get container
  const container = document.querySelector('.main-container');

  // Create div element
  const alert = document.createElement('div');
  // Add classname and append text
  alert.classList.add('alert', `${className}`);
  alert.appendChild(document.createTextNode(`${message}`));

  // Get form and insert before it
  const form = document.querySelector('#form');
  container.insertBefore(alert, form);

  // Hide after 3 sec
  setTimeout(function timer() {
    document.querySelector('.alert').remove();
  }, 3000);
}

// Delete item
UI.prototype.deleteItem = function (target) {
  if (target.classList.contains('delete-item')) {
    target.parentElement.parentElement.remove();
  }
}

// Local Storage constructor
function LS() { }

// Get items from LS
LS.prototype.getBookFromLS = function () {
  let books;

  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }

  return books;
}

// Add items to LS
LS.prototype.addBookToLS = function (book) {
  // Init LS contructor
  const ls = new LS();
  const books = ls.getBookFromLS();

  // Push to array in LS
  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
}

// Display books
LS.prototype.displayBooksFromLS = function () {
  // Init LS contructor
  const ls = new LS();
  const books = ls.getBookFromLS();

  books.forEach(function (book) {
    // Init UI constructor
    const ui = new UI();

    // Add book to UI
    ui.addBookToList(book);
  });
}

// Delete items from LS
LS.prototype.deleteBookFromLS = function (isbn) {
  // Init LS constructor
  const ls = new LS();
  const books = ls.getBookFromLS();

  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
}

// Event listener on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Init LS constructor
  const ls = new LS();

  // Load books
  ls.displayBooksFromLS();
});

// Event listeners for add a book
document.querySelector('#form').addEventListener('submit', function (e) {
  const title = document.querySelector('#book-title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Init Book constructor
  const book = new Book(title, author, isbn);

  // Init UI constructor
  const ui = new UI();

  // Init LS constructor
  const ls = new LS();

  // Success || fail
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('fail', 'Please fill out all fields...');
  } else {
    ui.showAlert('success', 'Book is added to the list!');

    // Add book to UI
    ui.addBookToList(book);

    // Add book to LS
    ls.addBookToLS(book);

    // Clear fields after adding
    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for delete a book
document.querySelector('#output').addEventListener('click', function (e) {
  // Init UI constructor
  const ui = new UI();

  // Init LS constructor
  const ls = new LS();

  // Delete from LS
  ls.deleteBookFromLS(e.target.parentElement.previousElementSibling.textContent);

  // Delete item on click
  ui.deleteItem(e.target);
  ui.showAlert('success', 'Book has been deleted!');

  e.preventDefault();
});