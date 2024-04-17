import { RESETACTUALUSER, SETACTUALUSER, UPDATEACTUALUSER } from "../types";

const initialState = [];

export default function actualUserReducer(state = initialState, action) {
  switch (action.type) {
    case SETACTUALUSER: {
      return action.payload;
    }
    case RESETACTUALUSER: {
      return initialState;
    }
    case UPDATEACTUALUSER: {
      return initialState;
    }
    default:
      return state;
  }
}
