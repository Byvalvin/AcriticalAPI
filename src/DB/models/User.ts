import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface
export interface IUser extends Document {
  name: string;
  about?: string;
  avatar?: string;
  favourites: mongoose.Types.ObjectId[];
  added: mongoose.Types.ObjectId[];
  reviewed: mongoose.Types.ObjectId[];
  myReviews: mongoose.Types.ObjectId[];
  myLists: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

// Schema
const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
    maxlength: 300,
    default: '',
  },
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: [],
  }],
  added: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: [],
  }],
  reviewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: [],
  }],
  myReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: [],
  }],
  myLists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    default: [],
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
});

const User = mongoose.model<IUser>('User', UserSchema);
export {User, IUser};
