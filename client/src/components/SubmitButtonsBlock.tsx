import React from 'react';
import { Form, Button, Space, Grid } from 'antd';

const { useBreakpoint } = Grid;

type SubmitButtonsBlockProps = {
  loading: boolean;
  onCancel: () => void;
  text: string;
}

const SubmitButtonsBlock: React.FC<SubmitButtonsBlockProps> = ({ loading, onCancel, text }) => {
  const { sm } = useBreakpoint();

  return (
    <>
      {
        sm ? (
          <Form.Item wrapperCol={{
            offset: 8,
            span: 16,
          }
          }>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {text}
              </Button>
              <Button onClick={onCancel}>
                Отмена
              </Button>
            </Space>

          </Form.Item >
        ) : (
          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button size="large" type="primary" htmlType="submit" loading={loading} block>
                {text}
              </Button>
              <Button size="large" onClick={onCancel} block>
                Отмена
              </Button>
            </Space>

          </Form.Item>
        )
      }
    </>
  );
};

export default SubmitButtonsBlock;