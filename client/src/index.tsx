import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const client = new ApolloClient({ uri: "http://localhost:4000" });

ReactDOM.render(
  <MuiThemeProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
