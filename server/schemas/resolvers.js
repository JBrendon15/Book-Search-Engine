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
        addUser: async (parent, { username, email, password}) => {
            console.log('reached')
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async(parent, { email, password}) => {
            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('No user found with this email.');
            }

            const correctPw = await user.isCorrectPassword(password);
            
            if(!correctPw) {
                throw new AuthenticationError('Wrong Password.');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { favoriteBook }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                {
                    $addToSet: { savedBooks: favoriteBook },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            return updatedUser;
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