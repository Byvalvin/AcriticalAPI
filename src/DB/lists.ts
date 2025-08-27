export interface List {
  id: string,
  authorId: string,
  name: string,
  public: boolean,
  items: string[]
}

const allLists : List[] = [
    {
      "id": "l1",
      "authorId":"u1",
      "name": "David's Existential Picks",
      "public": true,
      "items": ["b1", "b3"]
    },
    {
      "id": "l2",
      "authorId":"u2",
      "name": "Alex's Dystopia & Drama",
      "public": false,
      "items": ["b4", "b5"]
    }
]

export default allLists;