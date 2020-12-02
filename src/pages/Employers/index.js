
import { Button } from 'antd';
// import { Container } from './styles'
import { Header, Title, Container } from '../common/components'
import { Table, Space, Modal, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

 const Employers = () => {

  return <Container>
    <Header>
      <Title>Funcionários</Title>
      <Button
        onClick={() => setVisibleForm(true)}
        icon={<PlusOutlined />}
        type="primary"
      >
        Adicionar
      </Button>
    </Header>
      <Table
        rowKey="id"
        style={{ marginTop: 20 }}
        columns={[]}
        dataSource={[]}
        // pagination={{ ...pagination, total: data?.total }}
        // onChange={handleTableChange}
        // loading={isLoading}
      />

  </Container>
 }

 export default Employers;
