import axios from "axios";
import { API_URL } from "consts/consts";


const createAdditionalAgreement = async ({ values, position, agreementNo, companyId, employeeId, contractId, prevAgreementId }) => {
    return axios.post(API_URL + "/additional_agreement/create", {
        values, position, agreementNo, companyId, employeeId, contractId, prevAgreementId
    })
}

const fetchAdditionalAgreements = async (companyId:number) => {
    return axios.get(API_URL + "/additional_agreement", { params: { companyId } });
}

const editAdditionalAgreement = async ({ values, position, agreementId, employeeId }) => {
    return axios.post(API_URL + `/additional_agreement/edit`, { values, position, agreementId, employeeId });
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