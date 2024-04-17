import { GETDATATOEDITH, RESETDATATOEDITH, SETDATATOEDITH } from "../types";

const initialState = {};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case SETDATATOEDITH: {
      return action.payload;
    }
    case GETDATATOEDITH:
      return state;
    case RESETDATATOEDITH:
      return initialState;
    default:
      return state;
  }
}
