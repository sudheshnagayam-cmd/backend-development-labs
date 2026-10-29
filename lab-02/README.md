# Lab 2: Book Management REST API

## Student Details
- **Name:** Gayam Sudeshna
- **Registration Number:** 252U1R9039
- **Section:** GEN AI - 2A
- **Course:** Backend Development Fundamentals

## Objective

The objective of this lab is to create a Book Management REST API using Node.js, Express.js, and SQLite. The API allows users to add, view, update, and delete books from a database.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- SQLite3
- Postman
- Visual Studio Code
- GitHub

## Project Description

In this project, I created a database named `books.db` using SQLite. I created a table named `book` to store book details.

The table contains the following fields:

- `id` - Book ID
- `title` - Book title
- `author` - Author name
- `price` - Book price
- `pages` - Number of pages

I inserted 10 books into the database and connected it to the Express.js server.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /books | Display all books |
| GET | /books/1 | Display a book by ID |
| POST | /books | Add a new book |
| PUT | /books/11 | Update an existing book |
| DELETE | /books/11 | Delete a book |

## How to Run

1. Install Node.js.
2. Open the `lab-02` folder in VS Code.
3. Open the terminal.
4. Install dependencies:

   `npm install`

5. Start the server:

   `node server.js`

6. The server runs at:

   `http://localhost:3000`

7. Open Postman to test the API endpoints.

## API Testing Using Postman

I tested the API endpoints using Postman.

- **GET /books:** Successfully displayed all books.
- **GET /books/1:** Successfully displayed the book with ID 1.
- **POST /books:** Successfully added a new book.
- **PUT /books/11:** Used to update book details.
- **DELETE /books/11:** Used to delete a book.

## Screenshots

The `screenshots` folder contains:

1. `database.png` - SQLite database
2. `get-books.png` - GET all books
3. `get-book-by-1.png` - GET book by ID
4. `post-book.png` - POST new book
5. `update-book.png` - PUT update book
6. `delete-book.png` - DELETE book

## Conclusion

In this lab, I learned how to create a REST API using Node.js and Express.js. I also learned how to connect an SQLite database and test API endpoints using Postman.

This lab helped me understand CRUD operations and backend development.