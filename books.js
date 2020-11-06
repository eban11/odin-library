const container = document.querySelector(".container");
const myLibrary = [];

function Book(title, author, pages, image, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.image = image;
  this.isRead = read;

  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.isRead ? "read already" : "not read yet"
    }`;
  };
}

function addBookToLibrary(title, author, pages, image, isRead) {
  myLibrary.push(new Book(title, author, pages, image, isRead));
}

function sanitizeHTML(content) {
  let temp = document.createElement("div");
  temp.textContent = content;
  return temp.innerHTML;
}

function createCard(book, i) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.index = i;
  if (book.isRead) {
    card.classList.add("done");
  }
  card.innerHTML = `
    <div class='book-menu'>
      <p class='delete' onClick='deleteBook(${i})'><i class="fa fa-trash-o" aria-hidden="true"></i></p>
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
      <button data-index='${i}' onClick='markAsRead(${i})'>${
    book.isRead ? "No, haven't read this!" : "I read this!"
  }</button>
    </div>
    
  `;
  return card;
}

function displayBooks() {
  myLibrary.forEach((book, i) => {
    const card = createCard(book, i);
    container.appendChild(card);
  });
}

addBookToLibrary(
  "Ten Thousand Skies Above You",
  "Cloudia Gray",
  340,
  "https://i.pinimg.com/originals/a8/b9/ff/a8b9ff74ed0f3efd97e09a7a0447f892.jpg",
  true
);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  false
);
addBookToLibrary("After You", "Jojo Moyes", 267, "", true);
addBookToLibrary("After You", "Jojo Moyes", 267, "", false);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  true
);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  true
);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  true
);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  true
);
addBookToLibrary(
  "The Great Gatsby",
  "F.Scott Fitzgerald",
  340,
  "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
  true
);
displayBooks();

function markAsRead(i) {
  const book = myLibrary[i];
  book.isRead = !book.isRead;

  const card = document.querySelector(`.card[data-index='${i}']`);
  card.classList.toggle("done");
  const button = card.querySelector("button");
  const read = card.querySelector(".read");

  read.textContent = book.isRead
    ? "You have read this one!"
    : "You haven't read this yet!";

  button.textContent = book.isRead ? "No, haven't read this!" : "I read this!";
}

function deleteBook(i) {
  const card = document.querySelector(`.card[data-index='${i}']`);
  card.remove();
}
