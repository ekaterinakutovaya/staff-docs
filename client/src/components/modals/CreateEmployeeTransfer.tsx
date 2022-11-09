import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Divider, Typography, Select, Grid } from 'antd';
import moment from 'moment';

import PositionSearchInput from "components/PositionSearchInput";
import additionalAgreementService from "api/additionalAgreement.service";
import orderService from "api/order.service";
import { selectOrders, selectEmployees, selectContracts, selectAdditionalAgreements } from "store/selectors";
import { Employee, Contract, AdditionalAgreement } from "store/types";
import SubmitButtonsBlock from 'components/SubmitButtonsBlock';
import NumberAndDateInputs from 'components/NumberAndDateInputs';
import DateInput from 'components/DateInput';
import WorkConditionsInputs from 'components/WorkConditionsInputs';

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

type CreateEmployeeTransferProps = {
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

const CreateEmployeeTransfer: React.FC<CreateEmployeeTransferProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const { sm, md } = useBreakpoint();
  const { orders } = useSelector(selectOrders);
  const { employees } = useSelector(selectEmployees);
  const { contracts } = useSelector(selectContracts);
  const { additionalAgreements } = useSelector(selectAdditionalAgreements);
  const [employeeId, setEmployeeId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [agreementNo, setAgreementNo] = useState<number | null>(null);
  const [prevAgreementId, setPrevAgreementId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [position, setPosition] = useState<string>('');


  useEffect(() => {
    setActiveEmployees(employees.filter((emp: Employee) => emp.isEmployed === true));

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

  const onFinish = async (values: OnFinish) => {
    // console.log('Success:', values);
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
          <NumberAndDateInputs document="order" label="Номер" />
          <Divider/>

          <Form.Item label="Сотрудник" required>
            <Select
              showSearch
              placeholder="Выбрать сотрудника"
              optionFilterProp="children"
              onChange={onSelectChange}
              onSearch={onSelectChange}
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

          <DateInput label="Дата перевода" name="agreementDate" />
          <Divider />


          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Показатели до изменения
          </Title>

          <Form.Item label="Должность" name="positionPrev" wrapperCol={{span: 14}}>
            <Input disabled />
          </Form.Item>
          <Divider />

          <WorkConditionsInputs prev='Prev' disabled={true}/>
          <Divider />

          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Изменение кадровой информации
          </Title>
          
          <Form.Item label="Должность" name="position" required rules={[{ validator: validatePosition }]}>
            <PositionSearchInput position={position} setPosition={setPosition} />
          </Form.Item>
          <Divider />

          <WorkConditionsInputs prev='' disabled={false}/>
          <Divider />

          <SubmitButtonsBlock loading={loading} onCancel={onCancel} text="Создать" />

        </Form>
      </Modal>
    </>
  );
};

export default CreateEmployeeTransfer;