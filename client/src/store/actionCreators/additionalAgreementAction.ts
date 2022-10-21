import { createAsyncThunk } from "@reduxjs/toolkit";
import additionalAgreementService from "../../api/additionalAgreement.service";
import { setMessage } from "../slices/message";
import { AdditionalAgreement } from "../types";

type FetchAdditionalAgreementsParams = {
    id: number;
}

type DeleteAdditionalAgreementByIdParams = {
    agreementId: number;
}

export const fetchAdditionalAgreements = createAsyncThunk<AdditionalAgreement[], FetchAdditionalAgreementsParams>(
    "additionalAgreements/fetchAdditionalAgreements",
    async (params, thunkAPI) => {
        const {id} = params;
        
        try {
            const response = await additionalAgreementService.fetchAdditionalAgreements(id);
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

export const deleteAdditionalAgreementById = createAsyncThunk<AdditionalAgreement[], DeleteAdditionalAgreementByIdParams>(
    "additionalAgreements/deleteAdditionalAgreementById",
    async (params, thunkAPI) => {
        const { agreementId } = params;
        try {
            const response = await additionalAgreementService.deleteAdditionalAgreementById(agreementId);
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