import {  GoBackArea, Header, Title, Container} from './styles'
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export { Header, Title, Container };

export const GoBack = ({ onClick }) => {
  return (
    <GoBackArea>
      <Button icon={<ArrowLeftOutlined />} onClick={onClick}>
        Voltar para tela anterior
      </Button>
    </GoBackArea>
  );
};
