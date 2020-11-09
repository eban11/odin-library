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

const container = document.querySelector(".container");
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

function addBook(e) {
  e.preventDefault();
  const bookFormContainer = document.querySelector("#book-add-form");
  const bookForm = bookFormContainer.querySelector("form");

  const title = bookForm["title"].value;
  const author = bookForm["author"].value;
  const image = bookForm["image"].value;
  const pages = bookForm["pages"].value;
  const isRead = bookForm["read-yes"].checked ? true : false;

  db.collection("books")
    .add({
      title,
      author,
      pages,
      image,
      isRead,
    })
    .then((docRef) => {
      const book = addBookToLibrary(
        docRef.id,
        title,
        author,
        pages,
        image,
        isRead
      );

      const card = createCard(book, myLibrary.length - 1);
      container.prepend(card);

      bookForm.reset();
      bookFormContainer.classList.toggle("form-container-active");
    });
}

function activateFormContainer(e) {
  const container = document.querySelector(`#${e.target.dataset.target}`);
  container.classList.add("form-container-active");
}

function deactivateFormContainer(e) {
  if (e.target.classList.contains("form-container")) {
    e.target.classList.remove("form-container-active");
  }
}

document.querySelectorAll(".modal-trigger").forEach((trigger) => {
  trigger.addEventListener("click", activateFormContainer);
});

document.querySelectorAll(".form-container").forEach((container) => {
  container.addEventListener("click", deactivateFormContainer);
});

document.querySelector("#book-add-form").addEventListener("submit", addBook);
