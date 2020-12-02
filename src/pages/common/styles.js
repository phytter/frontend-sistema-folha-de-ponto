import styled from 'styled-components';
import { Button as BtnAntd, Row } from 'antd';

export const GoBackArea = styled(Row)`
background: #eeeeee;
margin: -24px;
margin-top: -34px;
margin-bottom: 20px;
height: 45px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  padding: 0px 0px 10px 0px;
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 22px;
`;

export const Container = styled.div`
  padding: 24px;
  background: #fefefe;
  // min-height: 100%;
  // min-height: calc(100vh - 124px);
`;
