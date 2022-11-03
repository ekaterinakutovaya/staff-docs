import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, DatePicker, InputNumber, Space, Row, Col, notification, Divider, Typography, Select, Grid } from 'antd';
import moment from 'moment';

import SearchInput from "components/SearchInput";
import additionalAgreementService from "api/additionalAgreement.service";
import orderService from "api/order.service";
import { selectOrders, selectEmployees, selectContracts, selectCompanies, selectAdditionalAgreements } from "store/selectors";
import { Employee, Order, Contract, AdditionalAgreement } from "store/types";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

type CreateStaffChangesProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
}

type LastChanges = {
  id?: number;
  contractNo?: number;
  agreementNo?: number;
  contractDate?: string;
  agreementDate?: string;
  dismissalDate?: string | null;
  position: string;
  salary: number;
  salaryRate: string;
  workHours: number;
  workHoursStart: number;
  workHoursEnd: number;
  workSchedule: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: number;
  contractId?: number;
  employeeId?: number;
}

type OnFinish = {
  orderNo: number;
  orderDate: Date;
  agreementDate: Date;
  positionPrev: string;
  salaryPrev: string;
  salaryRatePrev: string;
  workHoursPrev: number;
  workHoursStartPrev: number;
  workHoursEndPrev: number;
  workSchedulePrev: string;
  position: string;
  salary: number;
  salaRate: number;
  workHoursStart: number;
  workHoursEnd: number;
  workHours: number;
  workSchedule: string;
}

