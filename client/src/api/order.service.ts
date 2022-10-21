import axios from "axios";
import { API_URL } from "consts/consts";

// const API_URL = 'http://localhost:5000/api';

const createOrder = async ({ values, orderTypeId, employeeId, companyId, contractId, agreementId = null}) => {
    return axios.post(API_URL + "/order/create", {
        values, orderTypeId, employeeId, companyId, contractId, agreementId
    })
        .then((response) => {
            console.log(response);
        });
}

const fetchOrders = async (companyId:number) => {
    return axios.get(API_URL + "/order", { params: { companyId } });
}

const editOrder = async ({ values, orderId, contractId, employeeId }) => {
    return axios.post(API_URL + `/order/edit`, { values, orderId, contractId, employeeId });
}

const editDismissalOrder = async ({ values, orderId }) => {
    return axios.post(API_URL + `/order/edit_dismissal`, { values, orderId });
}

const generateWordDocs = async () => {
    return axios.post(API_URL + "/word/generate");
} 

const deleteOrderById = async (orderId:string) => {
    return axios.post(API_URL + `/order/delete`, { orderId })
}

const createDismissalOrder = async ({ values, orderTypeId, employeeId, contractId, companyId }) => {
    return axios.post(API_URL + "/order/create_dismissal", {
        values, orderTypeId, employeeId, contractId, companyId
    })
        .then((response) => {
            console.log(response);
        });
}

const orderService = {
    createOrder,
    fetchOrders,
    generateWordDocs,
    editOrder,
    deleteOrderById,
    createDismissalOrder,
    editDismissalOrder
};

export default orderService;