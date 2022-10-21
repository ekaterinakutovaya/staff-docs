import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Card, Button, Checkbox, Form, Input, Typography, Space, Divider  } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { GoogleLogin, googleLogout  } from '@react-oauth/google';
import { useDispatch, useSelector } from "react-redux";
import { auth } from "store/actionCreators/authAction";
import AuthService from "../api/auth.service";
import jwt_decode from "jwt-decode";
import jwt_encode from "jwt-encode";

import { selectAuth } from "store/selectors";
import { JwtPayloadToken } from "store/types";

const { Title } = Typography;
const sign = require('jwt-encode');


const Login = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { isAuth } = useSelector(selectAuth);

    useEffect(() => {
        form.setFieldsValue({
            username: 'demo',
            password: 'demo'
        })
    }, [])


    const onFinish = (values: any) => {
        const given_name = 'demo';
        const picture = 'https://lh3.googleusercontent.com/a/ALm5wu2RSc1LKy9wd4Fitpoe4gBeORdvu-oavVIloIG-=s96-c';
        const sub = '001296207845141885081';
        const secret= 'secret';
        const data = {
            given_name: 'demo',
            picture: 'https://lh3.googleusercontent.com/a/ALm5wu2RSc1LKy9wd4Fitpoe4gBeORdvu-oavVIloIG-=s96-c',
            sub: '001296207845141885081'
        }
        const token = sign(data, secret);
        dispatch(auth({ given_name, picture, sub, token }))
    };

    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    const onSuccess = (response:any) => {
        const token = response.credential;     
        const decoded = jwt_decode<JwtPayloadToken>(token);
        const { given_name, picture, sub } = decoded;
        dispatch(auth({given_name, picture, sub, token}))
            // .then(() => {
            //     localStorage.setItem("user", JSON.stringify(token));
            // })
        
    }


    return (
        <div className="site-card-border-less-wrapper login-wrapper">
            <Card style={{ width: 475 }} className="login-card">
                <Title level={3} style={{textAlign: 'center'}}>Логин</Title>
                <Space direction="vertical" size={'large'} style={{ display: 'flex' }} />
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 18 }}
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

                    <Divider/>
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