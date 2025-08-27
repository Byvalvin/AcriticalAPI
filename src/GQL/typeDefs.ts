import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Review{
    id: ID!
    author: User!
    book: Book!
    text: String!
    rating: Float
  }

  type List{
    id: ID!
    author: User!
    name: String!
    public: Boolean!
    items: [Book!]!
  }


  type Book{
    id: ID!
    author: String!
    title: String!
    aliases: [String!]
    genre: Genre!
    genres: [Genre!]
    summary: String
    date: String!
    adapted: Boolean
    reviews: [Review!]
  }

  type User{
    id: ID!
    name: String!
    about: String
    favourites: [Book!]
    added: [Book!]
    reviewed: [Book!]
    myReviews: [Review!]
    myLists: [List!]
    following: [User!]
  }


  type Query {
    hello: String

    users: [User!]
    user(id: ID!): User

    books(
      author: String, title: String,
      genre: Genre, date: String,
      adapted: Boolean
    ): [Book!]
    book(title: String!): Book

    lists(userId:String!): [List!]
    list(listId:String!): List

    reviews(authorId:String, bookId:String): [Review!]
    review(id:ID!): Review
  }
  
 
  input CreateUserInput{
    name: String!
    about: String
  }
  input UpdateUserNameInput{
    id: ID!
    name: String!
  }
  type Mutation{
    createUser(input: CreateUserInput!): User!
    updateUserName(input: UpdateUserNameInput!): User
    deleteUser(id: ID!): User
  }



  enum Genre {
    # Fiction
    Fiction
    LiteraryFiction
    HistoricalFiction
    PhilosophicalFiction
    ScienceFiction
    SpeculativeFiction
    Dystopian
    Utopian
    Fantasy
    MagicalRealism
    Horror
    Gothic
    Mystery
    Thriller
    Crime
    Adventure
    Romance
    Satire
    Comedy
    Tragedy
    ComingOfAge
    Novella
    ShortStory

    # Non-Fiction
    NonFiction
    Biography
    Memoir
    Essay
    Autobiography
    PoliticalPhilosophy
    Psychology
    Sociology
    History
    Religion
    Spirituality
    SelfHelp
    Travel
    Science
    Economics
    Philosophy

    # // Poetry & Drama
    Poetry
    EpicPoetry
    LyricPoetry
    DramaticPoetry
    Play
    Drama

    # // Classical & Canonical
    Classic
    Mythology
    Folklore
    Renaissance
    Modernism
    Postmodernism
    Existentialism
    Absurdism
    Romanticism
    Realism
    Naturalism
    Surrealism

    # // Children's & YA
    Childrens
    YoungAdult
    FairyTale
    Fable

    # // Other
    Allegory
    Anthology
    GraphicNovel
    Experimental
    Colonialism
    PoliticalFiction
    LegalDrama
    Bildungsroman
  }
`;
