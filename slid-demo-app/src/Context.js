import React, { useReducer, createContext, useContext } from "react";

const initial = [
  {
    url: "test.com",
    time: 1000,
  },
];

/*
    CREATE
*/
function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return state.concat(action.todo);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const StateContext = createContext();
const DispatchContext = createContext();

export function SlidProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </StateContext.Provider>
  );
}

export function useSlidState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("Cannot find StateContext");
  }
  return context;
}

export function useSlidDispatch() {
  return useContext(DispatchContext);
}
