import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    Space,
    Row,
    Col
} from 'antd';
import moment from 'moment';

import employeeService from "api/employee.service";
import { selectEmployees } from "store/selectors";
import { Employee } from "store/types";
const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];

type EditEmployeeProps = {
    open: boolean;
    setOpen: (boolean: boolean) => void;
    id?: number;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ open, setOpen, id }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const {employees} = useSelector(selectEmployees);
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([]);
        if (id) {
            setData(employees?.filter(emp => emp.id === id));
        }
    }, [employees, id])

    useEffect(() => {
            form.setFieldsValue({
                employeeFamilyName: data[0]?.employeeFamilyName,
                employeeFirstName: data[0]?.employeeFirstName,
                employeePatronymic: data[0]?.employeePatronymic,
                personalId: data[0]?.personalId,
                employeeINN: data[0]?.employeeINN,
                passportSeries: data[0]?.passportSeries,
                passportNo: data[0]?.passportNo,
                issueAuthority: data[0]?.issueAuthority,
                issueDate: moment(data[0]?.issueDate),
                employeeAddress: data[0]?.employeeAddress,
                employeePhoneNumber: data[0]?.employeePhoneNumber,
            })
 
    }, [data])


    const onFinish = (values: Employee) => {
        console.log('Success:', values);
        setLoading(true);
        employeeService.editEmployee(values, id)
            .then(() => {
                setLoading(false);
                setOpen(false);
            })

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        setLoading(false);
    };

    const onCancel = () => {
        form.resetFields();
        setOpen(false);
    }

    return (
        <Modal
            title="Личные данные физического лица. Редактирование*"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1000}
            cancelText="Отмена"
            okText="Создать"
            footer={null}
            getContainer={false}
            forceRender

        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                name="complex-form"
            >
                <Form.Item label="ФИО">
                    <Input.Group size="default" >
                        <Row gutter={10}>
                            <Col span={7}>
                                <Form.Item name="employeeFamilyName" rules={[{
                                    required: true,
                                    message: 'Пожалуйста введите фамилию!'
                                }]}>
                                    <Input placeholder="Фамилия" />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item name="employeeFirstName" rules={[{
                                    required: true,
                                    message: 'Пожалуйста введите имя!'
                                }]}>
                                    <Input placeholder="Имя" />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item name="employeePatronymic" rules={[{
                                    required: true,
                                    message: 'Пожалуйста введите отчество!'
                                }]}>
                                    <Input placeholder="Отчество" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>


                <Form.Item label="ПИНДФЛ" name="personalId" rules={[{ required: true, message: 'Пожалуйста введите ПИНДФЛ!' }]}>
                    <Input style={{
                        width: 150,

                    }}
                        maxLength={14} />
                </Form.Item>
                <Form.Item label="ИНН" name="employeeINN" rules={[{
                    required: true,
                    message: 'Пожалуйста введите ИНН физ.лица!'
                }]}>
                    <Input
                        style={{
                            width: 150,
                        }}
                        maxLength={9}
                    />
                </Form.Item>

                <Form.Item label="Паспорт серия">
                    <Input.Group size="default" >
                        <Row gutter={10}>
                            <Col span={2}>
                                <Form.Item name="passportSeries" >
                                    <Input maxLength={2} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="Номер" name="passportNo">
                                    <Input maxLength={7} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="выдан" name="issueAuthority">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="дата выдачи" name="issueDate">
                                    <DatePicker format={dateFormatList} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>


                <Form.Item label="Адрес" name="employeeAddress" wrapperCol={{
                    span: 18,
                }}>
                    <Input />
                </Form.Item>
                <Form.Item label="Телефон" name="employeePhoneNumber" wrapperCol={{
                    span: 5,
                }}>
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{
                    offset: 8,
                    span: 16,
                }}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Сохранить
                        </Button>
                        <Button onClick={onCancel} >
                            Отмена
                        </Button>
                    </Space>

                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditEmployee;