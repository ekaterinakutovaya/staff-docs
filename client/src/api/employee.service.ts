import axios from "axios";
import { Employee } from "store/types";
import { API_URL } from "consts/consts";

const createEmployee = async (values: Employee, companyId: number) => {
    return axios.post(API_URL + "/employee/create", {values, companyId});
}

const fetchEmployees = async (companyId: number) => {
    return axios.get(API_URL + "/employee", { params: {companyId} })
    
}

const editEmployee = async (values: Employee, id: number) => {
    return axios.post(API_URL + `/employee/edit`, { values, id });
}

const setEmployed = async (employeeId:number) => {
    return axios.post(API_URL + `/employee/set_employed`, { employeeId });
}

const deleteEmployeeById = async (id: number) => {
    return axios.post(API_URL + `/employee/delete`, { id })
}

const employeeService = {
    createEmployee,
    fetchEmployees,
    editEmployee,
    deleteEmployeeById,
    setEmployed
};

export default employeeService;