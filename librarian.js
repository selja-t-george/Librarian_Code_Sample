const request = require('request');

const script = () => {
    var cork_city = new Library();
    cork_city.lookup('9781472258229');
    cork_city.add('9781472258229');

    cork_city.lookup('9780441569595');
    cork_city.add('9780441569595', 3);

    cork_city.borrow('9781472258229');
    cork_city.borrow('9780441569595');
    cork_city.borrow('9780441569595');
    cork_city.return_book('9780441569595');

    cork_city.stock();
};

const catalogue = new Map();
request.get('https://raw.githubusercontent.com/DenisColeman/thelibarian/main/catalog.csv',
    function (error, response, body) {
        if (response.statusCode === 200) {
            let csv = body.trim().split('\n');
            for (let i = 0; i < csv.length; i++) {
                csv[i] = csv[i].split(',');
                catalogue.set(
                    csv[i][0],
                    new book(csv[i][0], csv[i][1], csv[i][2], csv[i][3], 0, 0)
                );
            }
            script();
        }
    }
);
class book {
    constructor(isbn, name, author, year, copies, available) {
        this.isbn = isbn;
        this.name = name;
        this.author = author;
        this.year = year;
        this.copies = copies;
        this.available = available;
    }
}
class Library {
    books = new Map();
    constructor() {
        this.books = catalogue;
    }

    lookup(lookup_isbn) {
        if (this.books.has(lookup_isbn)) {
            let library_book = this.books.get(lookup_isbn);
            console.log(library_book.name + ', by ' + library_book.author + ' (' + library_book.year + ')'
            );
        } else {
            console.log('Lookup: Invalid ISBN. Please try again!');
        }
    }

    add(isbn, count = 1) {
        if (this.books.has(isbn)) {
            var library_book = this.books.get(isbn);
            library_book.copies = library_book.copies + count;
            library_book.available = library_book.available + count;
            this.books.set(isbn, library_book);
        } else {
            console.log('Add: Invalid ISBN. Please try again!');
        }
    }

    borrow(isbn) {
        if (this.books.has(isbn)) {
            var library_book = this.books.get(isbn);
            if (library_book.available > 0) {
                library_book.available--;
                this.books.set(isbn, library_book);
            } else {
                console.log('Borrow: No copies of ' + isbn + ' available. Please try another book!');
            }
        } else {
            console.log('Borrow: Invalid ISBN. Please try again!');
        }
    }

    return_book(isbn) {
        if (this.books.has(isbn)) {
            var library_book = this.books.get(isbn);
            library_book.available++;
            if(library_book)
            this.books.set(isbn, library_book);
        } else {
            console.log('Return: Invalid ISBN. Please try again!');
        }
    }

    stock() {
        this.books.forEach((value) => {
            console.log(value.isbn + ', Copies: ' + value.copies + ', Available: ' + value.available
            );
        });
    }
}
