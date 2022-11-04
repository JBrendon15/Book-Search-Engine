const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password}) => {
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
        saveBook: async (parent, { userId, book }) => {
            return User.findOneAndUpdate(
                { _id: userId },
                {
                    $addToSet: { savedBooks: book },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        },
        removeBook: async (parent, { userId, book }) => {
            return User.findOneAndUpdate(
                { _id: userId},
                {
                    $pull: { savedBooks: book }
                },
                { new: true }
            );
        },
    },
};

module.exports = resolvers; 