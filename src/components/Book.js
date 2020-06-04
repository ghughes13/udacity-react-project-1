// Component to render each individual book

import React from "react";

class Book extends React.Component {
  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage:
                "url(" +
                (this.props.thumb
                  ? this.props.thumb
                  : "https://tinyurl.com/ycttf49u") +
                ")"
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={e => {
                this.props.moveBook(this.props.book, e.target.value);
              }}
              defaultValue={this.props.book.shelf ? this.props.book.shelf : 'none'}              
            >
              <option value="move" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.bookTitle}</div>
        <div className="book-authors">{this.props.bookAuthor}</div>
      </div>
    );
  }
}

export default Book;
