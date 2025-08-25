import { Genre } from '../enums/Genre'; // Adjust path as needed

export interface Book {
  id: string;
  author: string;
  title: string;
  aliases: string[];
  genre: Genre;
  genres: Genre[];
  summary: string;
  date: string;
  adapted: boolean;
  reviews: string[]; // These are review IDs
}

const allBooks: Book[] = [
  {
    id: "b1",
    author: "Albert Camus",
    title: "The Stranger",
    aliases: ["L'Étranger"],
    genre: Genre.PhilosophicalFiction,
    genres: [Genre.Existentialism, Genre.Modernism],
    summary: "A detached Algerian man faces the absurdity of life after committing a senseless murder.",
    date: "1942-01-01",
    adapted: true,
    reviews: ["r1"]
  },
  {
    id: "b2",
    author: "Niccolò Machiavelli",
    title: "The Prince",
    aliases: ["Il Principe"],
    genre: Genre.PoliticalPhilosophy,
    genres: [Genre.NonFiction, Genre.Renaissance],
    summary: "A pragmatic guide to power and statecraft.",
    date: "1532-01-01",
    adapted: false,
    reviews: []
  },
  {
    id: "b3",
    author: "Joseph Conrad",
    title: "Heart of Darkness",
    aliases: [],
    genre: Genre.Novella,
    genres: [Genre.Colonialism, Genre.Modernism],
    summary: "A journey into the Congo reveals the darkness within humanity.",
    date: "1899-01-01",
    adapted: true,
    reviews: ["r2"]
  },
  {
    id: "b4",
    author: "George Orwell",
    title: "1984",
    aliases: ["Nineteen Eighty-Four"],
    genre: Genre.Dystopian,
    genres: [Genre.PoliticalFiction, Genre.ScienceFiction],
    summary: "A chilling vision of a totalitarian regime that watches every move.",
    date: "1949-06-08",
    adapted: true,
    reviews: ["r3"]
  },
  {
    id: "b5",
    author: "William Shakespeare",
    title: "MacBeth",
    aliases: [],
    genre: Genre.Tragedy,
    genres: [Genre.Drama, Genre.Classic],
    summary: "A Scottish general's ambition leads to murder and madness.",
    date: "1606-01-01",
    adapted: true,
    reviews: []
  },
  {
  id: "b6",
  author: "William Shakespeare",
  title: "Romeo & Juliet",
  aliases: ["Romeo and Juliet"],
  genre: Genre.Tragedy,
  genres: [Genre.Drama, Genre.Classic, Genre.Romance],
  summary: "Two young lovers from feuding families pursue their passion with tragic consequences.",
  date: "1597-01-01",
  adapted: true,
  reviews: []
}

];

export default allBooks;