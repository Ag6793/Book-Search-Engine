const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
// const bookSchema = require('../models/Book');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find(); 
    },
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },
    
    books: async ( ) => {
      return Book.find();
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId })
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { userId, book }) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: { books: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          _id: bookId
        });
        
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { books: book._id } },
          { new: true }
        );

        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
     
    }
  },
};

module.exports = resolvers;
