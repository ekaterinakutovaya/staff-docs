import { createAsyncThunk } from "@reduxjs/toolkit";
import companyService from "../../api/company.service";
import { setMessage } from "../slices/message";
import { Company, CompanyDetails, CurrentCompany } from "../types";

type CurrentCompanyParams = {
    id: number;
    sub: string;
}

type CreateCompanyParams = {
    values: CompanyDetails;
    sub: string;
}

type createCompanyDetailsParams = {
    values: any;
    companyId: number;
}
type fetchCompaniesParams = {
    sub: string | null;
}
type DeleteCompanyByIdParams = {
    companyId: number;
    sub: string;
}
type DeleteCompanyDetailsByIdParams = {
    companyDetailsId: number;
    sub: string;
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
            return thunkAPI.rejectWithValue(error.response?.data);
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
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const createCompanyDetails = createAsyncThunk<CompanyDetails[], createCompanyDetailsParams>(
    "companies/createCompanyDetails",
    async (params, thunkAPI) => {
        const {values, companyId} = params;
        try {
            const response = await companyService.createCompanyDetails({values, companyId});
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


export const deleteCompanyById = createAsyncThunk <Company[], DeleteCompanyByIdParams>(
    "companies/deleteCompanyById",
    async (params, thunkAPI) => {
        const {companyId, sub} = params;
        try {
            if (sub === 'demo') {
                return companyId;
            }
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
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const deleteCompanyDetailsById = createAsyncThunk<CompanyDetails[], DeleteCompanyDetailsByIdParams>(
    "companies/deleteCompanyDetailsById",
    async (params, thunkAPI) => {
        const { companyDetailsId, sub } = params;
        try {
            if (sub === 'demo') {
                return companyDetailsId;
            }
            const response = await companyService.deleteCompanyDetailsById(companyDetailsId);
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