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
  notification,
  Divider, Select, Grid
} from 'antd';
import moment from 'moment';

import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectEmployees, selectContracts, selectCompanies } from "store/selectors";
import { Employee, Contract, Order } from "store/types";

const { Option } = Select;
const { useBreakpoint } = Grid;
const { TextArea } = Input;
const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];

type EditDismissalOrderProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  orderId: number;
}

type OnFinish = {
  orderNo: number;
  orderDate: Date;
  dismissalDate: Date;
  groundsForDismissal: string;
  compensationDays: number;
  averageSalary: number;
}

const EditDismissalOrder: React.FC<EditDismissalOrderProps> = ({ open, setOpen, orderId }) => {
  const [form] = Form.useForm();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const { companyDetails } = useSelector(selectCompanies);
  const [employeeId, setEmployeeId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [contractId, setContractId] = useState<number | null>(null);
  const [registerDate, setRegisterDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // const [selectedEmployee, setSelectedEmployee] = useState(null);


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

    form.setFieldsValue({
      orderNo: order?.orderNo,
      orderDate: moment(order?.orderDate),
      personalId: employee?.personalId,
      employeeFamilyName: employee?.employeeFamilyName,
      employeeFirstName: employee?.employeeFirstName,
      employeePatronymic: employee?.employeePatronymic,
      dismissalDate: moment(order?.dismissalDate),
      groundsForDismissal: order?.groundsForDismissal,
      compensationDays: order?.compensationDays,
      averageSalary: order?.averageSalary
    })

    return () => {
      form.resetFields();
    }
  }, [open])

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
    console.log('Success:', values);
    const { dismissalDate } = values;
    setLoading(true);
    contractService.cancelContract({ dismissalDate, employeeId });
    orderService.editDismissalOrder({ values, orderId })
      .then(() => {
        setLoading(false);
        setOpen(false);
        setSelectedEmployee(null);
        form.resetFields();
      })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setLoading(false);
  };

  const onCancel = () => {
    setOpen(false);
    setSelectedEmployee(null);
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
        title="Увольнение. Редактирование*"
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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          preserve={false}
        >
          <Form.Item label="Номер" required>
            {md ? (
              <Input.Group size="default">
                <Row>
                    <Form.Item name="orderNo"
                      rules={[{ required: true, message: 'Пожалуйста введите номер приказа!' }]}
                    >
                      <InputNumber style={{marginRight: '10px'}}/>
                    </Form.Item>
                    <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                      <DatePicker format={dateFormatList} />
                    </Form.Item>
                </Row>
              </Input.Group>
            ) : (
              <>
                <Form.Item name="orderNo"
                  rules={[{ required: true, message: 'Пожалуйста введите номер приказа!' }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item name="orderDate" label="от" rules={[{ validator: validateDate }]}>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </>
            )}

          </Form.Item>
          <Divider/>

          <Form.Item label="Физ.лицо">
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
              disabled
            >
              {employees?.map((emp: Employee, index: number) => (
                <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>

                  {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}

                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider />

          <Form.Item label="Дата увольнения" name="dismissalDate" rules={[{ validator: validateDate }]}>
            <DatePicker format={dateFormatList} />
          </Form.Item>


          <Form.Item label="Основание увольнения" name="groundsForDismissal" wrapperCol={{
            span: 14
          }} rules={[{ required: true, message: 'Пожалуйста заполните поле!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Divider />

          <Form.Item label="Дней компенсации за неисп.отпуск" name="compensationDays" wrapperCol={{
            span: 14
          }} rules={[{ required: true, message: 'Пожалуйста заполните поле!' }]}
          >
            <InputNumber style={{
              textAlign: 'center'
            }} />
          </Form.Item>
          <Form.Item label="Среднемес. заработная плата" name="averageSalary" wrapperCol={{
            span: 14
          }} rules={[{ required: true, message: 'Пожалуйста заполните поле!' }]}
          >
            <InputNumber step="100000" style={{
              width: 200,
            }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
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

export default EditDismissalOrder;