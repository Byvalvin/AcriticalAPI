import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for the Review document
export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  text: string;
  rating: number;
}

// Mongoose Schema for Review
const ReviewSchema: Schema<IReview> = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    set: (v: number) => Math.round(v * 100) / 100  // Rounds to 2 decimal places
  },
}, { timestamps: true }); // Add createdAt and updatedAt automatically

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export {Review, IReview};
