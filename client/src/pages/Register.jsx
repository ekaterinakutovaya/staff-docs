// import React, { useRef, useState } from 'react';
// import { Link } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router";
// import { Card, Button, Checkbox, Form, Input, Typography, Space, Divider } from 'antd';
// import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import { GoogleLogin, googleLogout } from '@react-oauth/google';
// import { useDispatch, useSelector } from "react-redux";
// // import { register } from "../store/actionCreators/authAction";

// const { Title } = Typography;

// const Register = () => {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const isLogin = location.pathname === '/login';
//     const { isAuth } = useSelector((state) => state.auth);


//     const onFinish = (values) => {
//         console.log('Success:', values);
//         // const { userName, email, password } = values;
//         // dispatch(register({ userName, email, password }))
//         //     .then(() => {
//         //         console.log('reg');
//         //     })

//     };

//     const onFinishFailed = (errorInfo) => {
//         console.log('Failed:', errorInfo);
//     };


//     return (
//         <div className="site-card-border-less-wrapper login-wrapper">
//             <Card style={{ width: 600 }} className="login-card">
//                 <Title level={3} style={{ textAlign: 'center' }}>Регистрация</Title>
//                 <Space direction="vertical" size={'large'} style={{ display: 'flex' }} />
//                 <Form
//                     name="normal_login"
//                     className="login-form"
//                     initialValues={{ remember: true }}
//                     onFinish={onFinish}
//                     labelCol={{ span: 8 }}
//                     wrapperCol={{ span: 24 }}
//                     autoComplete="off"
//                 >
//                     {/* <Form.Item
//                         label="Имя"
//                         name="userName"
//                         rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         label="email"
//                         name="email"
//                         // wrapperCol={{ span: 18 }}
//                         rules={[{ required: true, message: 'Пожалуйста введите email!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         label="пароль"
//                         name="password"
//                         rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
//                     >
//                         <Input
//                             prefix={<LockOutlined className="site-form-item-icon" />}
//                             type="password"
//                             placeholder="Password"
//                         />
//                     </Form.Item>


//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" className="login-form-button">
//                             Создать аккаунт
//                         </Button>
//                         <Link to="/login">Уже есть аккаунт?</Link>
//                     </Form.Item> */}

//                     {/* <Divider>Войти с</Divider>

//                     <div className="socials-login">
//                         <GoogleLogin
//                             onSuccess={(response) => console.log('Login Success')}
//                             onError={() => console.log('Login Failed')}
//                         />
                        
//                         <Button type="default">
//                             Facebook
//                         </Button>
//                     </div> */}
//                 </Form>
//             </Card>
//         </div>
//     );
// };

// export default Register;