import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, DatePicker, Divider, Grid } from 'antd';

import { useAppDispatch } from "store/store";
import { createCompany } from "store/actionCreators/companyAction";
import { selectAuth } from 'store/selectors';
import { CompanyDetails } from "store/types";
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { TextArea } = Input;

type CreateCompanyProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
}


const CreateCompany: React.FC<CreateCompanyProps> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { sub } = useSelector(selectAuth);
  const [form] = Form.useForm();

  const onFinish = (values: CompanyDetails) => {
    // console.log('Success:', values);
    dispatch(createCompany({ values, sub }))
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
        title="Организации. Создание*"
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
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          preserve={false}
        >
          <Form.Item label="Наименование" name="companyName" rules={[{ required: true, message: 'Пожалуйста введите наименование!' }]}>
            <Input />
          </Form.Item>
          <Divider />
          <Form.Item label="Адрес" name="address" rules={[{ required: true, message: 'Пожалуйста введите адрес организации!' }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Divider />
          <Form.Item label="Телефон" name="phoneNumber" rules={[{ required: true, message: 'Пожалуйста введите телефон организации!' }]}>
            <Input />
          </Form.Item>
          <Divider />

          <Form.Item label="Дата регистрации" name="registerDate" rules={[{ required: true, message: 'Пожалуйста введите дату!' }]}>
            <DatePicker format={dateFormatList} />
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
            <TextArea rows={2} />
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


          <SubmitButtonsBlock loading={loading} onCancel={onCancel} text="Создать" />

        </Form>
      </Modal>
    </>
  );
};

export default CreateCompany;