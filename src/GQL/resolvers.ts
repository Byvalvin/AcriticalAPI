import LD from 'lodash';
import allBooks from '../DB/books';
import allReviews from '../DB/reviews';
const { allUsers } = require('../DB/users');
import allLists from '../DB/lists';
import Genre = require('../enums/Genre');
import type Book = require('../DB/books');
import type User = require('../DB/users');
import type List = require('../DB/lists');
import type Review = require('../DB/reviews');


const normalize = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const resolvers = { // make api calls to actua DB here
  Query: {
    hello: () => 'Hello from AcriticalAPI!',

    //BOOKS
    books: (parent:any, args:{author:string, title:string, genre:Genre.Genre, genres:Genre.Genre[], date:string, adapted:string}) => {
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
          const genreOverlap = genreNorms.some((g:string) =>
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
    book: (parent:any, args:{title:string}) => LD.find(allBooks, {title:args.title}),

    //USERS
    users: () => allUsers,
    user: (parent:any, args:{id:string}) => LD.find(allUsers, {id:args.id}),

    //REVIEWS
    reviews: (parent: any, args: { authorId?: string; bookId?: string }) => {
      return allReviews.filter(review => {
        const matchesAuthor = args.authorId ? review.authorId === args.authorId : true;
        const matchesBook = args.bookId ? review.bookId === args.bookId : true;
        return matchesAuthor && matchesBook;
      });
    },
    review: (parent:any, args:{id:string}) => LD.find(allReviews, {id:args.id})


  },

  //RESOLVE REVIEW DATA
  Review:{
    author:(review:Review.Review)=>allUsers.find((user:User.User)=>user.id===review.authorId),
  },

  //RESOLVE BOOK DATA
  Book:{
    reviews:(book:Book.Book) => allReviews.filter((review)=>review.bookId===book.id),
  },

  //RESOLVE LIST DATA
  List:{
    items:(list:List.List) => allBooks.filter((book)=>list.items?.includes(book.id)),
  },

  //RESOLVE USER DATA
  User:{
    favourites:(user:User.User)=>allBooks.filter((book)=>user.favourites?.includes(book.id)),
    added:(user:User.User)=>allBooks.filter((book)=>user.added?.includes(book.id)),
    reviewed:(user:User.User)=>allBooks.filter((book)=>user.reviewed?.includes(book.id)),
    myReviews:(user:User.User)=>allReviews.filter((review)=>user.myReviews?.includes(review.id)),
    myLists:(user:User.User)=>allLists.filter((list)=>user.myLists?.includes(list.id)),
    following:(user:User.User)=>allUsers.filter((otherUser:User.User)=>user.following?.includes(otherUser.id))
  },


};
