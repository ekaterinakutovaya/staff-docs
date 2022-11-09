import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrderById } from "../actionCreators/orderAction";
import { Order } from "../types";

interface OrderSliceState {
    orders: Order[];
    loading: boolean;
}

const initialState: OrderSliceState = {
    orders: [],
    loading: false
}

const OrderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders(state, action: PayloadAction<Order[]>) {
            state.loading = false;
            state.orders = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.orders = [];
        });
        builder.addCase(deleteOrderById.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter((order) => order.id !== Number(action.payload));
        });
    },
});

export const { setOrders } = OrderSlice.actions;
export default OrderSlice.reducer;