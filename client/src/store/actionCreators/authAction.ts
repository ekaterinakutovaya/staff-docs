import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../api/auth.service";
import { setMessage } from "../slices/message";

interface Auth {
    given_name: string;
    picture: string;
    sub: string;
    token?: string;
}


export const auth = createAsyncThunk(
    "auth/auth",
    async ({given_name, picture, sub, token}:Auth, thunkAPI) => {
        try {
            const response = await AuthService.auth({ given_name, picture, sub, token });
            thunkAPI.dispatch(setMessage(response.data.message));
            localStorage.setItem("user", JSON.stringify(token));            
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

export const logout = createAsyncThunk("auth/logout", async () => {
    AuthService.logout();
});