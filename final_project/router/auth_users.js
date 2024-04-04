const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  // Check if username exists in user records
  const user = users.find((user) => user.username === username);

  // If username doesn't exist, return false
  if (!user) {
    return false;
  }

  // Check if password matches the one stored for the username
  if (user.password === password) {
    return true; // If password matches, return true
  } else {
    return false; // If password doesn't match, return false
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(users);
  console.log(username, password);

  // Check if username or password is missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Validate the provided username and password
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // If username and password are valid, create a JWT token
  const token = jwt.sign({ username: username }, "123455adsdad", {
    expiresIn: "1h",
  }); // Adjust 'your_secret_key' with your actual secret key

  // Respond with the JWT token
  return res.status(200).json({ token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username; // Assuming you have the username stored in the session

  // Check if review query parameter is provided
  if (!review) {
    return res.status(400).json({ error: "Review is required" });
  }

  // Find the book with the provided ISBN
  const book = books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user already has a review for the book
  if (book.reviews.hasOwnProperty(username)) {
    // If the user already has a review, modify the existing one
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // If the user does not have a review, add a new one
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username; // Assuming you have the username stored in the session

  // Find the book with the provided ISBN
  const book = books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user has a review for the book
  if (!book.reviews.hasOwnProperty(username)) {
    return res.status(404).json({ error: "Review not found" });
  }

  // Delete the user's review for the book
  delete book.reviews[username];

  // Respond with success message
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
