import { createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../api/order.service";
import { setMessage } from "../slices/message";
import { Order } from "../types";

type FetchOrderParams = {
    id: number;
}

type DeleteOrderByIdParams = {
    orderId: string;
}

export const fetchOrders = createAsyncThunk<Order[], FetchOrderParams>(
    "orders/fetchOrders",
    async (params, thunkAPI) => {
        const {id} = params;        
        try {
            const response = await orderService.fetchOrders(id);
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

export const deleteOrderById = createAsyncThunk <Order[], DeleteOrderByIdParams>(
    "orders/deleteOrderById",
    async (params, thunkAPI) => {
        const { orderId } = params;
        try {
            const response = await orderService.deleteOrderById(orderId);
            console.log(response);
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