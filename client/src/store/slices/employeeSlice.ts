import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchEmployees, deleteEmployeeById, setEmployed } from "../actionCreators/employeeAction";
import { Employee } from "../types";

interface EmployeeSliceState {
    employees: Employee[];
    loading: boolean;
}

const initialState: EmployeeSliceState = {
    employees: [],
    loading: false
}

const employeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        setEmployees(state, action: PayloadAction<Employee[]>) {
            state.loading = false;
            state.employees = action.payload;
        },
        deleteEmployeeByIdDemo(state, action) {
            state.employees = state.employees.filter((emp) => emp.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEmployees.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.employees = action.payload;
        });
        builder.addCase(fetchEmployees.rejected, (state, action) => {
            state.loading = false;
            state.employees = [];
        });
        builder.addCase(deleteEmployeeById.fulfilled, (state, action) => {
            state.loading = false;
            state.employees = state.employees.filter((emp) => emp.id !== action.payload);
        });
        builder.addCase(deleteEmployeeById.rejected, (state, action) => {
            state.loading = false;
        });
        builder.addCase(setEmployed.fulfilled, (state, action) => {
            let foundIndex = state.employees.findIndex(employee => employee.id === Number(action.payload))
            state.employees[foundIndex].isEmployed = true;
        });
    },
});

export const { setEmployees, deleteEmployeeByIdDemo } = employeeSlice.actions;
export default employeeSlice.reducer;