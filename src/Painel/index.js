import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import { Content, Footer, Sider, Header } from './styles';

import { useHistory } from "react-router-dom";
import 'moment/locale/pt-br';

const ContentLayout = ({ children }) => {
  let history = useHistory();

  return (
    <Layout>
      {/* <SidebarLeft collapsed={collapsed} setCollapsed={setCollapsed} /> */}
      <Header />
      <Layout style={{ marginLeft: 200 }}>
        <Sider>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => history.push("/funcionarios")}>
            Funcionários
          </Menu.Item>
          <Menu.Item key="2" icon={<FieldTimeOutlined />} onClick={() => history.push("/folhas-de-ponto")}>
            Folhas de pontos
          </Menu.Item>
        </Menu>
        </Sider>
        <Layout style={{ padding: '24px 24px 0px' }}>
          <Content>
            {children}
          </Content>
          <Footer>
            Developed by Alexandre da silva ©{moment().format('YYYY')} - v {global.appVersion}.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

ContentLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContentLayout;
