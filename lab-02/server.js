
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(
    path.join(__dirname, "books.db"),
    (err) => {
        if (err) {
            console.log("Database error:", err.message);
        } else {
            console.log("Database connected successfully");
        }
    }
);

// Home page
app.get("/", (req, res) => {
    res.send("Lab 2 Book Management REST API is running!");
});

// Get all books
app.get("/books", (req, res) => {
    db.all("SELECT * FROM book", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    db.get(
        "SELECT * FROM book WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json(row);
        }
    );
});

// Add a new book
app.post("/books", (req, res) => {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price == null || pages == null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql =
        "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)";

    db.run(sql, [title, author, price, pages], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Book added successfully",
            id: this.lastID,
            title,
            author,
            price,
            pages
        });
    });
});

// Update a book
app.put("/books/:id", (req, res) => {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price == null || pages == null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql =
        "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?";

    db.run(
        sql,
        [title, author, price, pages, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json({
                message: "Book updated successfully"
            });
        }
    );
});

// Delete a book
app.delete("/books/:id", (req, res) => {
    db.run(
        "DELETE FROM book WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json({
                message: "Book deleted successfully"
            });
        }
    );
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
