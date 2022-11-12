import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, DatePicker, InputNumber, Space, Row, Col, Select, Typography, Grid, Divider } from 'antd';
import moment from 'moment';

import { selectCompanies } from "store/selectors";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;

type NumberAndDateInputsProps = {
  document: string;
  label: string;
}


const NumberAndDateInputs: React.FC<NumberAndDateInputsProps> = ({ document, label }) => {
  const { companyDetails } = useSelector(selectCompanies);
  const [registerDate, setRegisterDate] = useState<string | null>(null);
  const { sm, md, lg, xl, xxl } = useBreakpoint();

  useEffect(() => {
    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }
  }, [])

  const validateDate = (rule: any, value: any, callback: (error?: string) => void) => {
    if (value === null) {
      return Promise.reject('Пожалуйста введите дату!');
    } else if (moment(value).isBefore(registerDate, 'day'))
      return Promise.reject('Дата документа не может быть раньше даты регистрации организации!');
    else {
      return Promise.resolve();
    }
  };

  return (
    <>
      <Form.Item label={label} required>
        {md ? (
          <Input.Group size="default">
            <Row wrap={false}>
              <Form.Item name={`${document}No`} >
                <InputNumber style={{ width: '70px', marginRight: '10px' }} />
              </Form.Item>

              <Form.Item name={`${document}Date`} label="от" rules={[{ validator: validateDate }]}>
                <DatePicker format={dateFormatList} />
              </Form.Item>
            </Row>
          </Input.Group>
        ) : (
          <>
              <Form.Item name={`${document}No`}>
              <InputNumber style={{ width: '70px' }} />
            </Form.Item>

              <Form.Item name={`${document}Date`} label="от" rules={[{ validator: validateDate }]}>
              <DatePicker format={dateFormatList} />
            </Form.Item>
          </>
        )}

      </Form.Item>
    </>
  );
};

export default NumberAndDateInputs;