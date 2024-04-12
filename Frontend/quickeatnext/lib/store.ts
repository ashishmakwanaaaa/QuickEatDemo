import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import rootReducers from "./reducers";
import storage from "redux-persist/lib/storage";

const persissConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persissConfig, rootReducers);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);
export { store, persistor };
