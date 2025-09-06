import LD from 'lodash';
import allBooks from '../DB/dummyData/books';
import allReviews from '../DB/dummyData/reviews';
const { allUsers } = require('../DB/dummyData/users');
import allLists from '../DB/dummyData/lists';
import Genre = require('../enums/Genre');
// import Book = require('../DB/dummyData/books');
//import User = require('../DB/dummyData/users');
//import type List = require('../DB/dummyData/lists');
//import type Review = require('../DB/dummyData/reviews');

import { Types } from 'mongoose'; // needed for ObjectId validation
import { Book, IBook } from '../DB/models/Book';
import { User, IUser } from '../DB/models/User';
import { Review, IReview } from '../DB/models/Review';
import { List, IList } from '../DB/models/List';



const normalize = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const abouts: string[] = [
  "A traveller from an antique land", // Ozymandias
  "Call me Ishmael", // Moby Dick
  "A soul with sorrow", // The Raven
  "Maman died today", // The Stranger
  "A player who struts and frets, until he is heard no more", // Macbeth
  "I am invisible, understand, simply because people refuse to see me", // Invisible Man
  "All this happened, more or less", // Slaughterhouse-Five
  "I took the one less traveled by", // The Road Not Taken
  "So it goes", // Slaughterhouse-Five
  "It was a bright cold day in April, and the clocks were striking thirteen", // 1984
  "We are all fools in love", // Pride and Prejudice
  "I am no bird; and no net ensnares me", // Jane Eyre
  "Beware; for I am fearless, and therefore powerful", // Frankenstein
  "The past is never dead. It’s not even past", // Faulkner
  "I contain multitudes", // Walt Whitman
  "I have measured out my life with coffee spoons", // The Love Song of J. Alfred Prufrock
  "To me, fair friend, you never can be old", // Sonnet 104
  "I’m doing badly, I’m doing well; whichever you prefer.", // Letters to Milena
  "I saw the truth and I know that men can be beautiful.", //The Dream of A Ridiculous Man,
  "The horror! The horror!", // Heart of Darkness
  "Abandon all hope, ye who enter here.", // The Divine Comedy
  "Logic may indeed be unshakeable, but it cannot withstand a man who is determined to live", // The Trial
  "Fate will unwind as it must", // Beowulf
  "I don’t want comfort. I want God, I want poetry, I want real danger… I want sin", // Brave New World
  "The greatest griefs are those we cause ourselves", // Oedipus Rex
  "It was a pleasure to burn", // Fahrenheit 451
  "I had done it solely to avoid looking a fool", // Shooting An Elephant
  "A warrior will sooner die than live a life of shame", // Beowulf
  "I go my own way, a particular way. I'm my own particular man", // The Double
  "Midway upon the journey of our life, I found myself within a forest dark, for the straightforward pathway had been lost", // The Divine Comedy
  "It is the time you have wasted for your rose that makes your rose so important", // The Little Prince
  "There is no greater sorrow than to recall happiness in times of misery", // The Divine Comedy
  "From a certain point onward there is no longer any turning back. That is the point that must be reached", // The Trial
  "Beauty is a riddle", // The Idiot
  "These violent delights have violent ends", // Romeo and Juliet
  "There are books of which the backs and covers are by far the best parts", // Oliver Twist
  "He wears a mask, and his face grows to fit it", // Shooting An Elephant
  "We’re all mad here", // Alice In Wonderland
  "From this day forth I shall be blind to the truth", // Oedipus Rex
  "Perhaps one did not want to be loved so much as to be understood", // 1984
  "If one’s different, one’s bound to be lonely", // Brave New World
  "It is not down on any map; true places never are", // Moby Dick
  "I will work harder", // Animal Farm




];
const randomIndex = (N:number)=>Math.floor(Math.random() * N);
const getMaxIdNumber = (items: { id: string }[]): number => {
  const numbers = items
    .map(item => item.id.match(/\d+$/)) // match digits at the end
    .filter(match => match !== null)
    .map(match => parseInt(match![0]))
    .filter(num => !isNaN(num));

  return numbers.length > 0 ? Math.max(...numbers) : 0;
};
const generateId = (prefix:string, N:number)=>`${prefix}${N + 1}`;


