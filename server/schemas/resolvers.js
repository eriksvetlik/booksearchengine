const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // Query: {
  //   me: async (parent, { username }) => {
  //     return User.findOne({ username }).populate("books");
  //   },
  // },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // saveBook: async (parent, { user, body }, context) => {
    //   if (context.user) {
    //     const book = await User.findOneAndUpdate(
    //       { _id: user._id },
    //       { $addToSet: { savedBooks: body } }
    //     );

    //     return { book };
    //   }
    //   throw new AuthenticationError("You need to be logged in!");
    // },
    // removeBook: async (parent, { user, params }, context) => {
    //   if (context.user) {
    //     const user = await User.findOneAndUpdate(
    //       { _id: user._id },
    //       { $pull: { savedBooks: { bookId: params.bookId } } }
    //     );

    //     return { user };
    //   }
    //   throw new AuthenticationError("You need to be logged in!");
    // },
  },
};

module.exports = resolvers;
