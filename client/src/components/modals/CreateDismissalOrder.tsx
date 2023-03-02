import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, InputNumber, notification, Divider, Select } from 'antd';
import moment from 'moment';

import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectEmployees, selectContracts } from "store/selectors";
import { Employee, Contract } from "store/types";
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';
import NumberAndDateInputs from 'components/NumberAndDateInputs';
import DateInput from 'components/DateInput';

const { Option } = Select;
const { TextArea } = Input;

type CreateDismissalOrderProps = {
  open: boolean;
  setOpen: (boolean: boolean) => void;
}

type OnFinish = {
  orderNo: number;
  orderDate: Date;
  dismissalDate: Date;
  groundsForDismissal: string;
  compensationDays: number;
  averageSalary: number;
}

const CreateDismissalOrder: React.FC<CreateDismissalOrderProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    setActiveEmployees(employees.filter((emp: Employee) => emp.isEmployed === true));

    form.setFieldsValue({
      orderNo: orders.length + 1,
      orderDate: moment(Date.now()),
      dismissalDate: moment(Date.now())
    })

    return () => {
      form.resetFields();
      setSelectedEmployee(null);
    }
  }, [open])



  const onFinish = async (values: OnFinish) => {
    // console.log('Success:', values);
    setLoading(true);
    const { dismissalDate } = values;

    const orderTypeId = 2;
    const contract = contracts.filter((contract: Contract) => contract.employeeId === employeeId && contract.dismissalDate === null)[0];

    if (contract) {
      let contractId = contract.id;
      contractService.cancelContract({ dismissalDate, employeeId });
      orderService.createDismissalOrder({ values, orderTypeId, employeeId, contractId, companyId })
        .then(() => {
          form.resetFields();
          setSelectedEmployee(null);
          setLoading(false);
          setOpen(false);
        })
    } else {
      notification.error({
        message: `Договор с указанным физ.лицом не найден!`,
        placement: 'top',
      });
      setLoading(false);
    }
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
        title="Увольнение. Новый приказ*"
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
          <NumberAndDateInputs document="order" label="Номер" />
          <Divider/>

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
              {activeEmployees?.map((emp: Employee, index: number) => (
                <Option key={index} value={emp.id} label={`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}>

                  {`${emp.employeeFamilyName} ${emp.employeeFirstName} ${emp.employeePatronymic}`}

                </Option>
              ))}
            </Select>
          </Form.Item>
          <Divider/>

          <DateInput label="Дата увольнения" name="dismissalDate" />

          <Form.Item label="Основание увольнения" name="groundsForDismissal" wrapperCol={{
            span: 14
          }} rules={[{ required: true, message: 'Пожалуйста заполните поле!' }]}
          >
            <TextArea rows={2} />
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
          <Divider />

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

          <SubmitButtonsBlock loading={loading} onCancel={onCancel} text="Создать" />

        </Form>
      </Modal>
    </>
  );
};

export default CreateDismissalOrder;