interface BookQueryArgs {
  author?: string;
  title?: string;
  genre?: Genre.Genre;
  date?: string;         // ISO string
  adapted?: boolean;
}
interface ReviewQueryArgs {
  userId?: string;
  bookId?: string;
  ratingMin?: number;
  ratingMax?: number;
}
interface ListQueryArgs {
  userId: string;
  name?: string;
  visible?: boolean;
}

export const resolvers = { // make api calls to actua DB here
  Query: {
    hello: () => 'Hello from AcriticalAPI!',

    //BOOKS
    books: async (_parent: any, args: BookQueryArgs): Promise<IBook[]> => {
      const filter: any = {};
      // Title (search in both title and aliases, partial + case-insensitive)
      if (args.title) {
        const titleRegex = new RegExp(normalize(args.title), 'i');
        filter.$or = [
          { title: { $regex: titleRegex } },
          { aliases: { $elemMatch: { $regex: titleRegex } } }
        ];
      }
      // Author
      if (args.author) filter.author = new RegExp(normalize(args.author), 'i');
      // Genre (match if either genre or genres contains it)
      if (args.genre) {
        filter.$or = filter.$or || [];
        filter.$or.push(
          { genre: args.genre },
          { genres: args.genre }
        );
      }
      // Date (exact match, assumes ISO string passed)
      if (args.date) {
        const dateObj = new Date(args.date);
        if (!isNaN(dateObj.getTime())) filter.date = dateObj;
      }
      // Adapted (boolean)
      if (typeof args.adapted === 'boolean') filter.adapted = args.adapted;
      
      return await Book.find(filter).exec();
    },
    book: async (_parent: any, args: { id: string }): Promise<IBook | null> => {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new Error('Invalid book ID');
      }
      const book = await Book.findById(args.id).exec();
      return book;
    },

    //USERS
    users: async (_parent: any, args: { name?: string }): Promise<IUser[]> => {
      const filter: any = {};

      if (args.name) {
        const nameRegex = new RegExp(args.name.trim(), 'i'); // Case-insensitive partial match
        filter.name = nameRegex;
      }

      return await User.find(filter).exec();
    },
    user: async (_parent: any, args: { id: string }): Promise<IUser | null> => {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new Error('Invalid user ID');
      }
      return await User.findById(args.id).exec();
    },


    //REVIEWS
    reviews: async (_parent: any, args: ReviewQueryArgs): Promise<IReview[]> => {
      const filter: any = {};

      // Filter by userId (author)
      if (args.userId) {
        if (!Types.ObjectId.isValid(args.userId)) {
          throw new Error('Invalid user ID');
        }
        filter.author = new Types.ObjectId(args.userId);
      }
      // Filter by bookId
      if (args.bookId) {
        if (!Types.ObjectId.isValid(args.bookId)) {
          throw new Error('Invalid book ID');
        }
        filter.book = new Types.ObjectId(args.bookId);
      }

      // Filter by rating range
      if (typeof args.ratingMin === 'number' || typeof args.ratingMax === 'number') {
        filter.rating = {};
        if (typeof args.ratingMin === 'number') {
          filter.rating.$gte = args.ratingMin;
        }
        if (typeof args.ratingMax === 'number') {
          filter.rating.$lte = args.ratingMax;
        }
      }

      return await Review.find(filter).exec();
    },

    review: async (_parent: any, args: { id: string }): Promise<IReview | null> => {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new Error('Invalid review ID');
      }

      return await Review.findById(args.id).exec();
    },

    //LISTS
    lists: async (_parent: any, args: ListQueryArgs): Promise<IList[]> => {
      const filter: any = {};

      // Author (userId)
      if (args.userId) {
        if (!Types.ObjectId.isValid(args.userId)) {
          throw new Error('Invalid user ID');
        }
        filter.author = new Types.ObjectId(args.userId);
      }

      // Name (partial, case-insensitive)
      if (args.name) {
        const nameRegex = new RegExp(args.name, 'i');
        filter.name = { $regex: nameRegex };
      }

      // Visibility
      if (typeof args.visible === 'boolean') filter.visible = args.visible;

      return await List.find(filter).exec();
    },

    list: async (_parent: any, args: {id:string}): Promise<IList | null> => {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new Error('Invalid list ID');
      }
      return await List.findById(args.id).exec();
    }
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
    myReviews:(user:User.User)=>allReviews.filter((review)=>review.authorId===user.id),
    myLists:(user:User.User)=>allLists.filter((list)=>list.authorId===user.id),
    following:(user:User.User)=>allUsers.filter((otherUser:User.User)=>user.following?.includes(otherUser.id))
  },


  Mutation:{
    addToUserFollowing: (parent: any, args: { input: { id: string; followingId: string } }) => {
      const { id, followingId } = args.input;
      if(id===followingId){
        throw new Error("A User can't follow themself");
      }
      let updatedUser;
      allUsers.forEach((user: User.User) => {
        if (user.id === id) {
          if (!user.following.includes(followingId)) {
            user.following.push(followingId);
          }
          updatedUser = user;
        }
      });
      return updatedUser;
    },
    removeFromUserFollowing: (parent: any, args: { input: { id: string; followingId: string } }) => {
      const { id, followingId } = args.input;
      let updatedUser;
      allUsers.forEach((user: User.User) => {
        if (user.id === id) {
          user.following = user.following.filter((fid) => fid !== followingId);
          updatedUser = user;
        }
      });
      return updatedUser;
    },


    createUserList: (parent:any, args:{input:{userId:string, name:string, visible:boolean}})=>{
      const {userId, name, visible} = args.input;
      const newList:List.List = {
        id: generateId("l",getMaxIdNumber(allLists)),
        authorId:userId,
        name,
        visible,
        items: []
      };
      console.log(`New list created: ${newList.name} by ${newList.authorId} (${newList.id})`);
      allLists.push(newList);
      return newList;
    },
    updateUserList: (parent: any, args: { input: { id: string; name?: string; visible?: boolean } }) => {
      const { id, name, visible } = args.input;
      let updatedList;
      allLists.forEach((list: List.List) => {
        if (list.id === id) {
          list.name = name || list.name;
          list.visible = visible===undefined ? list.visible : visible ;
          updatedList = list;
        }
      });
      return updatedList;
    },
    addBookToUserList: (parent: any, args: { input: { id: string; bookId: string } }) => {
      const { id, bookId } = args.input;
      let updatedList;
      allLists.forEach((list: List.List) => {
        if (list.id === id) {
          list.items = LD.union(list.items, [bookId]); // Avoid duplicates
          updatedList = list;
        }
      });
      return updatedList;
    },
    removeBookFromUserList: (parent: any, args: { input: { id: string; bookId: string } }) => {
      const { id, bookId } = args.input;
      let updatedList;
      allLists.forEach((list: List.List) => {
        if (list.id === id) {
          list.items = list.items.filter((aBookId) => aBookId!==bookId);
          updatedList = list;
        }
      });
      return updatedList;
    },
    deleteUserList: (parent: any, args: { id: string }) => {
      const removed = LD.remove(allLists, (list) => list.id === args.id);
      return removed[0]; // Return the deleted list
    },


    createUserReview: (
      parent: any,
      args: { input: { userId: string; bookId: string; text: string; rating: number } }
    ) => {
      const { userId, bookId, text, rating } = args.input;

      // Check if review already exists
      const existingReview = allReviews.find(
        (review) => review.authorId === userId && review.bookId === bookId
      );
      if (existingReview) {
        throw new Error("User has already reviewed this book.");
      }

      const newReview: Review.Review = {
        id: generateId("r", getMaxIdNumber(allReviews)),
        authorId: userId,
        bookId,
        text,
        rating: rating || -1,
      };

      allReviews.push(newReview);

      // Add bookId to user's reviewed array if not already present
      const user = allUsers.find((u:User.User) => u.id === userId);
      if (user && !user.reviewed.includes(bookId)) {
        user.reviewed.push(bookId);
      }

      console.log(`New review added: ${newReview.authorId} for ${newReview.bookId}`);
      return newReview;
    },
    updateUserReview: (parent:any, args:{input:{id: string, text?:string, rating?:number}})=>{
      const {id, text, rating} = args.input;
      let updatedReview;
      allReviews.forEach((review)=>{
        if(review.id===id){
          review.text = text ?? review.text;
          review.rating = rating ?? review.rating;
          updatedReview = review;
        }
      })
      return updatedReview;
    },
    deleteUserReview: (parent: any, args: { id: string }) => {
      const removed = LD.remove(allReviews, (review) => review.id === args.id);
      const deletedReview = removed[0];

      if (deletedReview) {
        const user = allUsers.find((u: User.User) => u.id === deletedReview.authorId);
        if (user) {
          user.reviewed = user.reviewed.filter((id:string) => id !== deletedReview.bookId);
        }
      }

      return deletedReview;
    },

    createBook: (parent:any, 
      args:{input:{ author: string, title: string, genre: Genre.Genre, summary: string, date: string, adapted?: boolean}})=>{
      const {author, title, genre, summary, date, adapted} = args.input;
      const newBook:Book.Book = {
        id: generateId("b",getMaxIdNumber(allBooks)),
        author,
        title,
        aliases: [],
        genre,
        genres: [],
        summary,
        date,
        adapted: adapted || false,
        reviews: [],
      }
      console.log(`New book added: ${newBook.title} by ${newBook.author} (${newBook.id})`);
      allBooks.push(newBook);
      return newBook;
    },


    createUser: (parent:any, args:{input:{name:string, about?:string}}) => {
      const newUser : User.User = {
        id: generateId("u", getMaxIdNumber(allUsers)),
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
    updateUserAbout: (parent:any, args:{input:{id:string, about:string}})=>{
      let updatedUser;
      const {id, about} = args.input;
      allUsers.forEach((user:User.User) => {
        if(user.id===id){
           user.about = about;
           updatedUser = user;
        }
      });

      return updatedUser;
    },
    updateUserAvatar: async (_: any, { id, avatarUrl }: { id: string; avatarUrl: string }) => {
      try {
        let user;
        allUsers.forEach((user:User.User)=>{
          if(user.id===id){
            user.avatar = avatarUrl;
          }
        });
        //const user = await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });
        return user;
      } catch (err) {
        console.error(err);
        throw new Error('Failed to update avatar');
      }
    },
    addBookToUser: (parent:any, args:{input:{userId:string, bookId:string, dest:string}})=>{
      const {userId, bookId, dest} = args.input;
      allUsers.forEach((user:User.User)=>{
        if(user.id===userId){
          switch (dest) {
            case "FAVOURITE":
              user.favourites.push(bookId);
              break;
            case "ADDED":
              user.added.push(bookId);
              break;
            case "REVIEWED":
              throw new Error("Use createUserReview to mark a book as reviewed.");
            default:
              throw new Error("Invalid destination");
          }
        }
      });

      console.log(`book added to ${dest}: ${userId} (${bookId})`);
      return allBooks.find((book) => book.id === bookId);
    },
    removeBookFromUser: (parent:any, args:{input:{userId:string, bookId:string, dest:string}})=>{
      const {userId, bookId, dest} = args.input;
      allUsers.forEach((user:User.User)=>{
        if(user.id===userId){
          switch (dest) {
            case "FAVOURITE":
              user.favourites = user.favourites.filter((book)=>book!==bookId);
              break;
            case "ADDED":
              user.added = user.added.filter((book)=>book!==bookId);
              break;
            case "REVIEWED":
              throw new Error("Use deleteUserReview to remove user review.");
            default:
              throw new Error("Invalid destination");
          }
        }
      });

      console.log(`book removed from ${dest}: ${userId} (${bookId})`);
      return allBooks.find((book) => book.id === bookId);
    },
    deleteUser:(parent:any, args:{id:string}) => LD.remove(allUsers,(user)=>user.id===args.id)[0],
    deleteBook:(parent:any, args:{id:string}) => LD.remove(allBooks,(book)=>book.id===args.id)[0],

  }
};
