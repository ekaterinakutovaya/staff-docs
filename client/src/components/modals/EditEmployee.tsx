import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, DatePicker, Space, Row, Col, Grid, Divider } from 'antd';
import moment from 'moment';

import employeeService from "api/employee.service";
import { selectEmployees } from "store/selectors";
import { Employee } from "store/types";
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;
const { TextArea } = Input;

type EditEmployeeProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  id?: number;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ open, setOpen, id }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const { employees } = useSelector(selectEmployees);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([]);
    if (id) {
      setData(employees?.filter((emp: Employee) => emp.id === id));
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
      title="???????????? ???????????? ?????????????????????? ????????. ????????????????????????????*"
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={1000}
      cancelText="????????????"
      okText="??????????????"
      footer={null}
      getContainer={false}
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
        <Form.Item label="??????" required>
          {md ? (
            <Input.Group size="default" >
              <Row gutter={10}>
                <Col span={7}>
                  <Form.Item name="employeeFamilyName" rules={[{
                    required: true,
                    message: '???????????????????? ?????????????? ??????????????!'
                  }]}>
                    <Input placeholder="??????????????" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="employeeFirstName" rules={[{
                    required: true,
                    message: '???????????????????? ?????????????? ??????!'
                  }]}>
                    <Input placeholder="??????" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="employeePatronymic" rules={[{
                    required: true,
                    message: '???????????????????? ?????????????? ????????????????!'
                  }]}>
                    <Input placeholder="????????????????" />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group>
          ) : (
            <>
              <Space direction="vertical" style={{ display: 'flex' }} size="small">
                <Form.Item name="employeeFamilyName" rules={[{
                  required: true,
                  message: '???????????????????? ?????????????? ??????????????!'
                }]}>
                  <Input placeholder="??????????????" />
                </Form.Item>
                <Form.Item name="employeeFirstName" rules={[{
                  required: true,
                  message: '???????????????????? ?????????????? ??????!'
                }]}>
                  <Input placeholder="??????" />
                </Form.Item>
                <Form.Item name="employeePatronymic" rules={[{
                  required: true,
                  message: '???????????????????? ?????????????? ????????????????!'
                }]}>
                  <Input placeholder="????????????????" />
                </Form.Item>
              </Space>
            </>
          )}
        </Form.Item>
        <Divider />


        <Form.Item label="????????????" name="personalId" rules={[{ required: true, message: '???????????????????? ?????????????? ????????????!' }]}>
          <Input style={{ width: 150 }}
            maxLength={14} />
        </Form.Item>
        <Divider />
        <Form.Item label="??????" name="employeeINN" rules={[{
          required: true,
          message: '???????????????????? ?????????????? ?????? ??????.????????!'
        }]}>
          <Input
            style={{
              width: 150,
            }}
            maxLength={9}
          />
        </Form.Item>
        <Divider />

        <Form.Item label="?????????????? ??????????" required>
          {md ? (
            <Input.Group size="default" >
              <Row gutter={10}>
                <Col span={3}>
                  <Form.Item name="passportSeries" >
                    <Input maxLength={2} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="??????????" name="passportNo">
                    <Input maxLength={7} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="??????????" name="issueAuthority">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item label="???????? ????????????" name="issueDate">
                    <DatePicker format={dateFormatList} />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group>
          ) : (
            <>
              <Form.Item name="passportSeries" required>
                <Input maxLength={2} />
              </Form.Item>
              <Form.Item label="??????????" name="passportNo">
                <Input maxLength={7} />
              </Form.Item>
              <Form.Item label="??????????" name="issueAuthority">
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item label="???????? ????????????" name="issueDate">
                <DatePicker format={dateFormatList} />
              </Form.Item>
            </>
          )}
        </Form.Item>
        <Divider />

        <Form.Item label="??????????" name="employeeAddress" wrapperCol={{ span: 18 }} required>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item label="??????????????" name="employeePhoneNumber" wrapperCol={{ span: 5 }} required>
          <Input />
        </Form.Item>
        <Divider />

        <SubmitButtonsBlock loading={loading} onCancel={onCancel} text="??????????????????" />
      </Form>
    </Modal>
  );
};

export default EditEmployee;