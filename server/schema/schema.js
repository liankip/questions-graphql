// Graphql
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLInt,
} = graphql;

// Date
var date = new Date();
const dateStr =
  ("00" + (date.getMonth() + 1)).slice(-2) +
  "-" +
  ("00" + date.getDate()).slice(-2) +
  "-" +
  date.getFullYear() +
  " " +
  ("00" + date.getHours()).slice(-2) +
  ":" +
  ("00" + date.getMinutes()).slice(-2) +
  ":" +
  ("00" + date.getSeconds()).slice(-2);

// Data API
const User = require("../models/user");
const Question = require("../models/question");

// Paginate
const PaginationArgType = new GraphQLInputObjectType({
  name: "PaginationArg",
  fields: {
    skip: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
});

const PaginatedListType = (ItemType) =>
  new GraphQLObjectType({
    name: "Paginated" + ItemType,
    fields: {
      count: { type: GraphQLInt },
      items: { type: new GraphQLList(ItemType) },
    },
  });

// Questions Type
const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: () => ({
    id: { type: GraphQLString },
    question: { type: GraphQLString },
    IsActive: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.uuid);
      },
    },
  }),
});

// Users Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    questions: {
      type: new GraphQLList(QuestionType),
      resolve(parent, args) {
        return Question.find({ uuid: parent.id });
      },
    },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    questions: {
      type: PaginatedListType(QuestionType),
      args: {
        pagination: {
          type: PaginationArgType,
          defaultValue: { skip: 0, limit: 4 },
        },
      },
      resolve: (parent, args) => {
        const { skip, limit } = args.pagination;
        const query = Question.find({ IsActive: 1 }, null, {
          sort: { CreatedBy: 1, UpdatedBy: 1 },
        })
          .skip(skip * limit)
          .limit(limit);

        return {
          items: query,
          count: Question.countDocuments(),
        };
      },
    },

    question: {
      type: QuestionType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Question.findById(args.id);
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation create, update delete for question",
  fields: {
    addQuestion: {
      type: QuestionType,
      args: {
        uuid: { type: GraphQLNonNull(GraphQLString) },
        question: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        if (!args.uuid) return new Error("Not Authorized");

        let addQuestion = new Question({
          uuid: args.uuid,
          question: args.question,
          CreatedAt: dateStr,
          CreatedBy: Date.now(),
          UpdatedAt: dateStr,
          UpdatedBy: Date.now(),
          IsActive: 1,
        });

        return addQuestion.save();
      },
    },

    updateQuestion: {
      type: QuestionType,
      parent: GraphQLList(QuestionType),
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        uuid: { type: GraphQLNonNull(GraphQLString) },
        question: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        if (!args.uuid) return new Error("Not Authorized");

        let updateQuestion = {};
        if (args.question) {
          updateQuestion.question = args.question;
        }

        updateQuestion.UpdatedAt = dateStr;
        updateQuestion.UpdatedBy = Date.now();

        const uQuestion = Question.findByIdAndUpdate(args.id, updateQuestion, {
          new: true,
        });

        if (!uQuestion) return new Error("Unable to update question");

        return uQuestion;
      },
    },

    deleteQuestion: {
      type: QuestionType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        uuid: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        if (!args.uuid) return new Error("Not Authorized");

        const dQuestion = Question.findByIdAndDelete(args.id);

        return dQuestion;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
