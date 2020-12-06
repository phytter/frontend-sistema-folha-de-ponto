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
  background: #9D846C;
  height: 50px;
  position: fixed;
  width: 100vw;
  z-index: 1;
  h1{
    font-family: 'Enriqueta', arial, serif; line-height: 1.25; margin: 0 0 10px; font-size: 35px; font-weight: bold;
    margin-bottom: 0px;
    color: #3D3329;
  }
  .last {
    margin-left: 7px;
    color: #181410;
  }
  -webkit-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.56);
  -moz-box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.56);
  box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.56);
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
