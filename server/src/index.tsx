import { GraphQLServer } from "graphql-yoga";
import { Typegoose, prop } from "typegoose";
import mongoose from "mongoose";
import "reflect-metadata";

mongoose.connect("mongodb://localhost/test");

class Todo extends Typegoose {
  @prop() text: string = "";
  @prop({ default: false })
  complete: boolean = false;
}

const TodoModel = new Todo().getModelForClass(Todo);

const typeDefs = `
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Query {
    hello(name: String): String!
    todos: [Todo!]
  }
  type Mutation {
    createTodo(text: String!): Todo!
    updateComplete(id: ID!, complete: Boolean!): Boolean!
    deleteTodo(id: ID!): Boolean!
  }
`;

interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: any, info: any) => any;
  };
}

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    todos: async () => {
      const todos = await TodoModel.find();
      console.log(todos);
      return todos;
    }
  },
  Mutation: {
    createTodo: async (_, args) => {
      const todo = new TodoModel(args);
      await todo.save();
      console.log(todo);
      return todo;
    },
    updateComplete: async (_, { id, complete }) => {
      await TodoModel.findByIdAndUpdate(id, { complete });
      return true;
    },
    deleteTodo: async (_, { id }) => {
      await TodoModel.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

mongoose.connection.on("open", () => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
