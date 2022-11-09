import { RootState } from "./store";

export const selectAuth = (state: RootState) => state.auth;

export const selectCompanies = (state: RootState) => state.companies;
export const selectEmployees = (state: RootState) => state.employees;
export const selectOrders = (state: RootState) => state.orders;
export const selectContracts = (state: RootState) => state.contracts;
export const selectAdditionalAgreements = (state: RootState) => state.additionalAgreements;

export const selectSidebarItem = (state: RootState) => state.sideBar;