import * as React from "react";
import { compose, graphql, MutationFunc, ChildProps } from "react-apollo";
import { gql } from "apollo-boost";
import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";
import Checkbox from "material-ui/Checkbox";
import X from "material-ui/svg-icons/navigation/close";

import Form from "./Form";
import { todos } from "./__generated__/todos";
import { createTodo } from "./__generated__/createTodo";
import { deleteTodo } from "./__generated__/deleteTodo";
import { updateComplete } from "./__generated__/updateComplete";

interface Props {
  createTodo: MutationFunc<createTodo>;
  deleteTodo: MutationFunc<deleteTodo>;
  updateComplete: MutationFunc<updateComplete>;
}

const todosQuery = gql`
  query todos {
    todos {
      id
      text
      complete
    }
  }
`;

class App extends React.Component<ChildProps<Props, todos>> {
  deleteTodo = async (id: string) => {
    await this.props.deleteTodo({
      variables: { id },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }
        // Read the data from our cache for this query.
        const todoData = store.readQuery<todos>({ query: todosQuery });
        if (todoData === null) {
          return null;
        }
        todoData.todos = (todoData.todos || []).filter(x => x.id !== id);
        return store.writeQuery({ query: todosQuery, data: todoData });
      }
    });
  };

  submit = async (text: string) => {
    await this.props.createTodo({
      variables: { text },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }
        // Read the data from our cache for this query.
        const todoData = store.readQuery<todos>({ query: todosQuery });
        if (todoData === null) {
          return null;
        }
        (todoData.todos || []).push(data.createTodo);
        return store.writeQuery({ query: todosQuery, data: todoData });
      }
    });
  };

  updateTodo = (id: string, complete: boolean) => {
    this.props.updateComplete({
      variables: { id, complete },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }
        // Read the data from our cache for this query.
        const todoData = store.readQuery<todos>({ query: todosQuery });
        if (todoData === null) {
          return null;
        }
        todoData.todos = (todoData.todos || []).map(
          x => (x.id === id ? { ...x, complete } : x)
        );
        return store.writeQuery({ query: todosQuery, data: todoData });
      }
    });
  };

  public render() {
    const { data } = this.props;

    if (!data || data.loading) {
      return null;
    }

    return (
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto", width: 400 }}>
          <Form submit={this.submit} />
          <Paper zDepth={1}>
            <List>
              {(data.todos || []).map((x, i) => (
                <ListItem
                  leftCheckbox={
                    <Checkbox
                      checked={x.complete}
                      // tslint:disable-next-line:jsx-no-lambda
                      onCheck={(_, checked) => this.updateTodo(x.id, checked)}
                    />
                  }
                  key={`todo-${x.id}`}
                  primaryText={x.text}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.updateTodo(x.id, !x.complete)}
                  // tslint:disable-next-line:jsx-no-lambda
                  rightIcon={<X onClick={() => this.deleteTodo(x.id)} />}
                />
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

const createTodoMutation = gql`
  mutation createTodo($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

const updateCompleteMutation = gql`
  mutation updateComplete($id: ID!, $complete: Boolean!) {
    updateComplete(id: $id, complete: $complete)
  }
`;

const deleteTodoMutation = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export default compose(
  graphql(createTodoMutation, { name: "createTodo" }),
  graphql(updateCompleteMutation, { name: "updateComplete" }),
  graphql(deleteTodoMutation, { name: "deleteTodo" }),
  graphql(todosQuery)
)(App);
