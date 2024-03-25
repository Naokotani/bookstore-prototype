async function getBooks() {
  // Fetch the json from you api
  const res = await fetch("http://localhost:3000/bookdata");

  // Make the json into an object. Should handle the non 200 case
  const books = res.status === 200 && (await res.json());

  // put some html in the books div
  const div = document.getElementById("book-div");

  // Make a string for your html;
  let html = "";

  // Loop over the books and add one string per book
  books.forEach((book) => {
    html += `
<h2>${book.title}<h2>
<img alt="cover of ${book.title}"
     src="/images/${book.image}"
     style="width: 300px" />
`;
  });

  // Insert the html into some div
  div.innerHTML = html;
}

// Since this is all inside a funciton because of async, make sure to call it
getBooks();
