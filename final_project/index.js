const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  // Check if access token exists in session
  if (!req.session || !req.session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Here you can add additional checks if needed, such as verifying the token against a database, expiry, etc.
  // For simplicity, let's assume req.session.accessToken is already a verified token.

  // Proceed to the next middleware if authentication passes
  next();
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running", PORT));
