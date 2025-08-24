import allBooks from '../DB/books';
const { allUsers } = require('../DB/users');
import LD from 'lodash';

export const resolvers = { // make api calls to actua DB here
  Query: {
    hello: () => 'Hello from AcriticalAPI!',

    //BOOKS
    books: () => allBooks,
    book: (parent, args) => LD.find(allBooks, {title:args.title}),

    //USERS
    users: () => allUsers,
    user: (parent, args) => LD.find(allUsers, {id:args.id}),


  },
};
