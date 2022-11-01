import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, DatePicker, Space, Row, Col, Grid, Divider } from 'antd';
import moment from 'moment';

import employeeService from "api/employee.service";
import { selectCurrentCompany, selectCompanies } from "store/selectors";
import { Employee } from 'store/types';
const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;

type CreateEmployeeProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
}

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const { currentCompany } = useSelector(selectCompanies);
  const [id, setId] = useState(null);
  // const id = currentCompany?.id;

  useEffect(() => {
    form.setFieldsValue({
      employeeFamilyName: 'Ablakulov',
      employeeFirstName: 'Otabek',
      employeePatronymic: 'Davronovich',
      personalId: '40608840220079',
      employeeINN: '999999999',
      passportSeries: 'AA',
      passportNo: '4598374',
      issueAuthority: `Toshkent shahar Mirzo-Ulug'bek tumani IIB`,
      issueDate: moment(Date.now()),
      employeeAddress: `г. Ташкент, Чиланзарский р-н, ул. Нурафшон, д. 1, кв. 5`,
      employeePhoneNumber: '+998909094511'
    })
  }, [])

  useEffect(() => {
    setId(currentCompany?.id)
  }, [currentCompany])

  const onFinish = (values: Employee) => {
    // console.log('Success:', values);
    setLoading(true);
    employeeService.createEmployee(values, id)
      .then(() => {
        form.resetFields();
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
      title="Личные данные физического лица. Создание*"
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout={sm ? "horizontal" : "vertical"}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name="complex-form"
        preserve={false}
      >
        <Form.Item label="ФИО">
          {md ? (
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
          ) : (
            <>
                <Space direction="vertical" style={{ display: 'flex' }} size="middle">
                <Form.Item name="employeeFamilyName" rules={[{
                  required: true,
                  message: 'Пожалуйста введите фамилию!'
                }]}>
                  <Input placeholder="Фамилия" />
                </Form.Item>
                  <Form.Item name="employeeFirstName" rules={[{
                    required: true,
                    message: 'Пожалуйста введите имя!'
                  }]}>
                    <Input placeholder="Имя" />
                  </Form.Item>
                  <Form.Item name="employeePatronymic" rules={[{
                    required: true,
                    message: 'Пожалуйста введите отчество!'
                  }]}>
                    <Input placeholder="Отчество" />
                  </Form.Item>
              </Space>
                <Divider/>
            </>
          )}

        </Form.Item>


        <Form.Item label="ПИНДФЛ" name="personalId" rules={[{ required: true, message: 'Пожалуйста введите ПИНДФЛ!' }]}>
          <Input style={{
            width: 150,

          }}
            maxLength={14} />
        </Form.Item>
        <Divider />
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
        <Divider />

        <Form.Item label="Паспорт серия">
        {md ? (
            <Input.Group size="default" >
              <Row gutter={10}>
                <Col span={3}>
                  <Form.Item name="passportSeries" >
                    <Input maxLength={2} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Номер" name="passportNo">
                    <Input maxLength={7} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="выдан" name="issueAuthority">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item label="дата выдачи" name="issueDate">
                    <DatePicker format={dateFormatList} />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group>
        ) : (
          <>
                <Form.Item name="passportSeries" >
                  <Input maxLength={2} />
                </Form.Item>
                <Form.Item label="Номер" name="passportNo">
                  <Input maxLength={7} />
                </Form.Item>
                <Form.Item label="выдан" name="issueAuthority">
                  <Input />
                </Form.Item>
                <Form.Item label="дата выдачи" name="issueDate">
                  <DatePicker format={dateFormatList} />
                </Form.Item>
                
          </>
        )}
          
        </Form.Item>
        <Divider/>


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
        <Divider/>

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
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button type="primary" htmlType="submit" loading={loading} block>
                Создать
              </Button>
              <Button onClick={onCancel} block>
                Отмена
              </Button>
            </Space>

          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateEmployee;