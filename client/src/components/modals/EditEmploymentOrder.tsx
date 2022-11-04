import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, DatePicker, InputNumber, Space, Row, Col, Select, Typography, Grid, Divider } from 'antd';
import moment from 'moment';

import SearchInput from "components/SearchInput";
import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectContracts, selectEmployees, selectCompanies } from "store/selectors";
import { Employee, Order, Contract } from "store/types";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { Option } = Select;
const { useBreakpoint } = Grid;

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
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { contracts } = useSelector(selectContracts);
  const { employees } = useSelector(selectEmployees);
  const { companyDetails } = useSelector(selectCompanies);
  const [contractId, setContractId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [registerDate, setRegisterDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }
    const order = orders.filter((order: Order) => order.id === orderId)[0];
    const contract = contracts.filter((contract: Contract) => contract.id === order?.contractId)[0];
    const employee = employees.filter((emp: Employee) => emp.id === order?.employeeId)[0];
    setContractId(contract?.id);
    setEmployeeId(employee?.id);
    setSelectedEmployee(employee?.id);
    setPosition(contract?.position);

    form.setFieldsValue({
      orderNo: order?.orderNo,
      orderDate: moment(order?.orderDate),
      personalId: employee?.personalId,
      employeeFamilyName: employee?.employeeFamilyName,
      employeeFirstName: employee?.employeeFirstName,
      employeePatronymic: employee?.employeePatronymic,
      salary: contract?.salary,
      salaryRate: contract?.salaryRate,
      workHours: contract?.workHours,
      workHoursStart: contract?.workHoursStart,
      workHoursEnd: contract?.workHoursEnd,
      workSchedule: contract?.workSchedule,
      vacationDays: contract?.vacationDays,
      contractNo: contract?.contractNo,
      contractDate: moment(contract?.contractDate)
    })
  }, [orders, open])

  useEffect(() => {
    form.validateFields(['position']);
  }, [position])

  const validatePosition = (rule: any, value: any, callback: (error?: string) => void) => {
    if (position) {
      return Promise.resolve();
    }
    return Promise.reject('Пожалуйста выберите должность!');
  };

  const validateDate = (rule: any, value: any, callback: (error?: string) => void) => {
    if (value === null) {
      return Promise.reject('Пожалуйста введите дату приказа!');
    } else if (moment(value).isBefore(registerDate, 'day'))
      return Promise.reject('Дата документа не может быть раньше даты регистрации организации!');
    else {
      return Promise.resolve();
    }
  };


  const onFinish = async (values: OnFinish) => {
    // console.log('Success:', values);
    setLoading(true);

    contractService.editContract({ values, position, contractId, employeeId })
      .then(() => {
        orderService.editOrder({ values, orderId, contractId, employeeId })
          .then(() => {
            form.resetFields();
            setSelectedEmployee(null);
            setPosition(null);
            setLoading(false);
            setOpen(false);
          })
      })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setLoading(false);
  };

  const onCancel = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setPosition(null);
    form.resetFields();
  }

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
    <>
      <Modal
        title="Прием на работу в организацию. Редактирование*"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={md ? 1000 : 750}
        footer={null}
        getContainer={false}
        destroyOnClose
        forceRender
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout={sm ? "horizontal" : "vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          preserve={false}
        >
          <Form.Item label="Номер" required>
            {md ? (
              <Input.Group size="default">
                <Row>
                    <Form.Item name="orderNo">
                    <InputNumber style={{ width: '70px', marginRight: '10px' }} />
                    </Form.Item>
                    <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                      <DatePicker format={dateFormatList} />
                    </Form.Item>
                </Row>
              </Input.Group>
            ) : (
              <>
                <Form.Item name="orderNo">
                  <InputNumber />
                </Form.Item>

                <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </>
            )}
          </Form.Item>
          <Divider />

          <Form.Item required label="Основание">
            {sm ? (
              <Input.Group size="default" >
                <Row>
                  <Form.Item name="contractNo" label="Трудовой договор №">
                    <InputNumber style={{ width: '70px', marginRight: '10px' }} />
                    </Form.Item>
                    <Form.Item name="contractDate" label="от">
                      <DatePicker format={dateFormatList} />
                    </Form.Item>
                </Row>
              </Input.Group>
            ) : (
              <>
                <Form.Item name="contractNo" label="Трудовой договор №">
                  <InputNumber />
                </Form.Item>
                <Form.Item name="contractDate" label="от">
                  <DatePicker format={dateFormatList} />
                </Form.Item>
                <Divider />
              </>
            )}
          </Form.Item>

          <Form.Item label="Физ.лицо" required>
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
          </Form.Item>
          <Divider />

          <Form.Item label="Должность" name="position" required rules={[{ validator: validatePosition }]}>
            <SearchInput placeholder="Выбрать должность" position={position} setPosition={setPosition} />
          </Form.Item>

          <Form.Item label="Оклад" name="salary" wrapperCol={{ span: 10 }}
          >
            <InputNumber step="100000" style={{ width: 200 }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>

          <Form.Item label="Ставок" name="salaryRate" wrapperCol={{ span: 2 }}
          >
            <InputNumber step="0.25" />
          </Form.Item>
          <Divider />

          <Form.Item label="Часы работы" required>
            <Input.Group size="default" >
              <Row gutter={10}>
                {md ? (
                  <>
                    <Col span={5}>
                      <Form.Item name="workHoursStart" label="с">
                        <InputNumber style={{
                          textAlign: 'center', width: '70px'
                        }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name="workHoursEnd" label="до">
                        <InputNumber style={{
                          textAlign: 'center', width: '70px'
                        }} />
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Space>
                    <Col span={10}>
                      <Form.Item name="workHoursStart" label="с">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item name="workHoursEnd" label="до">
                        <InputNumber />
                      </Form.Item>
                    </Col>
                  </Space>
                )}

              </Row>
            </Input.Group>
          </Form.Item>
          <Divider />

          <Form.Item label="Рабочий день" required>
            <Space>
              <Form.Item name="workHours" noStyle>
                <InputNumber />
              </Form.Item>
              <Typography.Text>часов</Typography.Text>
            </Space>
          </Form.Item>
          <Divider />

          <Form.Item required label="Режим рабочего времени" name="workSchedule" wrapperCol={{
            span: 14
          }}
          >
            <Input placeholder="40-часовая рабочая неделя" />
          </Form.Item>
          <Divider />

          <Form.Item required label="Дней отпуска" name="vacationDays" wrapperCol={{ span: 14 }}
          >
            <InputNumber step="1" />
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

export default EditEmploymentOrder;