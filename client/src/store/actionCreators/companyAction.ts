import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../api/auth.service";
import companyService from "../../api/company.service";
import { setMessage } from "../slices/message";
import { Company, CompanyDetails, CurrentCompany } from "../types";
import { useAppDispatch } from "store/store";

type CurrentCompanyParams = {
    id: number;
    sub: string;
}

type CreateCompanyParams = {
    values: CompanyDetails;
    sub: string;
}

export type InsertChangesParams = {
    values: any;
    companyId: number;
}
export type fetchCompaniesParams = {
    sub: string | null;
}
export type DeleteCompanyByIdParams = {
    companyId: number;
}
export type DeleteCompanyDetailsByIdParams = {
    companyDetailsId: number;
}
type CompanyDetailsParams = {
    companyId: number;
}


export const createCompany = createAsyncThunk<CompanyDetails, CreateCompanyParams>(
    "company/create",
    async (params, thunkAPI) => {
        const {values, sub} = params;
        try {
            const response = await companyService.createCompany(values, sub)
            thunkAPI.dispatch(setMessage(response.data.message));
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const fetchCompanies = createAsyncThunk<Company[], fetchCompaniesParams>(
    "companies/fetchCompanies",
    async (params, thunkAPI) => {
        const {sub} = params;        
        try {
            const response = await companyService.fetchCompanies( sub );
            thunkAPI.dispatch(setMessage(response.data.message));

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const setCurrentCompany = createAsyncThunk<CurrentCompany, CurrentCompanyParams>(
    "companies/setCurrentCompany",
    async (params, thunkAPI) => {
        const { id, sub } = params;
        try {
            const response = await companyService.setCurrentCompany(id, sub);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)

export const fetchCompanyDetails = createAsyncThunk<CompanyDetails[], CompanyDetailsParams>(
    "companyDetails/fetchCompanyDetails",
    async (params, thunkAPI) => {
        const { companyId } = params;
        try {
            const response = await companyService.fetchCompanyDetails(companyId);
            thunkAPI.dispatch(setMessage(response.data.message));

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)

export const insertCompanyChanges = createAsyncThunk<CompanyDetails[], InsertChangesParams>(
    "companies/insertCompanyChanges",
    async (params, thunkAPI) => {
        const {values, companyId} = params;
        try {
            const response = await companyService.insertCompanyChanges({values, companyId});
            thunkAPI.dispatch(setMessage(response.data.message));
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)


export const deleteCompanyById = createAsyncThunk <Company[], DeleteCompanyByIdParams>(
    "companies/deleteCompanyById",
    async (params, thunkAPI) => {
        const {companyId} = params;
        try {
            const response = await companyService.deleteCompanyById(companyId);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)

export const deleteCompanyDetailsById = createAsyncThunk<CompanyDetails[], DeleteCompanyDetailsByIdParams>(
    "companies/deleteCompanyDetailsById",
    async (params, thunkAPI) => {
        const { companyDetailsId } = params;
        try {
            const response = await companyService.deleteCompanyDetailsById(companyDetailsId);
            console.log(response);
            thunkAPI.dispatch(setMessage(response.data.message));

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)