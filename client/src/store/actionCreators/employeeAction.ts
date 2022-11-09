import { createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "../../api/employee.service";
import { setMessage } from "../slices/message";
import { Employee } from "../types";


type FetchEmployeesParams = {
    id: number;
}

type DeleteEmployeeByIdParams = {
    employeeId: number;
    sub: string;
}

export const fetchEmployees = createAsyncThunk<Employee[], FetchEmployeesParams>(
    "employees/fetchEmployees",
    async (params, thunkAPI) => {
        const {id} = params;
        
        try {
            const response = await employeeService.fetchEmployees(id);
            // thunkAPI.dispatch(setMessage(response.data.message));
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

export const deleteEmployeeById = createAsyncThunk<Employee[], DeleteEmployeeByIdParams>(
    "employees/deleteEmployeeById",
    async (params, thunkAPI) => {
        const {employeeId, sub} = params;
        try {
            if (sub === 'demo') {
                return employeeId;
            }
            const response = await employeeService.deleteEmployeeById(employeeId);
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

export const setEmployed = createAsyncThunk(
    "employees/setEmployed",
    async (employeeId: number, thunkAPI) => {
        // console.log(employeeId);
        try {
            const response = await employeeService.setEmployed(employeeId);
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
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)
