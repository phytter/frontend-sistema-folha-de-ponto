import styled from 'styled-components';
import { Layout } from 'antd';


export const Sider = styled(Layout.Sider)`
  background: #74604D;
  overflow-y: auto;
  overflow-x: hidden;
  width: 256px;
  margin-top: 50px;
  height: calc(100vh - 50px);
  position: fixed;
  left: 0px;
`;

export const Header = styled(Layout.Header)`
  background: #74604D;
  height: 50px;
  position: fixed;
  width: 100vw;
  z-index: 1;
`;


export const Content = styled(Layout.Content)`
  margin: 0px;
  min-height: calc(100vh - 124px);
  margin-top: 50px;
  background: #fefefe;
`;

export const Footer = styled(Layout.Footer)`
  height: 50px;
  text-align: center;
  padding-bottom: 5px;
  padding: 15px;
`;

export const Title = styled.h1`
  color: white;
`;
