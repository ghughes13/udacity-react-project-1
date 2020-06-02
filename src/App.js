import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BookShelf from "./components/BookShelf";
import Book from "./components/Book";
import BookPlaceholder from "./images/BookPlaceholder.png";
import { Link, Route } from "react-router-dom";

class BooksApp extends React.Component {
  state = {
    books: [],
    showSearchPage: false,
    shelves: ["Currently Reading", "Want To Read", "Read"],
    query: []
  };

  componentDidMount() {
    this.getBooks();
  }

  moveBookTo = (book, moveToShelf) => { //Moves what shelf a book is on
    BooksAPI.update(book, moveToShelf)
      .then(res => {
        this.getBooks();
      })
      .catch(err => "");
  };

  getBooks = () => { //Gets all books corrosponding to current token
    BooksAPI.getAll().then(data =>
      this.setState({
        books: data
      })
    );
  };

  searchForBook(query) { //Sends search query to back end
    if(query.length !== 0) {
      BooksAPI.search(query).then(searchData => {
        this.setState({
          query: searchData
        });
      })
    }
  }

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    onKeyUp={e =>
                      this.searchForBook(document.querySelector("input").value)
                    }
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {this.state.query && this.state.query.length ? (
                    this.state.query.map(book => (
                      <Book
                        thumb={
                          book.imageLinks && book.imageLinks.thumbnail
                            ? book.imageLinks.thumbnail
                            : BookPlaceholder
                        }
                        bookTitle={book.title}
                        bookAuthor={book.authors}
                        book={book}
                        moveBook={this.moveBookTo}
                        key={book.id}
                      />
                    ))
                  ) : (
                    <h2>No results</h2>
                  )}
                </ol>
              </div>
            </div>
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  {this.state.shelves.map((shelf, index) => {
                    return (
                      <BookShelf
                        book={this.state.books}
                        shelf={this.state.shelves[index]}
                        key={this.state.shelves[index]}
                        moveBook={this.moveBookTo}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
