import axios from "axios";
import { API_URL } from "consts/consts";

// const API_URL = 'http://localhost:5000/api';

const createContract = async ({ values, position, companyId, employeeId}) => {
    return axios.post(API_URL + "/contract/create", {
        values, position, companyId, employeeId
    })
}

const fetchContracts = async (companyId:number) => {
    return axios.get(API_URL + "/contract", { params: { companyId } });
}

const editContract = async ({ values, position, contractId, employeeId }) => {
    return axios.post(API_URL + `/contract/edit`, { values, position, contractId, employeeId });
}

const deleteContractById = async (contractId:number) => {
    return axios.post(API_URL + `/contract/delete`, { contractId })
}

const cancelContract = async ({ dismissalDate, employeeId }) => {
    return axios.post(API_URL + "/contract/cancel", {
        dismissalDate, employeeId
    })
}

const cancelDismissal = async ({ contractId }) => {
    return axios.post(API_URL + "/contract/cancel_dismissal", {
        contractId
    })
}

const contractService = {
    createContract,
    fetchContracts,
    editContract,
    deleteContractById,
    cancelContract,
    cancelDismissal
};

export default contractService;