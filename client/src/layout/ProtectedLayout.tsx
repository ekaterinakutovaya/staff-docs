import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Navigate, useOutlet } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

import Navbar from 'components/Navbar/Navbar';
import SideBar from "components/SideBar";
import { selectAuth } from "store/selectors";

const { Header, Content } = Layout;

const ProtectedLayout: React.FC = () => {
  const { isAuth } = useSelector(selectAuth);
  const [collapsed, setCollapsed] = useState(false);
  const outlet = useOutlet();
  

  if (!isAuth) {
    return <Navigate to="/login"/>
  }

  return (
    <>
      <Layout>
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
              <Navbar/>
          </Header>
          <Content
            className="site-layout-background content-wrapper"
            style={{
              margin: '24px 16px',
              padding: 24,
              // minHeight: 280,
              display: 'block',
              overflow: 'initial'
            }}
          >
            {outlet}
        </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default ProtectedLayout;