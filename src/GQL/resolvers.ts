// import LD from 'lodash';
// import allBooks from '../DB/dummyData/books';
// import allReviews from '../DB/dummyData/reviews';
// const { allUsers } = require('../DB/dummyData/users');
// import allLists from '../DB/dummyData/lists';
import Genre = require('../enums/Genre');
import BookListType = require('../enums/BookListType');
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
    author: async (review: IReview) => await User.findById(review.author),
    book: async (review: IReview) => await Book.findById(review.book)
  },

    //RESOLVE LIST DATA
  List:{
    author: async (list: IList) => await User.findById(list.author),
    items: async (list: IList) => await Book.find({ _id: { $in: list.items } })
  },

  //RESOLVE BOOK DATA
  Book:{
    reviews: async(book:IBook) => await Review.find({ book: book._id }),
  },

  //RESOLVE USER DATA
  User:{
    favourites: async (user: IUser) => await Book.find({ _id: { $in: user.favourites } }),
    added: async (user: IUser) => await Book.find({ _id: { $in: user.added } }),
    reviewed: async (user: IUser) => await Book.find({ _id: { $in: user.reviewed } }),
    myReviews: async (user: IUser) => await Review.find({ author: user._id }),
    myLists: async (user: IUser) => await List.find({ author: user._id }),
    following: async (user: IUser) => await User.find({ _id: { $in: user.following } })
  },


  Mutation:{
    addToUserFollowing: async (_: any, args: { input: { id: string; followingId: string } }): Promise<IUser | null> => {
      const { id, followingId } = args.input;
      if (id === followingId) throw new Error("A user can't follow themselves.");

      const user = await User.findById(id);
      const target = await User.findById(followingId);
      if (!user || !target) throw new Error("User or target user not found.");

      if (!user.following.includes(target._id as Types.ObjectId)) {
        user.following.push(target._id as Types.ObjectId);
        await user.save();
      }

      return user;
    },
    removeFromUserFollowing: async (_: any, args: { input: { id: string; followingId: string } }): Promise<IUser | null> => {
      const { id, followingId } = args.input;
      const user = await User.findById(id);
      if (!user) throw new Error("User not found.");
    
      user.following = user.following.filter((fid) => fid.toString() !== followingId);
      await user.save();
      return user;
    },


    createUserList: async (_: any, args: { input: { userId: string; name: string; visible: boolean } }): Promise<IList> => {
      const { userId, name, visible } = args.input;

      const newList = await List.create({
        author: new Types.ObjectId(userId),
        name,
        visible,
        items: []
      });

      // Optionally update user's myLists array(CONCLUSION DONT NEED TO MANUALLY ADD AND DELETE USERLISTS SINCE GRAPHQL ALLOWS DYNAMIC RESOLVE OF THIS INFO)
      // await User.findByIdAndUpdate(userId, {
      //   $push: { myLists: newList._id }
      // });

      return newList;
    },
    updateUserList: async (_: any, args: { input: { id: string; name?: string; visible?: boolean } }): Promise<IList | null> => {
      const { id, name, visible } = args.input;

      const updatedList = await List.findByIdAndUpdate(
        id,
        {
          ...(name !== undefined && { name }),
          ...(visible !== undefined && { visible })
        },
        { new: true }
      );

      return updatedList;
    },
    addBookToUserList: async (_: any, args: { input: { id: string; bookId: string } }): Promise<IList | null> => {
      const { id, bookId } = args.input;

      const updatedList = await List.findByIdAndUpdate(
        id,
        {
          $addToSet: { items: new Types.ObjectId(bookId) } // avoids duplicates
        },
        { new: true }
      );

      return updatedList;
    },
    removeBookFromUserList: async (_: any,  args: { input: { id: string; bookId: string } }): Promise<IList | null> => {
      const { id, bookId } = args.input;

      const updatedList = await List.findByIdAndUpdate(
        id,
        {
          $pull: { items: new Types.ObjectId(bookId) }
        },
        { new: true }
      );

      return updatedList;
    },
    deleteUserList: async (_: any,  args: { id: string }): Promise<IList | null> => {
      const list = await List.findById(args.id);
      if (!list) return null;

      await List.deleteOne({ _id: args.id });

      // Optionally remove from user's myLists(SAME RESOLVER CONSCLUSION)
      // await User.findByIdAndUpdate(list.author, {
      //   $pull: { myLists: list._id }
      // });

      return list;
    },


    createUserReview: async (_: any, args: { input: { userId: string; bookId: string; text: string; rating: number } }): Promise<IReview> => {
      const { userId, bookId, text, rating } = args.input;

      // Check if review already exists
      const existingReview = await Review.findOne({
        author: userId,
        book: bookId
      });
      if (existingReview) throw new Error("User has already reviewed this book.");

      const newReview = await Review.create({
        author: new Types.ObjectId(userId),
        book: new Types.ObjectId(bookId),
        text,
        rating
      });
      // no need to manual update user.reviewed or book.reviews

      return newReview;
    },
    updateUserReview: async (_: any, args: { input: { id: string; text?: string; rating?: number } }): Promise<IReview | null> => {
      const { id, text, rating } = args.input;

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
          ...(text !== undefined && { text }),
          ...(rating !== undefined && { rating })
        },
        { new: true }
      );

      return updatedReview;
    },
    deleteUserReview: async (_: any, args: { id: string }): Promise<IReview | null> => {
      const review = await Review.findById(args.id);
      if (!review) return null;

      await Review.deleteOne({ _id: args.id });
      // no need to manual update user.reviewed

      return review;
    },

    createBook: async (_: any,  args: { input: { author: string; title: string; genre: Genre.Genre, summary: string; date: string; adapted?: boolean } }): Promise<IBook> => {
      const { author, title, genre, summary, date, adapted } = args.input;

      const newBook = await Book.create({
        author,
        title,
        genre,
        genres: [genre], // You can expand this later
        summary,
        date: new Date(date),
        adapted: adapted ?? false,
        aliases: [],
        reviews: []
      });

      return newBook;
    },
    updateBook: async (_: any,  args: { input: Partial<IBook> & { id: string } }): Promise<IBook | null> => {
      const { id, ...updates } = args.input;

      if (updates.date) updates.date = new Date(updates.date);

      const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true });
      return updatedBook;
    },
    deleteBook: async (_: any, args: { id: string }): Promise<IBook | null> => {
      const book = await Book.findById(args.id);
      if (!book) return null;

      await Review.deleteMany({ book: book._id }); // clean up reviews
      await Book.deleteOne({ _id: args.id });
      return book;
    },


    createUser: async (_: any,  args: { input: { name: string; about?: string } }): Promise<IUser> => {
      const { name, about } = args.input;

      const newUser = await User.create({
        name,
        about: about ?? abouts[randomIndex(abouts.length)],
        avatar: '',
        favourites: [],
        added: [],
        reviewed: [],
        myReviews: [],
        myLists: [],
        following: []
      });

      return newUser;
    },
    updateUserName: async (_: any,  args: { input: { id: string; name: string } }): Promise<IUser | null> => {
      const { id, name } = args.input;
      return await User.findByIdAndUpdate(id, { name }, { new: true });
    },
    updateUserAbout: async (_: any, args: { input: { id: string; about: string } }): Promise<IUser | null> => {
      const { id, about } = args.input;
      return await User.findByIdAndUpdate(id, { about }, { new: true });
    },
    updateUserAvatar: async (_: any,  args: { id: string; avatarUrl: string }): Promise<IUser | null> => await User.findByIdAndUpdate(args.id, { avatar: args.avatarUrl }, { new: true }),
    addBookToUser: async (_: any, args: { input: { userId: string; bookId: string; dest: BookListType.BookListType } }): Promise<IBook | null> => {
      const { userId, bookId, dest } = args.input;

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const book = await Book.findById(bookId);
      if (!book) throw new Error("Book not found");

      switch (dest) {
        case "FAVOURITE":
          if (!user.favourites.includes(book._id as Types.ObjectId)) user.favourites.push(book._id as Types.ObjectId);
          break;
        case "ADDED":
          if (!user.added.includes(book._id as Types.ObjectId)) user.added.push(book._id as Types.ObjectId);
          break;
        case "REVIEWED":
          throw new Error("Use createUserReview to mark a book as reviewed.");
        default:
          throw new Error("Invalid destination");
      }

      await user.save();
      return book;
    },
    removeBookFromUser: async (_: any, args: { input: { userId: string; bookId: string; dest: BookListType.BookListType } }): Promise<IBook | null> => {
      const { userId, bookId, dest } = args.input;

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const book = await Book.findById(bookId);
      if (!book) throw new Error("Book not found");

      switch (dest) {
        case "FAVOURITE":
          user.favourites = user.favourites.filter(id => id.toString() !== bookId);
          break;
        case "ADDED":
          user.added = user.added.filter(id => id.toString() !== bookId);
          break;
        case "REVIEWED":
          throw new Error("Use deleteUserReview to remove user review.");
        default:
          throw new Error("Invalid destination");
      }

      await user.save();
      return book;
    },
    deleteUser: async (_: any, args: { id: string }): Promise<IUser | null> => {
      const user = await User.findById(args.id);
      if (!user) return null;

      // Delete user's reviews
      await Review.deleteMany({ author: user._id });

      // Delete user's lists
      await List.deleteMany({ author: user._id });

      // Optionally: remove this user from other users' following lists
      await User.updateMany(
        { following: user._id },
        { $pull: { following: user._id } }
      );

      await User.deleteOne({ _id: user._id });
      return user;
    },

  }
};
