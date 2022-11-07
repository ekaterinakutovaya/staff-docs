import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Space, Grid, Divider
} from 'antd';
import moment from 'moment';

import companyService from "api/company.service";
import { selectCompanyDetails, selectCompanies } from "store/selectors";
import { CompanyDetails } from "store/types";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;
const { TextArea } = Input;

type EditCompanyDetailsProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  id: number;
}

const EditCompanyDetails: React.FC<EditCompanyDetailsProps> = ({ open, setOpen, id }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { companyDetails } = useSelector(selectCompanies);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(companyDetails.length);
    // if (companyDetails.length > 0) {
    let data = companyDetails?.filter(details => details.id === id)[0];
    form.setFieldsValue({
      companyName: data?.companyName,
      address: data?.address,
      phoneNumber: data?.phoneNumber,
      registerDate: moment(data?.registerDate),
      companyINN: data?.companyINN,
      bankAccount: data?.bankAccount,
      bankName: data?.bankName,
      bankCode: data?.bankCode,
      companyOKED: data?.companyOKED,
      manager: data?.manager,
    })
    // }


  }, [companyDetails, id])



  const onFinish = (values: CompanyDetails) => {
    console.log('Success:', values);

    companyService.editCompanyDetails({ values, id })
      .then((response) => {
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
        title="Реквизиты. Редактирование*"
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
        >
          <Form.Item label="Дата" name="registerDate" rules={[{ required: true, message: 'Пожалуйста введите дату!' }]}>
            <DatePicker format={dateFormatList} />
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
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Button size="large" type="primary" htmlType="submit" loading={loading} block>
                  Сохранить
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

export default EditCompanyDetails;