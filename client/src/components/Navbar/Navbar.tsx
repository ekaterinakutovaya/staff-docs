import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Button, Space, Typography, Avatar, Grid } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

import { useAppDispatch } from "store/store";
import { logout } from "store/actionCreators/authAction";
import { selectAuth, selectCompanies } from "store/selectors";

import './Navbar.scss';

const { Title } = Typography;
const { useBreakpoint } = Grid;


const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const {md} = useBreakpoint();
  const myFontSize = md ? '18px' : '12px';
  const { picture, sub } = useSelector(selectAuth);
  const { currentCompany } = useSelector(selectCompanies);
  const [currentCompanyTitle, setCurrentCompanyTitle] = useState<string | ''>('');
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (currentCompany) {
      // Set actual company name
      setCurrentCompanyTitle(currentCompany.companyName);
    }
    
    if (sub === 'demo') {
      setDemo(true);
    }

    return () => {
      setCurrentCompanyTitle('');
    }

  }, [currentCompany])


  const onLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="navbar">
      <div className="company-wrapper">
        {currentCompanyTitle ? (
          <Title level={5} style={{ fontSize: myFontSize }}>{currentCompanyTitle}</Title>
        ) : (
          ''
        )}

      </div>
      <div>
        <Space>
          {demo ? (
            <Avatar size={32} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          ) : (
              <Avatar src={picture} size={32} />
          )}
          
          <Button onClick={() => {
            googleLogout();
            onLogout();
          }}>Выйти</Button>
        </Space>
      </div>
    </div>
  );
};

export default Navbar;