const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const Papa = require('papaparse');
const app = express();
const port = 3000;

/* This will automatically serve all files in the "static" folder
 * in the static directory in your project root (where package.json is)
 * this includes if there is an index.html in the top level of the
 * directory. */
app.use('/', express.static('static'));

// create an array for your books
let books = [];

//function needs to be async to await fs.readFile
async function getCsvData() {

  /*path.join will auto generate the "absolutel path" and tehn the second
   *part is the path within your root. You can also add the books in a
   *callpack if you use the regular fs and not fs/promise but I think this
   *is cleaner. */
  const csv = await fs.readFile(path.join(__dirname, "/data/booksdata.csv"), "utf-8");

  const csvData = Papa.parse(csv, {header: true});

  // loop over the data returned by papaparse and filter out the
  // partial results it returns for some reason with the if statement.
  csvData.data.forEach(book => {
    if(book.Title && book.Available) {
      // Push the data to the books array you created outside the function.
      books.push({
        id: book.BookID,
        title: book.Title,
        author: book.Author,
        genre: book.Genre,
        price: book.Price,
        image: book.ImageFileName,
        available: book.Available,
      })
    }
  });
}

// Don't forget to call the async function!!
getCsvData();

/* Note ** if you console.log books here it will be empty. That's because
 * You didn't await getCsvData(); That's OK because the data will be populated
 * before it's actually requested. */

/* Create a "get" route that you can use to fetch the data on the client side
 * What you are doing here is basically making your own little API that you
 * can request data from. */

app.get('/bookdata', (_, res) => {
  console.log(books);
  const response = JSON.stringify(books);
  // This is important. if you don't set the content type then your browse
  // won't be expecting json.
  res.header({"Content-Type": "application/json"});

  if (books) {
    res.send(response);
  } else {
    // The if else is option error handling the case where the books
    // Array isn't populated for some reason.
    res.status(500)
    res.send("Book data not loaded");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

