

export interface User{
  id: string,
  name: string,
  about: string,
  favourites: string[],
  added: string[],
  reviewed: string[],
  myReviews: string[],
  myLists: string[],
  following: string[]
}

const allUsers : User[] =  [
    {
      "id": "u1",
      "name": "David",
      "about": "GraphQL explorer and literature lover.",
      "favourites": ["b1", "b3"],
      "added": ["b1", "b2", "b3"],
      "reviewed": ["b1", "b3"],
      "myReviews": ["r1", "r2"],
      "myLists": ["l1"],
      "following":[],
    },
    {
      "id": "u2",
      "name": "Alex",
      "about": "Fan of dystopian fiction and Shakespeare.",
      "favourites": ["b4", "b5"],
      "added": ["b4", "b5"],
      "reviewed": ["b4"],
      "myReviews": ["r3"],
      "myLists": ["l2"],
      "following": ["u1"]
    }
  ]


module.exports = {allUsers}