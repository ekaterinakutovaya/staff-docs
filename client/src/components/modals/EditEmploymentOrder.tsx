import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Select, Grid, Divider, InputNumber } from 'antd';
import moment from 'moment';

import contractService from "api/contract.service";
import orderService from "api/order.service";
import { selectOrders, selectContracts, selectEmployees } from "store/selectors";
import { Employee, Order, Contract } from "store/types";
import NumberAndDateInputs from 'components/NumberAndDateInputs';
import PositionSearchInput from "components/PositionSearchInput";
import WorkConditionsInputs from 'components/WorkConditionsInputs';
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';

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
  const { sm, md } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { contracts } = useSelector(selectContracts);
  const { employees } = useSelector(selectEmployees);
  const [contractId, setContractId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
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

  const validatePosition = (rule: any, value: any, callback: (error?: string) => void) => {
    if (position) {
      return Promise.resolve();
    }
    return Promise.reject('Пожалуйста выберите должность!');
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
    setPosition(null);
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
        title="Прием на работу. Редактирование*"
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
          <NumberAndDateInputs document="order" label="Номер" />
          <Divider />

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

          <Form.Item label="Дней отпуска" required name="vacationDays" wrapperCol={{ span: 14 }}>
            <InputNumber step="1" />
          </Form.Item>
          <Divider />

          <SubmitButtonsBlock text="Сохранить" onCancel={onCancel} loading={loading} />

        </Form>
      </Modal>
    </>
  );
};

export default EditEmploymentOrder;