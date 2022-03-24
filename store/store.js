import redux, { createStore } from "redux";

const appReducer = (
  state = { token: null, rTokenId: null, userObject: null },
  action
) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        token: action.token,
        rTokenId: action.rTokenId,
        userObject: action.rTokenId,
      };
    case "sync":
      return {
        ...state,
        userObject: action.userObject,
        token: action.token,
      };
    case "logout":
      return {
        ...state,
        userObject: null,
        token: null,
        rTokenId: null,
      };
  }
};

const store = createStore(appReducer);

export default store;
