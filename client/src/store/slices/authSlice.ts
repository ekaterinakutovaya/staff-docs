import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { auth, logout } from "../actionCreators/authAction";
import jwt_decode from "jwt-decode";
import { User, JwtPayloadToken } from "../types";

interface AuthState {
    user: string | '';
    isAuth: boolean;
    sub: string | '';
    picture: string | '';
}

const user = JSON.parse(localStorage.getItem("user"));
let sub:string;
let picture:string;

if (user) {
    const decoded = jwt_decode<JwtPayloadToken>(user);
    sub = decoded.sub;
    picture = decoded.picture;
}

const initialState: AuthState = user
    ? { isAuth: true, user, sub, picture }
    : { isAuth: false, user: null, sub: null, picture: null };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsAuth(state, action: PayloadAction<User>) {
            state.isAuth = true;
            state.sub = action.payload.sub;
            state.picture = action.payload.picture;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(auth.fulfilled, (state, action) => {
            console.log(action.payload);
            
            state.isAuth = true;
            state.sub = action.payload.sub;
            state.picture = action.payload.picture;
        });
        builder.addCase(auth.rejected, (state, action) => {
            state.isAuth = false;
            state.sub = '';
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isAuth = false;
            state.user = null;
            state.sub = '';
        });
    },
});

const { setIsAuth } = authSlice.actions;
export default authSlice.reducer;