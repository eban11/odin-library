const container = document.querySelector(".container");
const loggedInLinks = document.querySelectorAll(".logged-in");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const editForm = document.querySelector("#book-edit-form form");

function setupUI(user) {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));

    db.collection("books").onSnapshot(
      (querySnapshot) => {
        displayBooks(querySnapshot.docs);
      },
      (err) => {
        console.log(err.message);
      }
    );
  } else {
    container.innerHTML =
      "<h1 class='message'>Sign In or Sign Up to see the books</h1>";

    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
}

function sanitizeHTML(content) {
  let temp = document.createElement("div");
  temp.textContent = content;
  return temp.innerHTML;
}

function displayBooks(docs) {
  let html = ``;
  docs.forEach((doc) => {
    html += createCard(doc);
  });
  container.innerHTML = html;
}

function bookMenu(doc) {
  if (doc.data().createdBy === userId) {
    return `
            <div class='book-menu'>
                  <p class='delete' onClick='deleteBook("${doc.id}")'><i class="fa fa-trash-o" aria-hidden="true"></i></p>
                  <p class='edit' onClick='activateEditBook("${doc.id}")'><i class="fa fa-pencil" aria-hidden="true"></i></p>
                </div>
            `;
  } else {
    return "";
  }
}

function createCard(doc) {
  const book = doc.data();

  card = `
    <div class="card ${book.isRead ? "done" : ""}" data-id="${doc.id}">
      ${bookMenu(doc)}
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
        <button onClick='markAsRead("${doc.id}")'>${
    book.isRead ? "No, haven't read this!" : "I read this!"
  }</button>
      </div>
    </div>
  `;
  return card;
}

function markAsRead(id) {
  isRead = document
    .querySelector(`.card[data-id='${id}']`)
    .classList.contains("done")
    ? false
    : true;
  db.collection("books").doc(id).update({
    isRead,
  });
}

function deleteBook(id) {
  db.collection("books").doc(id).delete();
}

function activateEditBook(id) {
  db.collection("books")
    .doc(id)
    .get()
    .then((doc) => {
      const bookData = doc.data();
      editForm.dataset.bookId = doc.id;
      editForm["edit-title"].value = bookData.title;
      editForm["edit-author"].value = bookData.author;
      editForm["edit-image"].value = bookData.image || "";
      editForm["edit-pages"].value = bookData.pages;

      editForm.parentElement.classList.add("form-container-active");
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
      createdBy: userId,
    })
    .then(() => {
      bookFormContainer.classList.toggle("form-container-active");
      bookForm.reset();
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

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docId = editForm.dataset.bookId;
  db.collection("books")
    .doc(docId)
    .update({
      title: editForm["edit-title"].value,
      author: editForm["edit-author"].value,
      image: editForm["edit-image"].value,
      pages: editForm["edit-pages"].value,
    })
    .then(() => {
      editForm.parentElement.classList.remove("form-container-active");
      editForm.reset();
    });
});
