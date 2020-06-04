import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BookShelf from "./components/BookShelf";
import Book from "./components/Book";
import BookPlaceholder from "./images/BookPlaceholder.png";
import { Link, Route, Switch } from "react-router-dom";

class BooksApp extends React.Component {
  state = {
    books: [],
    showSearchPage: false,
    shelves: ["Currently Reading", "Want To Read", "Read"],
    queryResults: []
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
  
  clearSearch = () => {
    this.setState({
      queryResults: []
    });
  }

  searchForBook(query) { //Sends search query to back end
    console.log(query)
    if(query == false || query.length === 0) {
      this.clearSearch()
    } else {
      BooksAPI.search(query).then(searchData => {
        console.log(searchData)
        if(searchData.items === undefined) {
          searchData.forEach(book => {
            for(const savedBook of this.state.books) {
              if(savedBook.id === book.id) {
                book.shelf = savedBook.shelf
              }
            }
          })
          this.setState({
            queryResults: searchData
          });
        }
      })
    }
  }

  render() {
    return (
      <div className="app">
        <Switch>
        <Route
          exact
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search" onClick={this.clearSearch}>
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
                  {this.state.queryResults && this.state.queryResults.length ? (
                    this.state.queryResults.map(book => (
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
        <Route render={() => (<h1>404 - Whoops. Looks like that page is not available. <Link to={'/'}>Click Here</Link> to go home</h1>)} />
        </Switch>
      </div>
    );
  }
}

export default BooksApp;
