const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
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
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop using async-await with Axios
public_users.get("/", async function (req, res) {
  try {
    // Make an asynchronous request to fetch the list of books using Axios
    const response = await axios.get("http://localhost:5000");
    const booksData = response.data; // Extract the books from the response data

    // Sending the list of books as response
    return res.status(200).json({ books: booksData });
  } catch (error) {
    // Handle errors
    console.error("Error fetching books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Check if the book with the provided ISBN exists in the database
    if (books.hasOwnProperty(isbn)) {
      // Send the book details as response
      return res.status(200).json({ book: books[isbn] });
    } else {
      // If book with provided ISBN does not exist, return 404 Not Found
      return res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching book details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    // Array to store books with matching author
    let matchingBooks = Object.values(books).filter(
      (book) => book.author === author
    );
    // Check if any books with matching author were found
    if (matchingBooks.length > 0) {
      // Send the matching books details as response
      return res.status(200).json({ books: matchingBooks });
    } else {
      // If no books with matching author were found, return 404 Not Found
      return res.status(404).json({ error: "Books by this author not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    // Array to store books with matching title
    let matchingBooks = Object.values(books).filter(
      (book) => book.title === title
    );
    // Check if any books with matching title were found
    if (matchingBooks.length > 0) {
      // Send the matching books details as response
      return res.status(200).json({ books: matchingBooks });
    } else {
      // If no books with matching title were found, return 404 Not Found
      return res.status(404).json({ error: "Books with this title not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
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
  } catch (error) {
    // Handle errors
    console.error("Error fetching book reviews:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports.general = public_users;
