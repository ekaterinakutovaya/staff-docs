import axios from "axios";
import { CompanyDetails } from "store/types";
import { API_URL } from "consts/consts";

const createCompany = async (values: CompanyDetails, sub: string) => {
    return axios.post(API_URL + "/company/create", { values, sub })
}

const fetchCompanies = async (sub:string) => {      
    return axios.get(API_URL + "/company", { params: {sub} });
}

const setCurrentCompany = async (companyId:number, sub:string) => {
    return axios.post(API_URL + "/company/set_current", { companyId, sub});
}

const createCompanyDetails = async ({ values, companyId }) => {
    return axios.post(API_URL + "/company/create_details", { values, companyId });
}

const fetchCompanyDetails = async (companyId:number) => {
    return axios.get(API_URL + "/company/details", {params: {companyId}});
}

const editCompanyDetails = async ({values, id}) => {
    return axios.post(API_URL + `/company/edit_company_details/`, { values, id });
}

const deleteCompanyById = async (id: number) => {
    return axios.post(API_URL + `/company/delete_company/`, { id });
}

const deleteCompanyDetailsById = async (id:number) => {
    return axios.post(API_URL + `/company/delete_company_details/`, { id });
}


const companyService = {
    createCompany,
    fetchCompanies,
    setCurrentCompany,
    createCompanyDetails,
    fetchCompanyDetails,
    editCompanyDetails,
    deleteCompanyById,
    deleteCompanyDetailsById
};

export default companyService;