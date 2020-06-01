import React from "react";
import Book from "./Book";

class BookShelf extends React.Component {
  state = {
    books: this.props.book
  };

  componentDidMount() {}

  render() {
    console.log(this.props);

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelf}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.book.map(book => {
              if (
                this.props.shelf.replace(/\s/g, "").toLowerCase() ===
                book.shelf.toLowerCase()
              ) {
                return (
                  <li key={book.id}>
                    <Book
                      book={book}
                      thumb={book.imageLinks.thumbnail}
                      bookTitle={book.title}
                      bookAuthor={book.authors}
                      moveBook={this.props.moveBook}
                    />
                  </li>
                );
              }
              return "";
            })}
          </ol>
        </div>
      </div>
    );
  }
}

export default BookShelf;
