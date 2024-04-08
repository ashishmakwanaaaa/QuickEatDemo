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
import paymentReducers, {
  initialStateTypeForPayment,
} from "./paymentSlice/paymentReducers";
import orderReducers, {
  initialStateTypeForOrder,
} from "./orderSlice/orderReducers";

const rootReducers: Reducer<{
  item: initialStateTypeForItems;
  category: initialStateTypeForCategory;
  customer: initialStateTypeForCustomer;
  payment: initialStateTypeForPayment;
  order: initialStateTypeForOrder;
}> = combineReducers({
  item: itemReducer,
  category: categoryReducers,
  customer: customerReducers,
  payment: paymentReducers,
  order: orderReducers,
});

export default rootReducers;
export type payment = ReturnType<typeof rootReducers>;
