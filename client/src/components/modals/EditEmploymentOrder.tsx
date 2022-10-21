import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    InputNumber,
    Space,
    Row,
    Col, notification, Select, Typography
} from 'antd';
import moment from 'moment';

import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectContracts, selectEmployees, selectCompanies } from "store/selectors";
import { Employee, Order, Contract } from "store/types";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { Option } = Select;

type EditEmploymentOrderProps = {
    open: boolean;
    setOpen: (boolean: boolean) => void;
    orderId?: number;
}

type OnFinish = {
    orderNo: number;
    orderDate: Date;
    position: string;
    salary: number;
    salaRate: number;
    workHoursStart: number;
    workHoursEnd: number;
    workHours: number;
    workSchedule: string;
    contractNo: number;
    contractDate: Date;
}

const EditEmploymentOrder: React.FC<EditEmploymentOrderProps> = ({ open, setOpen, orderId }) => {
    const [form] = Form.useForm();
    const { orders } = useSelector(selectOrders);
    const { contracts } = useSelector(selectContracts);
    const { employees } = useSelector(selectEmployees);
    const {companyDetails} = useSelector(selectCompanies);
    const [contractId, setContractId] = useState<number | null>(null);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [registerDate, setRegisterDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        if (companyDetails.length > 0) {
            setRegisterDate(companyDetails[0]?.registerDate);
        }
        const order = orders.filter((order: Order) => order.id === orderId)[0];
        const contract = contracts.filter((contract: Contract) => contract.id === order ?.contractId)[0];
        const employee = employees.filter((emp: Employee) => emp.id === order ?.employeeId)[0];
        setContractId(contract ?.id);
        setEmployeeId(employee?.id);
        setSelectedValue(employee?.id);

        form.setFieldsValue({
            orderNo: order ?.orderNo,
            orderDate: moment(order ?.orderDate),
            personalId: employee ?.personalId,
            employeeFamilyName: employee ?.employeeFamilyName,
            employeeFirstName: employee ?.employeeFirstName,
            employeePatronymic: employee ?.employeePatronymic,
            position: contract ?.position,
            salary: contract ?.salary,
            salaryRate: contract ?.salaryRate,
            workHours: contract?.workHours,
            workHoursStart: contract?.workHoursStart,
            workHoursEnd: contract?.workHoursEnd,
            workSchedule: contract ?.workSchedule,
            vacationDays: contract?.vacationDays,
            contractNo: contract ?.contractNo,
            contractDate: moment(contract ?.contractDate)
        })
    }, [orders, open])

    const onFinish = async (values: OnFinish) => {
        // console.log('Success:', values);
        setLoading(true);

        contractService.editContract({ values, contractId, employeeId })
            .then(() => {
                orderService.editOrder({ values, orderId, contractId, employeeId })
                    .then(() => {
                        form.resetFields();
                        setSelectedValue(null);
                        setLoading(false);
                        setOpen(false);
                    })
            })
    };

    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
        setLoading(false);
    };

    const onCancel = () => {
        setOpen(false);
        setSelectedValue(null);
        form.resetFields();
    }

    const onSelectChange = (value: string) => {
        setSelectedValue(value);
        setEmployeeId(Number(value));
        const foundEmployee = employees.filter((emp: Employee) => emp.id === Number(value))[0];
        if (foundEmployee) {
            const { companyId } = foundEmployee;
            setCompanyId(companyId);
        }

    };

    const onSelectSearch = (value: string) => {
        setSelectedValue(value);
        setEmployeeId(Number(value));
        const foundEmployee = employees.filter((emp: Employee) => emp.id === Number(value))[0];
        if (foundEmployee) {
            const { companyId } = foundEmployee;
            setCompanyId(companyId);
        }
    };

    return (
        <>
            <Modal
                title="Прием на работу в организацию. Редактирование*"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                cancelText="Отмена"
                okText="Создать"
                footer={null}
                getContainer={false}
                destroyOnClose
                forceRender
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    preserve={false}
                >
                    <Form.Item label="Номер">
                        <Input.Group size="default">

                            <Row gutter={10}>
                                <Col span={4}>
                                    <Form.Item name="orderNo" style={{
                                        textAlign: 'center'
                                    }}>
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                                <Col span={9}>
                                    <Form.Item name="orderDate" label="от" rules={[
                                        {
                                            validator: (_, value) => {
                                                if (value === null) {
                                                    return Promise.reject('Пожалуйста введите дату приказа!');
                                                } else if (moment(value).isBefore(registerDate, 'day'))
                                                    return Promise.reject('Дата приказа не может быть меньше даты регистрации организации!');
                                                else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        }
                                    ]}>
                                        <DatePicker format={dateFormatList} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item label="Физ.лицо">
                        <Select
                            showSearch
                            placeholder="Выбрать физ.лицо"
                            optionFilterProp="children"
                            onChange={onSelectChange}
                            onSearch={onSelectSearch}
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            value={selectedValue}
                        >
                            {employees?.map((emp: Employee, index: number) => (
                                <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>

                                    {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}

                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Должность" name="position" wrapperCol={{
                        span: 14
                    }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Оклад" name="salary" wrapperCol={{
                        span: 10
                    }}
                    >
                        <InputNumber step="100000" style={{
                            width: 200,
                        }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        />
                    </Form.Item>
                    <Form.Item label="Ставок" name="salaryRate" wrapperCol={{
                        span: 2
                    }}
                    >
                        <InputNumber step="0.25" />
                    </Form.Item>

                    <Form.Item label="Часы работы">
                        <Input.Group size="default" >
                            <Row gutter={10}>
                                <Col span={5}>
                                    <Form.Item name="workHoursStart" label="с">
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item name="workHoursEnd" label="до">
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item label="Рабочий день">
                        <Space>
                            <Form.Item name="workHours" noStyle>
                                <InputNumber />
                            </Form.Item>
                            <Typography.Text>часов</Typography.Text>
                        </Space>
                    </Form.Item>

                    <Form.Item label="Режим рабочего времени" name="workSchedule" wrapperCol={{
                        span: 14
                    }}
                    >
                        <Input placeholder="40-часовая рабочая неделя" />
                    </Form.Item>
                    <Form.Item label="Дней отпуска" name="vacationDays" wrapperCol={{
                        span: 14
                    }}
                    >
                        <InputNumber step="1" />
                    </Form.Item>

                    <Form.Item label="Основание">
                        <Input.Group size="default" >
                            <Row gutter={18}>
                                <Col span={11}>
                                    <Form.Item name="contractNo" label="Трудовой договор №">
                                        <InputNumber style={{
                                            textAlign: 'center'
                                        }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="contractDate" label="от">
                                        <DatePicker format={dateFormatList} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>


                    <Form.Item wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Сохранить
                            </Button>
                            <Button onClick={onCancel}>
                                Отмена
                            </Button>
                        </Space>

                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default EditEmploymentOrder;