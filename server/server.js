const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
// const routes = require('./routes');

//Require the typeDefs and resolvers for GraphQL
const { typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

//Create an Apollo server with GraphQL
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

//Start the Apollo server
startApolloServer(typeDefs, resolvers);