import { combineReducers } from "redux";
import { productReducer } from "./reducers/product.reducer";

export default combineReducers({
  productReducer: productReducer,
});
