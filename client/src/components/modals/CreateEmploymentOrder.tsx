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
  Col,
  Select, Typography, Grid, Divider
} from 'antd';
import moment from 'moment';

import SearchInput from "components/SearchInput";
import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectEmployees, selectContracts, selectCompanies } from "store/selectors";
import { Employee } from "store/types";


const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { Option } = Select;
const { useBreakpoint } = Grid;


type CreateEmploymentOrderProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
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


const CreateEmploymentOrder: React.FC<CreateEmploymentOrderProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const { companyDetails } = useSelector(selectCompanies);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [registerDate, setRegisterDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }

    form.setFieldsValue({
      orderNo: orders.length + 1,
      orderDate: moment(Date.now()),
      workHoursStart: 9,
      workHoursEnd: 18,
      workHours: 8,
      workSchedule: 'пятидневная рабочая неделя (40 часов)',
      vacationDays: 15,
      salary: 1500000,
      salaryRate: 1.00,
      contractNo: contracts.length + 1,
      contractDate: moment(Date.now()),
    })

    return () => {
      form.resetFields();
      setPosition('');
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

  const onFinish = async (values: OnFinish) => {
    console.log('Success:', values, position);
    setLoading(true);

    const orderTypeId = 0;
    const contract = await contractService.createContract({ values, position, companyId, employeeId });
    const contractId = contract.data.id;

    orderService.createOrder({ values, orderTypeId, employeeId, companyId, contractId })
      .then(() => {
        form.resetFields();
        setSelectedValue(null);
        setPosition(null);
        setLoading(false);
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
    setPosition(null);
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
        title="Прием на работу. Новый приказ*"
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
                  <Col span={4}>
                    <Form.Item name="orderNo" style={{
                      textAlign: 'center'
                    }}>
                      <InputNumber style={{
                        textAlign: 'center', width: '70px'
                      }} />
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
                <Form.Item name="orderNo">
                    <InputNumber style={{
                      textAlign: 'center', width: '70px'
                    }} />
                </Form.Item>

                <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
                <Divider />
              </>
            )}


          </Form.Item>

          <Form.Item required label="Основание">
            {sm ? (
              <Input.Group size="default" >
                <Row gutter={18}>
                  <Col span={12}>
                    <Form.Item name="contractNo" label="Трудовой договор №">
                      <InputNumber style={{
                        textAlign: 'center', width: '70px'
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
            ) : (
              <>
                <Form.Item name="contractNo" label="Трудовой договор №">
                    <InputNumber style={{
                      textAlign: 'center', width: '70px'
                    }} />
                </Form.Item>
                <Form.Item name="contractDate" label="от">
                  <DatePicker format={dateFormatList} />
                </Form.Item>
                <Divider />
              </>
            )}

          </Form.Item>

          <Form.Item label="Физ.лицо" name="employee" rules={[{
            required: true
          }]}>
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

          <Form.Item label="Должность" name="position" required rules={[{ validator: validatePosition }]}>
            <SearchInput placeholder="Выбрать должность" position={position} setPosition={setPosition} />
          </Form.Item>


          <Divider />
          <Form.Item label="Оклад" required name="salary" wrapperCol={{
            span: 10
          }}
          >
            <InputNumber step="100000" required style={{
              width: 200,
            }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
          <Form.Item label="Ставок" required name="salaryRate" wrapperCol={{
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

          <Form.Item label="Рабочий день" required>
            <Space>
              <Form.Item name="workHours" noStyle>
                <InputNumber style={{
                  textAlign: 'center', width: '70px'
                }} />
              </Form.Item>
              <Typography.Text>часов</Typography.Text>
            </Space>
          </Form.Item>

          <Divider />
          <Form.Item label="Режим рабочего времени" required name="workSchedule" wrapperCol={{
            span: 14
          }}
          >
            <Input placeholder="пятидневная рабочая неделя (40 часов)" />
          </Form.Item>
          <Divider />
          <Form.Item label="Дней отпуска" required name="vacationDays" wrapperCol={{
            span: 14
          }}
          >
            <InputNumber step="1" />
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
                <Space direction="vertical" style={{width: '100%'}} size="middle">
                  <Button size="large" type="primary" htmlType="submit" loading={loading} block>
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

export default CreateEmploymentOrder;