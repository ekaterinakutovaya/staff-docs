import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAdditionalAgreements, deleteAdditionalAgreementById } from "../actionCreators/additionalAgreementAction";
import { AdditionalAgreement } from "../types";

interface AdditionalAgreementSliceState {
    additionalAgreements: AdditionalAgreement[];
    loading: boolean;
}

const initialState: AdditionalAgreementSliceState = {
    additionalAgreements: [],
    loading: false
}

const additionalAgreementSlice = createSlice({
    name: "additionalAgreements",
    initialState,
    reducers: {
        setAdditionalAgreements(state, action: PayloadAction<AdditionalAgreement[]>) {
            state.additionalAgreements = action.payload;
            state.loading = false;
        },
        deleteAdditionalAgreementByIdDemo(state, action) {
            state.additionalAgreements = state.additionalAgreements.filter((agreement) => agreement.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAdditionalAgreements.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchAdditionalAgreements.fulfilled, (state, action) => {
            state.additionalAgreements = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchAdditionalAgreements.rejected, (state, action) => {
            state.loading = false;
            state.additionalAgreements = [];
        });
        builder.addCase(deleteAdditionalAgreementById.fulfilled, (state, action) => {
            state.loading = false;
            state.additionalAgreements = state.additionalAgreements.filter((agreement) => agreement.id !== Number(action.payload));
        });
     
    },
});

export const { setAdditionalAgreements, deleteAdditionalAgreementByIdDemo } = additionalAgreementSlice.actions;
export default additionalAgreementSlice.reducer;