import React, { useState } from "react";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider
} from "urql";

import { requestPolicyExchange } from "./requestPolicyExchange";
import { offlineExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { Todos } from "./components";

const storage = makeDefaultStorage({
  idbName: "graphcache-v3", // The name of the IndexedDB database
  maxAge: 7 // The maximum age of the persisted data in days
});

const cache = offlineExchange({
  storage
});

const client = createClient({
  url: "https://0ufyz-4000.sse.codesandbox.io",
  exchanges: [
    dedupExchange,
    requestPolicyExchange({
      ttl: 5 * 1000,
      shouldUpgrade: (op) => {
        console.log('upgrading', op);
        return true;
      }
    }),
    cache,
    fetchExchange
  ],
  requestPolicy: "cache-first"
});

const App = () => {
  const [showTodos, setShowTodos] = useState(false);
  const toggleTodos = () => {
    setShowTodos((previousValue) => !previousValue);
  };

  return (
    <Provider value={client}>
      <main>
        <button onClick={toggleTodos}>Toggle todos</button>
        {showTodos ? <Todos /> : null}
      </main>
    </Provider>
  );
};

export default App;
