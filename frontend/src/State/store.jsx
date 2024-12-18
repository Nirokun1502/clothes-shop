import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
// import { authReducer } from './Auth/Reducer'
import { cartReducer } from "./Cart/Reducer";
// import { orderReducer } from './Order/Reducer'
import { customerProductReducer } from "./Product/Reducer";
import { orderReducer } from "./Order/Reducer";

const rootReducers = combineReducers({
  // auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  products: customerProductReducer,
});
export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
