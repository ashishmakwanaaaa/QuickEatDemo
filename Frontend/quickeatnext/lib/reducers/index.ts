import { Reducer, combineReducers } from "redux";
import itemReducer, {
  initialStateTypeForItems,
} from "./ItemSlice/itemReducers";
import categoryReducers, {
  initialStateTypeForCategory,
} from "./categorySlice/categoryReducers";
import customerReducers, {
  initialStateTypeForCustomer,
} from "./customerSlice/customerReducers";
import paymentReducers from "./paymentSlice/paymentReducers";

const rootReducers: Reducer<{
  item: initialStateTypeForItems;
  category: initialStateTypeForCategory;
  customer: initialStateTypeForCustomer;
  payment: any;
}> = combineReducers({
  item: itemReducer,
  category: categoryReducers,
  customer: customerReducers,
  payment: paymentReducers,
});

export default rootReducers;
