import {  GoBackArea, Header, Title, Container} from './styles'
import { Button, Popconfirm as ConfirmAntd } from 'antd';
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

export const Popconfirm = (props) => {
  return (
    <ConfirmAntd
      title={`Você tem certeza em remover ${props.description}?`}
      okText="Sim"
      cancelText="Não"
      {...props}
    />
  );
};
