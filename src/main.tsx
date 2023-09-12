import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { cache } from "./cache.ts";
import { Toaster } from "react-hot-toast";

//Apollo client initilization
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: import.meta.env.VITE_GRAPHQL_DATABASE_URL,
});

//Find our rootElement or throw and error if it doesn't exist
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Passed the ApolloClient instance to ApolloProvider */}
    <ApolloProvider client={client}>
      <Toaster />
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
