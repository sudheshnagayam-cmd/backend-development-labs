
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to database
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

// Check book details
function validateBook(book) {
    const { title, author, price, pages } = book;

    if (typeof title !== "string" || !title.trim()) {
        return "Valid title is required";
    }

    if (typeof author !== "string" || !author.trim()) {
        return "Valid author is required";
    }

    if (typeof price !== "number" ||
        !Number.isFinite(price) || price < 0) {
        return "Price must be a valid non-negative number";
    }

    if (!Number.isInteger(pages) || pages <= 0) {
        return "Pages must be a positive integer";
    }

    return null;
}

// Home route
app.get("/", (req, res) => {
    res.send("Lab 3 REST API is running!");
});

// GET all books with search, sorting and filters
app.get("/books", (req, res) => {
    const {
        search_q = "",
        order_by = "id",
        order = "ASC",
        limit = "10",
        offset = "0",
        min_price,
        max_price
    } = req.query;

    const allowedColumns = [
        "id", "title", "author", "price", "pages"
    ];

    if (!allowedColumns.includes(order_by)) {
        return res.status(400).json({
            message: "Invalid order_by value"
        });
    }

    const sortOrder = String(order).toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
        return res.status(400).json({
            message: "Order must be ASC or DESC"
        });
    }

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    if (!Number.isInteger(limitNumber) ||
        limitNumber <= 0 ||
        !Number.isInteger(offsetNumber) ||
        offsetNumber < 0) {
        return res.status(400).json({
            message: "Invalid limit or offset"
        });
    }

    let sql = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (min_price !== undefined) {
        if (String(min_price).trim() === "" ||
            !Number.isFinite(Number(min_price)) ||
            Number(min_price) < 0) {
            return res.status(400).json({
                message: "Invalid min_price"
            });
        }

        sql += " AND price >= ?";
        params.push(Number(min_price));
    }

    if (max_price !== undefined) {
        if (String(max_price).trim() === "" ||
            !Number.isFinite(Number(max_price)) ||
            Number(max_price) < 0) {
            return res.status(400).json({
                message: "Invalid max_price"
            });
        }

        sql += " AND price <= ?";
        params.push(Number(max_price));
    }

    if (min_price !== undefined &&
        max_price !== undefined &&
        Number(min_price) > Number(max_price)) {
        return res.status(400).json({
            message: "min_price cannot exceed max_price"
        });
    }

    // Column and direction are validated above
    sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

    params.push(limitNumber, offsetNumber);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(200).json(rows);
    });
});

// GET book by ID
app.get("/books/:id", (req, res) => {
    db.get(
        "SELECT * FROM book WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.status(200).json(row);
        }
    );
});

// POST add a book
app.post("/books", (req, res) => {
    const { title, author, price, pages } = req.body;

    const error = validateBook(req.body);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    const sql = `
        INSERT INTO book (title, author, price, pages)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [title.trim(), author.trim(), price, pages],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                message: "Book added successfully",
                id: this.lastID
            });
        }
    );
});

// PUT update a book
app.put("/books/:id", (req, res) => {
    const { title, author, price, pages } = req.body;

    const error = validateBook(req.body);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    const sql = `
        UPDATE book
        SET title = ?, author = ?, price = ?, pages = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [title.trim(), author.trim(), price, pages, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.status(200).json({
                message: "Book updated successfully"
            });
        }
    );
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
    db.run(
        "DELETE FROM book WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.status(200).json({
                message: "Book deleted successfully"
            });
        }
    );
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON body"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
