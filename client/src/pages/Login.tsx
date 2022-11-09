import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { Card, Button, Form, Input, Typography, Space, Divider } from 'antd';
import { GoogleLogin } from '@react-oauth/google';

import { auth } from "store/actionCreators/authAction";
import jwt_decode from "jwt-decode";

import { JwtPayloadToken } from "store/types";

const { Title } = Typography;
const sign = require('jwt-encode');


const Login = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        form.setFieldsValue({
            username: 'demo',
            password: 'demo'
        })
    }, [])


    const onFinish = (values: any) => {
        const given_name = 'demo';
        const picture = '';
        const sub = 'demo';
        const secret = 'secret';
        const data = { given_name, picture, sub }
        const token = sign(data, secret);
        dispatch(auth({ given_name, picture, sub, token }))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onSuccess = (response: any) => {
        const token = response.credential;
        const decoded = jwt_decode<JwtPayloadToken>(token);
        const { given_name, picture, sub } = decoded;
        dispatch(auth({ given_name, picture, sub, token }))
    }


    return (
        <div className="site-card-border-less-wrapper login-wrapper">
            <Card style={{ width: 475 }} className="login-card">
                <Title level={3} style={{ textAlign: 'center' }}>Логин</Title>
                <Space direction="vertical" size={'large'} style={{ display: 'flex' }} />
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Войти
                        </Button>
                    </Form.Item>

                    <Divider />
                    <div className="socials-login">
                        <GoogleLogin
                            onSuccess={onSuccess}
                            onError={() => console.log('Login Failed')}
                        />
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;