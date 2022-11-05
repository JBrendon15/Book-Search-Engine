const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            return User.findOne({ _id: context.user._id });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password}, context) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            console.log(`Context from adduser: ${context}`)
            return { token, user };
        },
        login: async(parent, { email, password}, context) => {
            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('No user found with this email.');
            }

            const correctPw = await user.isCorrectPassword(password);
            
            if(!correctPw) {
                throw new AuthenticationError('Wrong Password.');
            }

            const token = signToken(user);
            console.log(`Context from login: ${context.user}`)
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.favoriteBook } },
                { new: true, runValidators: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError("You need to be logged in!");
          },
        removeBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                {
                    $pull: { savedBooks: {bookId: bookId }}
                },
                { new: true }
            );
            return updatedUser;
        },
    },
};

module.exports = resolvers; 