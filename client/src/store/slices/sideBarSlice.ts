import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedItem: '/companies'
}

const sideBarSlice = createSlice({
    name: "sideBar",
    initialState,
    reducers: {
        setSelectedItem(state, action) {
            state.selectedItem = action.payload;
        }
    }
});

export const {setSelectedItem} = sideBarSlice.actions;
export default sideBarSlice.reducer;