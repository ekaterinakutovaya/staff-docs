import axios from "axios";
import { API_URL } from "consts/consts";


const generateContract = async (contractId:number) => {
    return axios.post(API_URL + "/word/generate_contract", { contractId });
}

const generateAdditionalAgreement = async (agreementId:number) => {
    return axios.post(API_URL + "/word/generate_agreement", { agreementId });
}

const generateContractCancellation = async (contractId:number) => {
    return axios.post(API_URL + "/word/generate_contract_cancellation", { contractId });
}

const downloadDocument = async (fileName:string) => {
    
    const response = await fetch(API_URL + `/word/download?fileName=${fileName}`, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename="file.docx"'
        }
    })
    if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.target = '_blank';
        link.dispatchEvent(new MouseEvent('click'));
    }
}

const generateOrder = async (orderId:number) => {
    return axios.post(API_URL + "/word/generate_order", {orderId});
}

const generateStaffChangesOrder = async (orderId:number) => {
    return axios.post(API_URL + "/word/generate_staff_chages_order", {orderId});
}

const generateDismissalOrder = async (orderId:number) => {
    return axios.post(API_URL + "/word/generate_dismissal_order", {orderId});
}


const exportToDocService = {
    generateContract,
    generateContractCancellation,
    generateOrder,
    generateDismissalOrder,
    downloadDocument,
    generateAdditionalAgreement,
    generateStaffChangesOrder
};

export default exportToDocService;