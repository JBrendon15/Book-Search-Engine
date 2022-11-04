const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me(userId: ID!): User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(): User
    removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;