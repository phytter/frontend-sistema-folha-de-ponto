import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Row } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import { Content, Footer, Sider, Header } from './styles';

import { useHistory, useLocation } from "react-router-dom";
import 'moment/locale/pt-br';

const ContentLayout = ({ children }) => {
  let history = useHistory();
  const location = useLocation();
  const openKey = [ location.pathname.split('/')[1] ]
  return (
    <Layout>
      <Header >
        <Row type="flex" justify="end" style={{ height: '100%'}} align='middle'>
          <h1>Fazenda</h1>
          <h1 className='last'>Vera Cruz</h1>
        </Row>
      </Header>
      <Layout style={{ marginLeft: 200 }}>
        <Sider>
        <Menu
          mode="inline"
          defaultSelectedKeys={[]}
          defaultOpenKeys={[]}
          selectedKeys={openKey}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="funcionarios" icon={<UserOutlined />} onClick={() => history.push("/funcionarios")}>
            Funcionários
          </Menu.Item>
          <Menu.Item key="folhas-de-ponto" icon={<FieldTimeOutlined />} onClick={() => history.push("/folhas-de-ponto")}>
            Folhas de pontos
          </Menu.Item>
        </Menu>
        </Sider>
        <Layout style={{ padding: '24px 24px 0px' }}>
          <Content>
            {children}
          </Content>
          <Footer>
            Developed by Alexandre da silva ©{moment().format('YYYY')} - v 1.0.0{global.appVersion}.
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
