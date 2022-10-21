import axios from "axios";
import { API_URL } from "consts/consts";

// const API_URL = 'http://localhost:5000/api';


const createAdditionalAgreement = async ({ values, agreementNo, companyId, employeeId, contractId, prevAgreementId }) => {
    return axios.post(API_URL + "/additional_agreement/create", {
        values, agreementNo, companyId, employeeId, contractId, prevAgreementId
    })
}

const fetchAdditionalAgreements = async (companyId:number) => {
    return axios.get(API_URL + "/additional_agreement", { params: { companyId } });
}

const editAdditionalAgreement = async ({ values, agreementId, employeeId }) => {
    return axios.post(API_URL + `/additional_agreement/edit`, { values, agreementId, employeeId });
}

const deleteAdditionalAgreementById = async (agreementId:number) => {
    return axios.post(API_URL + `/additional_agreement/delete`, { agreementId })
}


const additionalAgreementService = {
    createAdditionalAgreement,
    fetchAdditionalAgreements,
    editAdditionalAgreement,
    deleteAdditionalAgreementById
};

export default additionalAgreementService;