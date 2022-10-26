import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Layout, Menu, MenuProps } from 'antd';
import { UserOutlined, VideoCameraOutlined, TeamOutlined, ProfileOutlined, FileDoneOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';

import { useAppDispatch } from "store/store";
import { setSelectedItem } from "store/slices/sideBarSlice";
import { selectSidebarItem } from "store/selectors";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type SideBarProps = {
    collapsed: boolean;
    setCollapsed: any;
}

const menuItems: MenuItem[] = [
    {
        key: '/companies',
        icon: <ProfileOutlined />,
        label: <Link to="/dashboard/companies">Организации</Link>
    },
    {
        key: '/employees',
        icon: <TeamOutlined />,
        label: <Link to="/dashboard/employees">Физ.лица</Link>
    },
    {
        key: '/orders',
        icon: <FileDoneOutlined />,
        label: <Link to="/dashboard/orders">Приказы</Link>
    },
]

const SideBar: React.FC<SideBarProps> = ({ collapsed, setCollapsed }) => {
    const dispatch = useAppDispatch();
    const { selectedItem } = useSelector(selectSidebarItem);

    const changeItemHandler = (e: MenuInfo) => {
        dispatch(setSelectedItem(e.key));
    }


    return (
        <Sider 
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
            collapsedWidth="0"
            onBreakpoint={broken => {
                // console.log(broken);
                setCollapsed(broken);
            }}
            onCollapse={(collapsed, type) => {
                // console.log(collapsed, type);
            }}
        >
            <div className="logo" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[`${selectedItem}`]}
                items={menuItems}
                onClick={changeItemHandler}
            />

        </Sider>
    );
};

export default SideBar;