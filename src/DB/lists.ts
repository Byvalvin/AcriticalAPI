export interface List {
  id: string,
  name: string,
  public: boolean,
  items: string[]
}

const allLists : List[] = [
    {
      "id": "l1",
      "name": "David's Existential Picks",
      "public": true,
      "items": ["b1", "b3"]
    },
    {
      "id": "l2",
      "name": "Alex's Dystopia & Drama",
      "public": false,
      "items": ["b4", "b5"]
    }
]

export default allLists;