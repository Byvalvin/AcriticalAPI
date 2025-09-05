import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for List
export interface IList extends Document {
  author: mongoose.Types.ObjectId;
  name: string;
  visible: boolean;
  items: mongoose.Types.ObjectId[];
}

// Mongoose Schema
const ListSchema: Schema<IList> = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
    default: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: [],
  }],
});

const List = mongoose.model<IList>('List', ListSchema);
export default List;
