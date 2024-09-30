import React, { createContext, useContext, useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PieChartOutlined,
  DesktopOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Breadcrumb } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, component, children) {
  return {
    key,
    icon,
    children,
    label,
    component,
  };
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />, () => <h1>Component 1</h1>),
  getItem('Option 2', '2', <DesktopOutlined />, () => <h1>Component 2</h1>),
  getItem('User', 'sub1', <UserOutlined />, null, [
    getItem('Tom', '3', null, () => <h1>Component sub1-1</h1>),
    getItem('Bill', '4', null, () => <h1>Component sub1-2</h1>),
    getItem('Alex', '5', null, () => <h1>Component sub1-3</h1>),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, null, [
    getItem('Team 1', '6', null, () => <h1>sub2-1</h1>),
    getItem('Team 2', '8', null, () => <h1>sub2-2</h1>),
  ]),
  getItem('Files', '9', <FileOutlined />, () => <h1>Component 3</h1>),
];

const NavContext = createContext();

const NavProvider = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState('1');

  return (
    <NavContext.Provider value={{ selectedNav, setSelectedNav }}>
      {children}
    </NavContext.Provider>
  );
};

const findNavItem = (items, key) => {
  for (const item of items) {
    if (item.key === key) {
      return item; 
    }
    if (item.children) {
      const found = findNavItem(item.children, key);
      if (found) return found; 
    }
  }
  return null; 
};

const NavContent = () => {
  const { selectedNav } = useContext(NavContext);

  // 使用递归查找选中的导航项
  const selectedNavObj = findNavItem(items, selectedNav);

  return selectedNavObj ? selectedNavObj.component() : <div>No Component Found</div>;
};

const Home = () => {

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <NavProvider>
      <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <NavMenu />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <NavContent/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
    </NavProvider>
  );
};

const NavMenu = () => {
  const { selectedNav, setSelectedNav } = useContext(NavContext);

  const handleClick = ({ key }) => {
    setSelectedNav(key);
  };

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={handleClick} items={items}>
      {/* {items.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))} */}
    </Menu>
  );
};

export default Home;