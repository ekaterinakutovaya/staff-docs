import React from "react";
import Companies from "pages/Companies";
import Orders from "pages/Orders";
import CompanyDetails from "pages/CompanyDetails";
import Employees from "pages/Employees";

export const authRoutes = [
    {
        path: 'companies',
        element: <Companies />
    },
    {
        path: 'orders',
        element: <Orders />
    },
    {
        path: 'employees',
        element: <Employees />
    },
    {
        path: 'company_details/:id',
        element: <CompanyDetails/>
    },
    
]