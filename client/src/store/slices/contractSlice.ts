import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchContracts, deleteContractById, cancelDismissal } from "../actionCreators/contractAction";
import { Contract } from "../types";

interface ContractSliceState {
    contracts: Contract[];
    loading: boolean;
}

const initialState: ContractSliceState = {
    contracts: [],
    loading: false
}

const contractSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {
        setContracts(state, action: PayloadAction<Contract[]>) {
            state.contracts = action.payload;
            state.loading = false;
        },
        deleteContractByIdDemo(state, action) {
            state.contracts = state.contracts.filter((contract) => contract.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchContracts.pending, (state, action) => {
            state.loading = true;
            state.contracts = [];
        });
        builder.addCase(fetchContracts.fulfilled, (state, action) => {
            state.contracts = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchContracts.rejected, (state, action) => {
            state.loading = false;
            state.contracts = [];
        });
        builder.addCase(cancelDismissal.fulfilled, (state, action) => {
            let foundIndex =  state.contracts.findIndex(contract => contract.id === Number(action.payload))
            state.contracts[foundIndex].dismissalDate = null;
        });
        builder.addCase(deleteContractById.fulfilled, (state, action) => {
            state.loading = false;
            state.contracts = state.contracts.filter((contract) => contract.id !== Number(action.payload));
        });
    },
});

export const { setContracts, deleteContractByIdDemo } = contractSlice.actions;
export default contractSlice.reducer;