
export interface Review{
  id:string,
  author:string,
  text:string,
  rating:number
}

const allReviews : Review[]= [
    {
      "id": "r1",
      "author": "u1",
      "text": "Haunting and thought-provoking.",
      "rating": 4.5
    },
    {
      "id": "r2",
      "author": "u1",
      "text": "Dark, poetic, and unsettling.",
      "rating": 4.2
    },
    {
      "id": "r3",
      "author": "u2",
      "text": "Terrifyingly relevant.",
      "rating": 5.0
    }
  ]

export default allReviews;