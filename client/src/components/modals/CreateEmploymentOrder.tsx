import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Grid, Select, InputNumber, Divider } from 'antd';
import moment from 'moment';

import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectContracts, selectEmployees } from "store/selectors";
import { Employee } from "store/types";
import NumberAndDateInputs from 'components/NumberAndDateInputs';
import PositionSearchInput from "components/PositionSearchInput";
import WorkConditionsInputs from 'components/WorkConditionsInputs';
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';

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
  const { sm, md } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { contracts } = useSelector(selectContracts); 
  const { employees } = useSelector(selectEmployees);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
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
      setSelectedEmployee(null);
    }
  }, [open])

  const validatePosition = (rule: any, value: any, callback: (error?: string) => void) => {
    if (position) {
      return Promise.resolve();
    }
    return Promise.reject('Пожалуйста выберите должность!');
  };

  const onFinish = async (values: OnFinish) => {
    // console.log('Success:', values, position);
    setLoading(true);

    const orderTypeId = 0;
    const contract = await contractService.createContract({ values, position, companyId, employeeId });
    const contractId = contract.data.id;

    orderService.createOrder({ values, orderTypeId, employeeId, companyId, contractId })
      .then(() => {
        form.resetFields();
        setSelectedEmployee(null);
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
          <NumberAndDateInputs document="order" label="Номер" />
          <Divider/>

          <NumberAndDateInputs document="contract" label="Трудовой договор №" />
          <Divider />

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
            <PositionSearchInput position={position} setPosition={setPosition} />
          </Form.Item>
          <Divider />

          <WorkConditionsInputs prev='' disabled={false}/>
          <Divider />

          <Form.Item label="Дней отпуска" required name="vacationDays" wrapperCol={{ span: 14 }} >
            <InputNumber step="1" />
          </Form.Item>
          <Divider />

          <SubmitButtonsBlock text="Создать" onCancel={onCancel} loading={loading} />

        </Form>
      </Modal>
    </>
  );
};

export default CreateEmploymentOrder;