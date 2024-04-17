import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import actualUserReducer from "./actualUserReducer";

const reducer = combineReducers ({
    data: dataReducer,
    actualUser: actualUserReducer,
});

export default reducer;