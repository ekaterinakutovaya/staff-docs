import React from 'react';
import { useSelector } from "react-redux";
import { Form, Select } from 'antd';

import { selectEmployees } from "store/selectors";
import { Employee } from "store/types";

const { Option } = Select;

type EmployeeSelectProps = {
    selectedEmployee: string;
    setSelectedEmployee: (value: string) => void;
    companyId: number;
    setCompanyId: (id: number) => void;
    employeeId: number;
    setEmployeeId: (value: number) => void;
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({ selectedEmployee, setSelectedEmployee, companyId, setCompanyId, employeeId, setEmployeeId }) => {
    const [form] = Form.useForm();
    const { employees } = useSelector(selectEmployees);   
    
    const onSelectChange = (value: string) => {
        setSelectedEmployee(value);
        setEmployeeId(Number(value));
        const foundEmployee = employees.filter((emp: Employee) => emp.id === Number(value))[0];
        if (foundEmployee) {
            const { companyId } = foundEmployee;
            setCompanyId(companyId);
        }

    };

    return (
            <Select
                showSearch
                placeholder="Выбрать физ.лицо"
                optionFilterProp="children"
                onChange={onSelectChange}
                onSearch={onSelectChange}
                filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                allowClear
                value={selectedEmployee}
            >
                {employees?.map((emp: Employee, index: number) => (
                    <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>

                        {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}

                    </Option>
                ))}
            </Select>
    );
};

export default EmployeeSelect;