const CreateStaffChanges: React.FC<CreateStaffChangesProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const { additionalAgreements } = useSelector(selectAdditionalAgreements);
  const { companyDetails } = useSelector(selectCompanies);
  const [employeeId, setEmployeeId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [registerDate, setRegisterDate] = useState(null);
  const [agreementNo, setAgreementNo] = useState<number | null>(null);
  const [prevAgreementId, setPrevAgreementId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [position, setPosition] = useState<string>('');


  useEffect(() => {
    setActiveEmployees(employees.filter((emp: Employee) => emp.isEmployed === true));

    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }

    form.setFieldsValue({
      orderNo: orders.length + 1,
      orderDate: moment(Date.now()),
      agreementDate: moment(Date.now()),
      workHours: 8,
      workHoursStart: 9,
      workHoursEnd: 18,
      workSchedule: 'пятидневная рабочая неделя (40 часов)',
      salaryRate: 1.00
    })

    return () => {
      form.resetFields();
      setSelectedValue(null);
      setPosition('');
    }
  }, [open])

  useEffect(() => {
    form.validateFields(['position']);
  }, [position])

  const findEmployeeById = (id: number) => {
    const foundEmployee = employees.filter((emp: Employee) => emp.id === id);
    setEmployeeId(id);

    const { employeeFamilyName, employeeFirstName, employeePatronymic, companyId } = foundEmployee[0];
    const foundContract = contracts.filter((contract: Contract) => contract.employeeId === id && contract.dismissalDate === null)[0];
    const contractId = foundContract.id;

    const foundAgreements = additionalAgreements.filter((agreement: AdditionalAgreement) => agreement.contractId === contractId);

    let lastChanges: LastChanges;

    if (foundAgreements.length > 0) {
      lastChanges = foundAgreements[foundAgreements.length - 1];
      setContractId(lastChanges.contractId);
      setAgreementNo(foundAgreements.length + 1);
      setPrevAgreementId(lastChanges.id);
    } else {
      lastChanges = foundContract;
      setContractId(lastChanges.id);
      setAgreementNo(1);
    }

    const { position, salary, salaryRate, workHours, workHoursStart, workHoursEnd, workSchedule } = lastChanges;

    form.setFieldsValue({
      employeeFamilyName,
      employeeFirstName,
      employeePatronymic,
      positionPrev: position,
      salaryPrev: salary,
      salaryRatePrev: salaryRate,
      workHoursPrev: workHours,
      workHoursStartPrev: workHoursStart,
      workHoursEndPrev: workHoursEnd,
      workSchedulePrev: workSchedule
    })
    setCompanyId(companyId);

  }

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
      return Promise.reject('Дата приказа не может быть раньше даты регистрации организации!');
    else {
      return Promise.resolve();
    }
  };


  const onFinish = async (values: OnFinish) => {
    console.log('Success:', values);
    setLoading(true);

    const orderTypeId = 1;
    const { data } = await additionalAgreementService.createAdditionalAgreement({ values, position, agreementNo, companyId, employeeId, contractId, prevAgreementId });

    const agreementId = data?.id;

    orderService.createOrder({ values, orderTypeId, employeeId, companyId, contractId, agreementId })
      .then(() => {
        form.resetFields();
        setSelectedValue(null);
        setLoading(false);
        setPosition('');
        setOpen(false);
      })

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setLoading(false);
  };

  const onCancel = () => {
    setOpen(false);
    setSelectedValue(null);
    setPosition('');
    form.resetFields();
  }

  const onSelectChange = (value: string) => {
    setSelectedValue(value);
    setEmployeeId(Number(value));
    findEmployeeById(Number(value));
  };

  const onSelectSearch = (value: string) => {
    setSelectedValue(value);
    setEmployeeId(Number(value));
    findEmployeeById(Number(value));
  };

  return (
    <>
      <Modal
        title="Кадровое перемещение. Новый приказ*"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={md ? 1000 : 750}
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
          layout={sm ? "horizontal" : "vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          preserve={false}
        >
          <Form.Item label="Номер" required>
            {md ? (
              <Input.Group size="default">
                <Row gutter={10}>
                  <Col span={5}>
                    <Form.Item name="orderNo" >
                      <InputNumber style={{ width: '70px' }} />
                    </Form.Item>
                  </Col>
                  <Col span={9}>
                    <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                      <DatePicker format={dateFormatList} />
                    </Form.Item>
                  </Col>
                </Row>
              </Input.Group>
            ) : (
              <>
                  <Form.Item name="orderNo" required>
                    <InputNumber style={{ width: '70px' }} />
                </Form.Item>
                <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </>
            )}

          </Form.Item>
          <Divider />


          <Form.Item label="Сотрудник" required>
            <Select
              showSearch
              placeholder="Выбрать сотрудника"
              optionFilterProp="children"
              onChange={onSelectChange}
              onSearch={onSelectSearch}
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              value={selectedValue}
            >
              {activeEmployees?.map((emp: Employee, index: number) => (
                <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>

                  {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}

                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider />

          <Form.Item required label="Дата перевода" name="agreementDate" rules={[
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

          <Divider />
          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Показатели до изменения
          </Title>

          <Form.Item label="Должность" name="positionPrev" wrapperCol={{
            span: 14
          }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item label="Оклад" name="salaryPrev" wrapperCol={{
            span: 10
          }}
          >
            <InputNumber disabled step="100000" style={{
              width: 200,
            }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
          <Form.Item label="Ставок" name="salaryRatePrev" wrapperCol={{
            span: 2
          }}
          >
            <InputNumber disabled step="0.25" />
          </Form.Item>
          <Divider />

          <Form.Item label="Часы работы">
            <Input.Group size="default" >
              <Row gutter={10}>
                {md ? (
                  <>
                    <Col span={6}>
                      <Form.Item name="workHoursStartPrev" label="с">
                        <InputNumber disabled style={{ width: '70px' }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name="workHoursEndPrev" label="до">
                        <InputNumber disabled style={{ width: '70px' }} />
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Space>
                    <Col span={10}>
                      <Form.Item name="workHoursStartPrev" label="с">
                        <InputNumber disabled />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item name="workHoursEndPrev" label="до">
                        <InputNumber disabled />
                      </Form.Item>
                    </Col>
                  </Space>
                )}

              </Row>
            </Input.Group>
          </Form.Item>
          <Divider />

          <Form.Item label="Рабочий день">
            <Space>
              <Form.Item name="workHoursPrev" noStyle>
                <InputNumber disabled />
              </Form.Item>
              <Typography.Text>часов</Typography.Text>
            </Space>
          </Form.Item>
          <Divider />

          <Form.Item label="Режим рабочего времени" name="workSchedulePrev" wrapperCol={{
            span: 14
          }}
          >
            <Input disabled />
          </Form.Item>
          <Divider />

          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Изменение кадровой информации
          </Title>

          <Form.Item label="Должность" name="position" required rules={[{ validator: validatePosition }]}>
            <SearchInput placeholder="Выбрать должность" position={position} setPosition={setPosition} />
          </Form.Item>

          <Form.Item required label="Оклад" name="salary" wrapperCol={{
            span: 10
          }}
          >
            <InputNumber step="100000" style={{
              width: 200,
            }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
          <Form.Item required label="Ставок" name="salaryRate" wrapperCol={{
            span: 2
          }}
          >
            <InputNumber step="0.25" />
          </Form.Item>
          <Divider />

          <Form.Item label="Часы работы" required>
            <Input.Group size="default" >
              <Row gutter={10}>
                {md ? (
                  <>
                    <Col span={6}>
                      <Form.Item name="workHoursStart" label="с">
                        <InputNumber style={{ width: '70px' }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name="workHoursEnd" label="до">
                        <InputNumber style={{ width: '70px' }} />
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Space>
                    <Form.Item name="workHoursStart" label="с">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item name="workHoursEnd" label="до">
                      <InputNumber />
                    </Form.Item>
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
          <Divider/>

          <Form.Item required label="Режим рабочего времени" name="workSchedule" wrapperCol={{
            span: 14
          }}
          >
            <Input placeholder="40-часовая рабочая неделя" />
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

export default CreateStaffChanges;