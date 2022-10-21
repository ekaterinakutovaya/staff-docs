import { createAsyncThunk } from "@reduxjs/toolkit";
import contractService from "../../api/contract.service";
import { setMessage } from "../slices/message";
import { Contract } from "../types";

type FetchContractParams = {
    id: number;
}

type DeleteContractByIdParams = {
    contractId: number;
}

type CancelDismissalParams = {
    contractId: number;
}

export const fetchContracts = createAsyncThunk<Contract[], FetchContractParams>(
    "contracts/fetchContracts",
    async (params, thunkAPI) => {
        const {id} = params;
        
        try {
            const response = await contractService.fetchContracts(id);
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

export const deleteContractById = createAsyncThunk <Contract[], DeleteContractByIdParams>(
    "contracts/deleteContractById",
    async (params, thunkAPI) => {
        const { contractId } = params;
        try {
            const response = await contractService.deleteContractById(contractId);
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

export const cancelDismissal = createAsyncThunk<Contract[], CancelDismissalParams>(
    "contracts/cancelDismissal",
    async (params, thunkAPI) => {
        const { contractId } = params;

        try {
            const response = await contractService.cancelDismissal({contractId});
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