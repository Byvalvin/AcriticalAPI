import LD from 'lodash';
import allBooks from '../DB/books';
import allReviews from '../DB/reviews';
const { allUsers } = require('../DB/users');
import allLists from '../DB/lists';
import Genre = require('../enums/Genre');
import Book = require('../DB/books');
import User = require('../DB/users');
import type List = require('../DB/lists');
import type Review = require('../DB/reviews');


const normalize = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const abouts: string[] = [
  "A traveller from an antique land", // Ozymandias
  "Call me Ishmael", // Moby Dick
  "A soul with sorrow", // The Raven
  "Mama died today", // The Stranger
  "A player who struts and frets, until he is heard no more", // Macbeth
  "I am invisible, understand, simply because people refuse to see me", // Invisible Man
  "All this happened, more or less", // Slaughterhouse-Five
  "I took the one less traveled by", // The Road Not Taken
  "So it goes", // Slaughterhouse-Five
  "It was a bright cold day in April, and the clocks were striking thirteen", // 1984
  "We are all fools in love", // Pride and Prejudice
  "I am no bird; and no net ensnares me", // Jane Eyre
  "Time is a flat circle", // Nietzsche via True Detective
  "The past is never dead. It’s not even past", // Faulkner
  "I contain multitudes", // Walt Whitman
];
const randomIndex = (N:number)=>Math.floor(Math.random() * N);
const generateId = (prefix:string, N:number)=>`${prefix}${N + 1}`;


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
    book:(review:Review.Review)=>allBooks.find((book)=>book.id===review.bookId),
  },

    //RESOLVE LIST DATA
  List:{
    author:(list:List.List) => allUsers.find((user:User.User)=>user.id===list.authorId),
    items:(list:List.List) => allBooks.filter((book)=>list.items?.includes(book.id)),
  },

  //RESOLVE BOOK DATA
  Book:{
    reviews:(book:Book.Book) => allReviews.filter((review)=>review.bookId===book.id),
  },

  //RESOLVE USER DATA
  User:{
    favourites:(user:User.User)=>allBooks.filter((book)=>user.favourites?.includes(book.id)),
    added:(user:User.User)=>allBooks.filter((book)=>user.added?.includes(book.id)),
    reviewed:(user:User.User)=>allBooks.filter((book)=>user.reviewed?.includes(book.id)),
    //myReviews:(user:User.User)=>allReviews.filter((review)=>user.myReviews?.includes(review.id)),
    myReviews:(user:User.User)=>allReviews.filter((review)=>review.authorId===user.id),
    //myLists:(user:User.User)=>allLists.filter((list)=>user.myLists?.includes(list.id)),
    myLists:(user:User.User)=>allLists.filter((list)=>list.authorId===user.id),
    following:(user:User.User)=>allUsers.filter((otherUser:User.User)=>user.following?.includes(otherUser.id))
  },


  Mutation:{
    createUser: (parent:any, args:{input:{name:string, about?:string}}) => {
      const newUser : User.User = {
        id: generateId("u", allUsers.length),
        name:args.input.name,
        about: (args.input.about || abouts[randomIndex(abouts.length)]) as string,
        favourites: [],
        added: [],
        reviewed: [],
        myReviews: [],
        myLists: [],
        following: []

      }
      console.log(`New user created: ${newUser.name} (${newUser.id})`);
      allUsers.push(newUser);
      return newUser;
    },

    updateUserName: (parent:any, args:{input:{id:string, name:string}})=>{
      let updatedUser;
      const {id, name} = args.input;
      allUsers.forEach((user:User.User) => {
        if(user.id===id){
           user.name = name;
           updatedUser = user;
        }
      });

      return updatedUser;
    },

    deleteUser:(parent:any, args:{id:string}) => LD.remove(allUsers,(user)=>user.id===args.id),
    
  }


};
