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
const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

type EditStaffChangesProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  orderId?: number;
  agreementId?: number;
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

const EditStaffChanges: React.FC<EditStaffChangesProps> = ({ open, setOpen, orderId, agreementId }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const { additionalAgreements } = useSelector(selectAdditionalAgreements);
  const { companyDetails } = useSelector(selectCompanies);
  const [employeeId, setEmployeeId] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [registerDate, setRegisterDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }

    let currentAgreement: any;
    if (agreementId) {
      currentAgreement = additionalAgreements?.filter((agreement: AdditionalAgreement) => agreement.id === agreementId)[0];
    }

    const order = orders?.filter((order: Order) => order.id === orderId)[0];
    const employee = employees.filter((emp: Employee) => emp.id === currentAgreement?.employeeId)[0];
    const contract = contracts.filter((contract: Contract) => contract.employeeId === employee?.id && contract.dismissalDate === null)[0];
    const allAgreements = additionalAgreements?.filter((agreement: AdditionalAgreement) => agreement.employeeId === employee?.id)
    setEmployeeId(employee?.id);
    setContractId(contract?.id);
    setSelectedValue(employee?.id);

    if (currentAgreement) {
      let prevChanges: any;
      if (currentAgreement.prevAgreementId === null) {
        prevChanges = contract;

      } else {
        prevChanges = allAgreements.filter((agreement: AdditionalAgreement) => agreement.id === currentAgreement.prevAgreementId)[0]
      }
      setPosition(currentAgreement?.position);

      form.setFieldsValue({
        orderNo: order?.orderNo,
        orderDate: moment(order?.orderDate),
        personalId: employee?.personalId,
        employeeFamilyName: employee?.employeeFamilyName,
        employeeFirstName: employee?.employeeFirstName,
        employeePatronymic: employee?.employeePatronymic,
        agreementDate: moment(currentAgreement?.agreementDate),
        positionPrev: prevChanges?.position,
        salaryPrev: prevChanges?.salary,
        salaryRatePrev: prevChanges?.salaryRate,
        workHoursPrev: prevChanges?.workHours,
        workHoursStartPrev: prevChanges?.workHoursStart,
        workHoursEndPrev: prevChanges?.workHoursEnd,
        workSchedulePrev: prevChanges?.workSchedule,
        workHours: currentAgreement?.workHours,
        workHoursStart: currentAgreement?.workHoursStart,
        workHoursEnd: currentAgreement?.workHoursEnd,
        workSchedule: currentAgreement?.workSchedule,
        salary: currentAgreement?.salary,
        salaryRate: currentAgreement?.salaryRate
      })

    }

    return () => {
      form.resetFields();
    }
  }, [open])

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
      return Promise.reject('Пожалуйста введите дату!');
    } else if (moment(value).isBefore(registerDate, 'day'))
      return Promise.reject('Дата документа не может быть раньше даты регистрации организации!');
    else {
      return Promise.resolve();
    }
  };


  const onFinish = async (values: any) => {
    console.log('Success:', values);
    setLoading(true);
    additionalAgreementService.editAdditionalAgreement({ values, position, employeeId, agreementId })
      .then(() => {
        orderService.editOrder({ values, orderId, contractId, employeeId })
          .then(() => {
            form.resetFields();
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
    form.resetFields();
  }

  return (
    <>
      <Modal
        title="Кадровое перемещение. Редактирование*"
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
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          preserve={false}
        >
          <Form.Item label="Номер" required>
            {md ? (
              <Input.Group size="default">
                <Row gutter={10}>
                  <Col span={6}>
                    <Form.Item name="orderNo" >
                      <InputNumber />
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
                <Form.Item name="orderNo" >
                  <InputNumber />
                </Form.Item>
                <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </>
            )}

          </Form.Item>
          <Divider />

          <Form.Item label="Сотрудник">
            <Select
              disabled
              value={selectedValue}
            >
              {employees?.map((emp: Employee, index: number) => (
                <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>
                  {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider />

          <Form.Item required label="Дата перевода" name="agreementDate" rules={[{ validator: validateDate }]}>
            <DatePicker format={dateFormatList} />
          </Form.Item>

          <Divider />

          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Показатели до изменения
          </Title>

          <Form.Item label="Должность" name="positionPrev" wrapperCol={{ span: 14 }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item label="Оклад" name="salaryPrev" wrapperCol={{ span: 10 }}
          >
            <InputNumber disabled step="100000" style={{ width: 200 }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
          <Form.Item label="Ставок" name="salaryRatePrev" wrapperCol={{ span: 2 }}
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

          <Form.Item required label="Режим рабочего времени" name="workSchedulePrev" wrapperCol={{
            span: 14
          }}
          >
            <Input disabled />
          </Form.Item>
          <Divider />

          <Title level={5} style={{ textAlign: 'center' }}>
            Изменение кадровой информации
          </Title>

          <Form.Item label="Должность" name="position" required rules={[{ validator: validatePosition }]}>
            <SearchInput placeholder="Выбрать должность" position={position} setPosition={setPosition} />
          </Form.Item>

          <Form.Item required label="Оклад" name="salary" wrapperCol={{ span: 10 }}
          >
            <InputNumber step="100000" style={{ width: 200 }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
          <Form.Item required label="Ставок" name="salaryRate" wrapperCol={{ span: 2 }}
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
                  <>
                    <Space>
                      <Form.Item name="workHoursStart" label="с">
                        <InputNumber />
                      </Form.Item>
                      <Form.Item name="workHoursEnd" label="до">
                        <InputNumber />
                      </Form.Item>
                    </Space>
                  </>
                )}
              </Row>
            </Input.Group>
          </Form.Item>
          <Divider/>

          <Form.Item label="Рабочий день" required>
            <Space>
              <Form.Item name="workHours" noStyle>
                <InputNumber />
              </Form.Item>
              <Typography.Text>часов</Typography.Text>
            </Space>
          </Form.Item>
          <Divider />

          <Form.Item required label="Режим рабочего времени" name="workSchedule" wrapperCol={{ span: 14 }}
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
                  Сохранить
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
                  Сохранить
                </Button>
                <Button onClick={onCancel} block>
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

export default EditStaffChanges;