var firebaseConfig = {
  apiKey: "AIzaSyCiyTfHz3syINWxcz8hM9Kri6iZb-JgfwE",
  authDomain: "odin-library-46ed9.firebaseapp.com",
  databaseURL: "https://odin-library-46ed9.firebaseio.com",
  projectId: "odin-library-46ed9",
  storageBucket: "odin-library-46ed9.appspot.com",
  messagingSenderId: "297060438464",
  appId: "1:297060438464:web:e4cd869a7e91dd2ea0f825",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const container = document.querySelector(".container");
const bookFormContainer = document.querySelector(".form-container");
const bookForm = document.querySelector(".form-container form");
const titleBox = document.getElementById("title");
const authorBox = document.getElementById("author");
const imageBox = document.getElementById("image");
const pagesBox = document.getElementById("pages");
const yesRead = document.getElementById("read-yes");

const myLibrary = [];

db.collection("books")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const book = doc.data();
      addBookToLibrary(
        doc.id,
        book.title,
        book.author,
        book.pages,
        book.image,
        book.isRead
      );
    });
    displayBooks();
  });

function Book(id, title, author, pages, image, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.image = image;
  this.isRead = read;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "read already" : "not read yet"
  }`;
};

Book.prototype.changeReadStatus = function () {
  this.isRead = !this.isRead;
};

function addBookToLibrary(id, title, author, pages, image, isRead) {
  const book = new Book(id, title, author, pages, image, isRead);
  myLibrary.push(book);
  return book;
}

function sanitizeHTML(content) {
  let temp = document.createElement("div");
  temp.textContent = content;
  return temp.innerHTML;
}

function displayBooks() {
  myLibrary.forEach((book) => {
    const card = createCard(book);
    container.appendChild(card);
  });
}

function createCard(book) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = book.id;
  if (book.isRead) {
    card.classList.add("done");
  }
  card.innerHTML = `
    <div class='book-menu'>
      <p class='delete' onClick='deleteBook("${
        book.id
      }")'><i class="fa fa-trash-o" aria-hidden="true"></i></p>
      <p class='edit'><i class="fa fa-pencil" aria-hidden="true"></i></p>
    </div>
    <img
      src=${sanitizeHTML(book.image) || "no image"}
      alt='${sanitizeHTML(book.title)}'
      class="book-image"
    />
    <div class="book-info">
      <p class="title">${sanitizeHTML(book.title)}</p>
      <div>
        <p class="author">by ${sanitizeHTML(book.author)}</p>
        <p class="pages">${sanitizeHTML(book.pages)} pages</p>
      </div>
      <p class="read">${
        book.isRead ? "You have read this one." : "You haven't read this yet."
      }</p>
      <button onClick='markAsRead("${book.id}")'>${
    book.isRead ? "No, haven't read this!" : "I read this!"
  }</button>
    </div>
    
  `;
  return card;
}

function markAsRead(id) {
  const book = myLibrary.filter((b) => b.id === id)[0];

  db.collection("books")
    .doc(id)
    .update({
      isRead: !book.isRead,
    })
    .then(() => {
      book.changeReadStatus();

      const card = document.querySelector(`.card[data-id='${id}']`);
      card.classList.toggle("done");
      const button = card.querySelector("button");
      const read = card.querySelector(".read");

      read.textContent = book.isRead
        ? "You have read this one!"
        : "You haven't read this yet!";

      button.textContent = book.isRead
        ? "No, haven't read this!"
        : "I read this!";
    });
}

function deleteBook(id) {
  db.collection("books")
    .doc(id)
    .delete()
    .then(() => {
      const card = document.querySelector(`.card[data-id='${id}']`);
      card.remove();
    });
}
4;

function resetForm() {
  titleBox.value = "";
  authorBox.value = "";
  pagesBox.value = "";
  imageBox.value = "";
  yesRead.checked = true;
}

function addBook(e) {
  e.preventDefault();

  db.collection("books")
    .add({
      title: titleBox.value,
      author: authorBox.value,
      pages: pagesBox.value,
      image: imageBox.value,
      isRead: yesRead.checked ? true : false,
    })
    .then((docRef) => {
      const book = addBookToLibrary(
        docRef.id,
        titleBox.value,
        authorBox.value,
        pagesBox.value,
        imageBox.value,
        yesRead.checked ? true : false
      );

      console.log(book);

      const card = createCard(book, myLibrary.length - 1);
      container.prepend(card);

      resetForm();
      bookFormContainer.classList.toggle("form-container-active");
    });
}

function toggleBookForm(e) {
  if (!bookForm.contains(e.target)) {
    bookFormContainer.classList.toggle("form-container-active");
  }
}

document.querySelector(".add-book").addEventListener("click", toggleBookForm);
bookFormContainer.addEventListener("click", toggleBookForm);
bookForm.addEventListener("submit", addBook);
