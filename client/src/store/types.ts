export type JwtPayloadToken = {
    iss?: string;
    nbf?: number;
    aud?: string;
    sub: string;
    email?: string;
    email_verified?: boolean;
    azp?: string;
    name?: string;
    family_name?: string;
    picture: string;
    given_name: string;
    iat?: number;
    jti?: string;
    exp?: number;
}


export type Company = {
    id: number;
    companyName: string;
    isCurrent: boolean;
    createdAt: string;
    updateAt: string;
    userId: number
}

export type CurrentCompany = {
    id?: number;
    companyName?: string;
    isCurrent?: boolean;
    createdAt?: string;
    updateAt?: string;
    userId?: number
}

export type CompanyDetails = {
    id?: number;
    companyName: string;
    registerDate: string;
    address: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    bankCode: string;
    companyINN: string;
    companyOKED: string;
    manager: string;
    createdAt?: string;
    updateAt?: string;
    companyId?: number;
    isCurrent?: boolean;
}



export interface CompanySliceState {
    companies: Company[];
    currentCompany: CurrentCompany | any;
    companyDetails: CompanyDetails[];
    loading: boolean;
}

export type User = {
    sub: string;
    picture: string;
}

export type Employee = {
    id?: number;
    employeeFamilyName: string;
    employeeFirstName: string;
    employeePatronymic: string;
    personalId: string;
    employeeINN: string;
    passportSeries: string;
    passportNo: string;
    issueAuthority: string;
    issueDate: string;
    employeeAddress: string;
    employeePhoneNumber: string;
    createdAt?: string;
    updatedAt?: string;
    companyId?: number;
    isEmployed: boolean;
}

export type Order = {
    id?: number;
    orderNo: number;
    orderDate: string;
    dismissalDate?: string;
    orderTypeId: number;
    employeeId?: number;
    contractId?: number;
    agreementId?: number;
    createdAt?: string;
    updatedAt?: string;
    companyId?: number;
    groundsForDismissal?: string;
    compensationDays?: string;
    averageSalary?: string;
}

export type Contract = {
    id?: number;
    contractNo: number;
    contractDate: string;
    dismissalDate: string | null;
    position: string;
    salary: number;
    salaryRate: string;
    workHoursStart: number;
    workHoursEnd: number;
    workHours: number;
    workSchedule: string;
    vacationDays: number;
    createdAt?: string;
    updatedAt?: string;
    employeeId?: number;
    companyId?: number;
    orderId?: number | null;
}

export type AdditionalAgreement = {
    id?: number;
    agreementNo: number;
    agreementDate: string;
    position: string;
    salary: number;
    salaryRate: string;
    workHoursStart: number;
    workHoursEnd: number;
    workHours: number;
    workSchedule: string;
    createdAt?: string;
    updatedAt?: string;
    employeeId?: number;
    companyId?: number;
    contractId?: number;
    prevAgreementId?: number;
}

