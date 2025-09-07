import mongoose, { Document, Schema } from 'mongoose';
import { Genre } from '../../enums/Genre';

export interface IBook extends Document {
  title: string;
  author: string;
  aliases: string[];
  genre: Genre;
  genres: Genre[];
  summary: string;
  date: Date;
  cover?: string;
  adapted: boolean;
  reviews: mongoose.Types.ObjectId[];
}

const BookSchema: Schema<IBook> = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
  },
  aliases: {
    type: [String],
    default: [],
  },
  genre: {
    type: String,
    enum: Object.values(Genre),
    required: true,
  },
  genres: {
    type: [String],
    enum: Object.values(Genre),
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  cover: {
    type: String,
    required: false,
    default: 'https://yourdomain.com/default-cover.png', // ✅ Update this
  },
  adapted: {
    type: Boolean,
    required: false,
    default: false
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: [],
  }],
});

// ✅ Add indexes
BookSchema.index({ title: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ genre: 1 });
// Optional text index for fuzzy search
BookSchema.index({ title: 'text', summary: 'text' });

const Book = mongoose.model<IBook>('Book', BookSchema);
export { Book, IBook }; // 👈 this

