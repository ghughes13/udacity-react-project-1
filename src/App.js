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

  moveBookTo = (book, moveToShelf) => {
    BooksAPI.update(book, moveToShelf)
      .then(res => {
        this.getBooks();
      })
      .catch(err => "");
  };

  getBooks = () => {
    BooksAPI.getAll().then(data =>
      this.setState({
        books: data
      })
    );
  };

  searchForBook(query) {
    BooksAPI.search(query).then(searchData => {
      this.setState({
        query: searchData
      });
    });
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
                  {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
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
