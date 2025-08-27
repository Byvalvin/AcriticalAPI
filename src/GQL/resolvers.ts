import allBooks from '../DB/books';
const { allUsers } = require('../DB/users');
import LD from 'lodash';
import allReviews from '../DB/reviews';
import Genre = require('../enums/Genre');
import type Book = require('../DB/books');

const normalize = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const resolvers = { // make api calls to actua DB here
  Query: {
    hello: () => 'Hello from AcriticalAPI!',

    //BOOKS
    books: (parent, args) => {
      return LD.filter(allBooks, (book:Book.Book) => {
        // Match author
        if (args.author && normalize(book.author) !== normalize(args.author)) return false;

        // Match title or aliases
        if (args.title) {
          const titleNorm = normalize(args.title);
          const titleMatch =
            normalize(book.title).includes(titleNorm) ||
            (book.aliases && book.aliases.some((alias) => normalize(alias).includes(titleNorm)));
          if (!titleMatch) return false;
        }

        // Match genre or genres
        if (args.genre) {
          const genreNorm = normalize(args.genre);
          const genreMatch =
            normalize(book.genre) === genreNorm ||
            (book.genres && book.genres.some((g) => normalize(g) === genreNorm));
          if (!genreMatch) return false;
        }

        // Match any of the genres
        if (args.genres && LD.isArray(args.genres)) {
          const genreNorms = args.genres.map(normalize);
          const genreOverlap = genreNorms.some((g:Genre.Genre) =>
            book.genres.some((bg) => normalize(bg) === g)
          );
          if (!genreOverlap) return false;
        }

        // Match date
        if (args.date && book.date !== args.date) return false;

        // Match adapted
        if (typeof args.adapted === 'boolean' && book.adapted !== args.adapted) return false;

        return true;
      });
    },
    book: (parent, args) => LD.find(allBooks, {title:args.title}),

    //USERS
    users: () => allUsers,
    user: (parent, args) => LD.find(allUsers, {id:args.id}),

    //REVIEWS
    reviews: () => allReviews,
    review: (parent, args) => LD.find(allReviews, {id:args.id})


  },
};
