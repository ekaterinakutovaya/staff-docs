import axios from "axios";
import { Company, CompanyDetails } from "store/types";
import { API_URL } from "consts/consts";

// const API_URL = 'http://localhost:5000/api';

const createCompany = async (values: CompanyDetails, sub: string) => {
    return axios.post(API_URL + "/company/create", { values, sub })
}

const fetchCompanies = async (sub:string) => {  
    return axios.get(API_URL + "/company", { params: {sub} });
}

const setCurrentCompany = async (companyId:number, sub:string) => {
    return axios.post(API_URL + "/company/set_current", { companyId, sub});
}

const fetchCompanyDetails = async (companyId:number) => {
    return axios.get(API_URL + "/company/details", {params: {companyId}});
}

const insertCompanyChanges =  async ({values, companyId}) => {
    return axios.post(API_URL + "/company/insert_changes", { values, companyId });
}

const deleteCompanyById =  async (id:number) => {
    return axios.post(API_URL + `/company/delete_company/`, {id});
}

const editCompanyDetails = async ({values, id}) => {
    return axios.post(API_URL + `/company/edit_company_details/`, { values, id });
}

const deleteCompanyDetailsById = async (id:number) => {
    return axios.post(API_URL + `/company/delete_company_details/`, { id });
}


const companyService = {
    createCompany,
    fetchCompanies,
    setCurrentCompany,
    fetchCompanyDetails,
    insertCompanyChanges,
    deleteCompanyById,
    editCompanyDetails,
    deleteCompanyDetailsById
};

export default companyService;