import storage from "redux-persist/lib/storage";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { useDispatch } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import resetState from './slices/authSlice';
import companyReducer from './slices/companySlice';
import employeeReducer from './slices/employeeSlice';
import contractReducer from './slices/contractSlice';
import additionalAgreementReducer from './slices/additionalAgreementSlice';
import orderReducer from './slices/orderSlice';
import sideBarReducer from './slices/sideBarSlice';
import messageReducer from "./slices/message";



const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['auth']
}

const appReducer = combineReducers({
    auth: authReducer,
    companies: companyReducer,
    employees: employeeReducer,
    contracts: contractReducer,
    additionalAgreements: additionalAgreementReducer,
    orders: orderReducer,
    message: messageReducer,
    sideBar: sideBarReducer
});

const rootReducer = (state:any, action:any) => {
    if (action.type === 'auth/logout/fulfilled') {
        storage.removeItem('persist:root')
        state = {};
    }
    if (action.type === 'companies/deleteCompanyById/fulfilled') {
        state.employees = {employees: [], loading: false};
        state.contracts = {contracts: [], loading: false};
        state.additionalAgreements = { additionalAgreements: [], loading: false};
        state.orders = { orders: [], loading: false};
    }
    return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
