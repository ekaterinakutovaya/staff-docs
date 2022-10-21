import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../api/auth.service";
import { setMessage } from "../slices/message";
import { User } from "../types";

interface Auth {
    given_name: string;
    picture: string;
    sub: string;
    token?: string;
}

type DemoLogin = {
    username: string;
    password: string;
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
            return thunkAPI.rejectWithValue(error.response ?.data);
        }
    }
)

// export const demoLogin = createAsyncThunk<DemoLogin>(
//     "auth/demoLogin",
//     async (params, thunkAPI) => {
//         const {username, password} = params;
//         try {
//             console.log(username, password);
            
//             // const response = await AuthService.register(userName, email, password);
//             // thunkAPI.dispatch(setMessage(response.data.message));
//             // return response.data;
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             thunkAPI.dispatch(setMessage(message));
//             return thunkAPI.rejectWithValue(error.response?.data);
//         }
//     }
// )


// export const register = createAsyncThunk(
//     "auth/register",
//     async ({ userName, email, password }, thunkAPI) => {
//         try {
//             const response = await AuthService.register(userName, email, password);
//             thunkAPI.dispatch(setMessage(response.data.message));
//             return response.data;
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             thunkAPI.dispatch(setMessage(message));
//             return thunkAPI.rejectWithValue();
//         }
//     }
// );


// export const login = createAsyncThunk(
//     "auth/login",
//     async ({ email, password }, thunkAPI) => {
//         try {
//             const data = await AuthService.login(email, password);
//             // console.log(data);
            
//             return { data };
//             // return { user: data };
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             thunkAPI.dispatch(setMessage(message));
//             return thunkAPI.rejectWithValue();
//         }
//     }
// );


export const logout = createAsyncThunk("auth/logout", async () => {
    AuthService.logout();
});