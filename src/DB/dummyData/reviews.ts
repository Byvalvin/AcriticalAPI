export interface Review {
  id: string;
  authorId: string;
  bookId: string;
  text: string;
  rating: number;
}

const allReviews: Review[] = [
  {
    id: "r1",
    authorId: "u1",
    bookId: "b1",
    text: "Haunting and thought-provoking.",
    rating: 4.5
  },
  {
    id: "r2",
    authorId: "u1",
    bookId: "b3",
    text: "Dark, poetic, and unsettling.",
    rating: 4.2
  },
  {
    id: "r3",
    authorId: "u2",
    bookId: "b4",
    text: "Terrifyingly relevant.",
    rating: 5.0
  }
];

export default allReviews;