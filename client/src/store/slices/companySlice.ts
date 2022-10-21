import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCompany, fetchCompanies,
    fetchCompanyDetails, 
    setCurrentCompany, 
    deleteCompanyById, 
    deleteCompanyDetailsById
 } from "../actionCreators/companyAction";
import { CompanySliceState, Company, CompanyDetails, CurrentCompany } from "../types";


const initialState: CompanySliceState = {
    companies: [],
    currentCompany: {},
    companyDetails: [],
    loading: false
}

const companySlice = createSlice({
    name: "companies",
    initialState,
    reducers: {
        setCompanies(state, action: PayloadAction<Company[]>) {
            state.companies = action.payload;
            state.currentCompany = action.payload.filter(comp => comp.isCurrent === true)[0];
        },
        setCompanyDetails(state, action: PayloadAction<CompanyDetails[]>) {
            state.companyDetails = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createCompany.pending, (state, action) => {
            state.loading = true;
            state.currentCompany = {};
        });
        builder.addCase(createCompany.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCompany = {};
            if (action.payload.isCurrent) {
                state.currentCompany = action.payload;
            }
        });
        builder.addCase(createCompany.rejected, (state, action) => {
            state.loading = false;
            state.currentCompany = {};
        });
        builder.addCase(fetchCompanies.pending, (state, action) => {
            state.loading = true;
            state.companies = [];
            state.currentCompany = {};
        });
        builder.addCase(fetchCompanies.fulfilled, (state, action) => {
            state.companies = action.payload;
            state.currentCompany = action.payload.filter(comp => comp.isCurrent === true)[0];
            state.loading = false;
        });
        builder.addCase(fetchCompanies.rejected, (state, action) => {
            state.loading = false;
            state.companies = [];
        });
        builder.addCase(fetchCompanyDetails.pending, (state, action) => {
            state.loading = true;
            state.companyDetails = [];
        });
        builder.addCase(fetchCompanyDetails.fulfilled, (state, action) => {
            state.companyDetails = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchCompanyDetails.rejected, (state, action) => {
            state.loading = false;
            state.companyDetails = [];
        });

        builder.addCase(setCurrentCompany.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(setCurrentCompany.fulfilled, (state, action) => {
            state.companies = state.companies
                .map((company) => company.id !== action.payload.id
                    ? { ...company, isCurrent: false } : { ...company, isCurrent: true }
                )
            state.currentCompany = action.payload;
        });

        builder.addCase(deleteCompanyById.fulfilled, (state, action) => {
            state.loading = false;
            state.companies = state.companies.filter((comp) => comp.id !== +action.payload);
            if (state.companies.length === 0) {
                state.currentCompany = {};
            }
            if (state.currentCompany.id === +action.payload) {
                state.currentCompany = {};
            }
        });
        builder.addCase(deleteCompanyDetailsById.fulfilled, (state, action) => {
            state.loading = false;
            state.companyDetails = state.companyDetails.filter((details) => details.id !== +action.payload);
        });
    }
});


export const { setCompanies, setCompanyDetails } = companySlice.actions;

export default companySlice.reducer;