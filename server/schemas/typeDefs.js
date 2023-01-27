//Need to define the necessary `Query` and `Mutation` types

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Book {
    _id: ID
    authors: String
    description: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    books: [Book]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(bookId: ID!): User
    deleteBook(bookId: ID!): User
  }
`;

//addBook(bookId: ID!, authors: String!, description: String!, image: String!, link: String!, title: String!): Book
//saveBookIds
//removeBookId
//addUser -> createUser
//login -> loginUser
//saveBook <- addBook
//deleteBook <-removeBook
module.exports = typeDefs;