
import { useRef } from 'react';
import { Button } from 'antd';
// import { Container } from './styles'
import { Header, Title, Container } from '../common/components';
import { Table, Space, Modal, Tooltip } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import simpleTableTools from '../common/simpleTableTools';
import { useApiPagination } from '../../hooks/useApi';
import { Link } from 'react-router-dom';

 const TimeSheets = () => {
   const search = useRef();

   const {
    data,
    mutate,
    isLoading,
    pagination,
    handleTableChange,
  } = useApiPagination(`/employers`, { sorter: 'name' });

  const list = data ?? [];

  const collums = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      ...simpleTableTools('name', search, { sorter: 'name' }),
    },
    {
      title: 'Ações',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title='Ver folhas de ponto'>
            <Link to={`/folhas-de-ponto/${record.id}/list`}>
              <Button
                // onClick={() => [setSelected(record), setVisibleForm(true)]}
                size="small"
                icon={<ReadOutlined />}
                />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ]

  return <Container>
    <Header>
      <Title>Folhas de ponto</Title>
    </Header>
      <Table
        rowKey="id"
        style={{ marginTop: 20 }}
        columns={collums}
        dataSource={list}
        pagination={{ ...pagination, total: data?.total }}
        onChange={handleTableChange}
        loading={isLoading}
      />

  </Container>
 }

 export default TimeSheets;
