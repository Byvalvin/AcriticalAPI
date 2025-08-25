import allBooks from '../DB/books';
const { allUsers } = require('../DB/users');
import LD from 'lodash';
import allReviews from '../DB/reviews';

export const resolvers = { // make api calls to actua DB here
  Query: {
    hello: () => 'Hello from AcriticalAPI!',

    //BOOKS
    books: (parent, args) => {
      console.log(args)
      return LD.filter(allBooks, args)
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
