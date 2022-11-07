import React, {useState} from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    Space, Grid, Divider
} from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

import { useAppDispatch } from "store/store";
import { CompanyDetails } from "store/types";
import companyService from "api/company.service";
import { insertCompanyChanges } from "store/actionCreators/companyAction";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;
const { TextArea } = Input;

type InsertCompanyChangesProps = {
    open: boolean;
    setOpen: (boolean: boolean) => void;
    companyId: number;
}

const InsertCompanyChanges: React.FC<InsertCompanyChangesProps> = ({ open, setOpen, companyId }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { sm, md, lg, xl, xxl } = useBreakpoint();
    const [loading, setLoading] = useState(false);

    const onFinish = (values: CompanyDetails) => {
        console.log('Success:', values);        

        dispatch(insertCompanyChanges({values, companyId}))
            .then(() => {
                form.resetFields();
                setOpen(false)
            })

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        setOpen(false);
        form.resetFields();
    }

    return (
        <>
            <Modal
                title="Организации. Внесение изменений*"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                cancelText="Отмена"
                okText="Создать"
                footer={null}

            >
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Дата изменения" name="registerDate" rules={[{ required: true, message: 'Пожалуйста введите дату изменения!' }]}>
                        <DatePicker format={dateFormatList} locale={locale} />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="Наименование" name="companyName" rules={[{ required: true, message: 'Пожалуйста введите наименование!' }]}>
                        <Input />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="Адрес" name="address" rules={[{ required: true, message: 'Пожалуйста введите адрес организации!' }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="Телефон" name="phoneNumber" rules={[{ required: true, message: 'Пожалуйста введите телефон организации!' }]}>
                        <Input />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="ИНН" name="companyINN" rules={[{
                        required: true,
                        message: 'Пожалуйста введите ИНН организации!'
                    }]}>
                        <Input
                            style={{
                                width: 150,
                            }}
                            maxLength={9}
                        />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="р/с" name="bankAccount" rules={[{
                        required: true,
                        message: 'Пожалуйста введите расчетный счет организации!'
                    }]}>
                        <Input
                            style={{
                                width: 200,
                            }}
                            maxLength={20}
                        />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="банк" name="bankName" rules={[{ required: true, message: 'Пожалуйста введите наименование банка!' }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="МФО" name="bankCode" rules={[{
                        required: true,
                        message: 'Пожалуйста введите МФО банка!'
                    }]}>
                        <Input
                            style={{
                                width: 70,
                            }}
                            maxLength={5}
                        />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="ОКЭД" name="companyOKED" rules={[{
                        required: true,
                        message: 'Пожалуйста введите ОКЭД организации!'
                    }]}>
                        <Input
                            style={{
                                width: 70,
                            }}
                            maxLength={5}
                        />
                    </Form.Item>
                    <Divider />

                    <Form.Item label="Руководитель" name="manager" rules={[{
                        required: true,
                        message: 'Пожалуйста введите ФИО руководителя организации!'
                    }]}>
                        <Input />
                    </Form.Item>
                    <Divider />

                    {sm ? (
                        <Form.Item wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Создать
                                </Button>
                                <Button onClick={onCancel}>
                                    Отмена
                                </Button>
                            </Space>

                        </Form.Item>
                    ) : (
                            <Form.Item>
                                <Space direction="vertical" size="middle" style={{ width: '100%'}}>
                                <Button size="large" type="primary" htmlType="submit" loading={loading} block
                                >
                                    Создать
                                </Button>
                                <Button size="large" onClick={onCancel} block>
                                    Отмена
                                </Button>
                            </Space>

                        </Form.Item>
                    )}

                </Form>
            </Modal>
        </>
    );
};

export default InsertCompanyChanges;