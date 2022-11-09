import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Modal, Form, Input, Button, DatePicker, InputNumber, Space, Row, Col, Select, Typography, Grid, Divider } from 'antd';
import moment from 'moment';

import { selectCompanies } from "store/selectors";

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];
const { useBreakpoint } = Grid;

type WorkConditionsInputsProps = {
  prev: string;
  disabled: boolean;
}

const WorkConditionsInputs: React.FC<WorkConditionsInputsProps> = ({prev = '', disabled = false}) => {
  const { companyDetails } = useSelector(selectCompanies);
  const [registerDate, setRegisterDate] = useState<string | null>(null);
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  console.log(`salary${prev}`);
  

  useEffect(() => {
    if (companyDetails.length > 0) {
      setRegisterDate(companyDetails[0]?.registerDate);
    }
  }, [])


  return (
    <>
      <Form.Item label="Оклад" required name={`salary${prev}`} wrapperCol={{ span: 10 }}>
        <InputNumber step="100000" required style={{ width: 200 }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item label="Ставок" required name={`salaryRate${prev}`} wrapperCol={{ span: 2 }}>
        <InputNumber step="0.25" disabled={disabled} />
      </Form.Item>
      <Divider />

      <Form.Item label="Часы работы" required>
        <Input.Group size="default" >
          <Row>
            {md ? (
              <>
                <Form.Item name={`workHoursStart${prev}`}  label="с" style={{ marginRight: '10px' }}>
                  <InputNumber disabled={disabled} />
                </Form.Item>
                <Form.Item name={`workHoursEnd${prev}`} label="до">
                  <InputNumber disabled={disabled} />
                </Form.Item>
              </>
            ) : (
              <Space>
                <Col span={10}>
                    <Form.Item name={`workHoursStart${prev}`} label="с">
                      <InputNumber disabled={disabled} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name={`workHoursEnd${prev}`} label="до">
                      <InputNumber disabled={disabled} />
                  </Form.Item>
                </Col>
              </Space>
            )}

          </Row>
        </Input.Group>
      </Form.Item>

      <Form.Item label="Рабочий день" required>
        <Space>
          <Form.Item name={`workHours${prev}`} noStyle>
            <InputNumber disabled={disabled} />
          </Form.Item>
          <Typography.Text>часов</Typography.Text>
        </Space>
      </Form.Item>

      <Divider />
      <Form.Item label="Режим рабочего времени" required name={`workSchedule${prev}`}  wrapperCol={{
        span: 14
      }}
      >
        <Input placeholder="пятидневная рабочая неделя (40 часов)" disabled={disabled} />
      </Form.Item>
    </>
  );
};

export default WorkConditionsInputs;