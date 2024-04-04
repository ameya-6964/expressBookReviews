const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if the username already exists
  // You would typically check this against your database or user storage mechanism
  // For demonstration purposes, let's assume users are stored in a simple array
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }

  // Assuming 'users' is an array to store registered users
  // You would typically insert the new user into your database or user storage mechanism
  users.push({ username, password });

  // Respond with success message
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  // Sending the list of books from the imported object as response
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book with the provided ISBN exists in the database
  if (books.hasOwnProperty(isbn)) {
    // Send the book details as response
    return res.status(200).json({ book: books[isbn] });
  } else {
    // If book with provided ISBN does not exist, return 404 Not Found
    return res.status(404).json({ error: "Book not found" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Retrieve author from request parameters
  const author = req.params.author;

  // Array to store books with matching author
  let matchingBooks = [];

  // Iterate through books object to find books with matching author
  for (let isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      if (books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    }
  }

  // Check if any books with matching author were found
  if (matchingBooks.length > 0) {
    // Send the matching books details as response
    return res.status(200).json({ books: matchingBooks });
  } else {
    // If no books with matching author were found, return 404 Not Found
    return res.status(404).json({ error: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  // Array to store books with matching title
  let matchingBooks = [];

  // Iterate through books object to find books with matching title
  for (let isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      if (books[isbn].title === title) {
        matchingBooks.push(books[isbn]);
      }
    }
  }

  // Check if any books with matching title were found
  if (matchingBooks.length > 0) {
    // Send the matching books details as response
    return res.status(200).json({ books: matchingBooks });
  } else {
    // If no books with matching title were found, return 404 Not Found
    return res.status(404).json({ error: "Books with this title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Retrieve ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if the book with the provided ISBN exists in the database
  if (books.hasOwnProperty(isbn)) {
    // Retrieve the book reviews from the books object
    const reviews = books[isbn].reviews;

    // Send the book reviews as response
    return res.status(200).json({ reviews: reviews });
  } else {
    // If book with provided ISBN does not exist, return 404 Not Found
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
