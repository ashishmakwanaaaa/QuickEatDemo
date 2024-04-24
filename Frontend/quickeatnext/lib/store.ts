import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import rootReducers from "./reducers";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";

const persissConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persissConfig, rootReducers);
const store = configureStore({ reducer: persistedReducer });
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
const persistor = persistStore(store);
export { store, persistor };
