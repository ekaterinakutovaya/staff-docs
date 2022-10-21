import { RootState } from "./store";
import { Employee } from "../store/types";

export const selectAuth = (state: RootState) => state.auth;

export const selectCompanies = (state: RootState) => state.companies;
export const selectCurrentCompany = (state: RootState) => state.companies.currentCompany;
export const selectCompanyDetails = (state: RootState) => state.companies.companyDetails;


export const selectEmployees = (state: RootState) => state.employees;
export const selectOrders = (state: RootState) => state.orders;
export const selectContracts = (state: RootState) => state.contracts;
export const selectAdditionalAgreements = (state: RootState) => state.additionalAgreements;

export const selectSidebarItem = (state: RootState) => state.sideBar;