
import { useRef } from 'react';
import { Button, Input, Form } from 'antd';
// import { Container } from './styles'
import { Header, Title, Container, Popconfirm } from '../common/components';
import { Table, Space, Modal, Tooltip } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import simpleTableTools from '../common/simpleTableTools';
import { useApiPagination } from '../../hooks/useApi';
import { SaveOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import useTools from './useTools'

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

  const {
    handleDelete,
    handleSubmit,
    setSelected,
    selected,
    errors,
    visibleForm,
    setVisibleForm,
    loadingSubmit,
    form,
    changeForm
  } = useTools(list, mutate);

  const { sort, filter } = pagination;

  const collums = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      ...simpleTableTools('name', search, { sort, filter }),
    },
    {
      title: 'Ações',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title='Editar'>
            <Button
              onClick={() => [setSelected(record), setVisibleForm(true)]}
              size="small"
              icon={<EditOutlined />}
              />
          </Tooltip>
          <Popconfirm
              description={record.name}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
        </Space>
      )
    }
  ]
  // const form = {}

  return <Container>
    <Header>
      <Title>Funcionários</Title>
      <Button onClick={() => setVisibleForm(true)} icon={<PlusOutlined />} type='primary' >
        Novo funcionário
      </Button>
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
    <Modal
      title={selected ? 'Editar funcionário' : 'Novo funcionário'}
      visible={visibleForm}
      onCancel={() => setVisibleForm(false)}
      okText="Salvar"
      okButtonProps={{ loading: loadingSubmit, icon: <SaveOutlined /> }}
      cancelText="Cancelar"
      onOk={() => [handleSubmit(), console.log(form)]}
    >
      <Form.Item label='Nome'>
        <Input value={form.name} onChange={(e) => changeForm('name', e.target.value)} />
      </Form.Item>
      <Form.Item label='CPF'>
        <Input value={form.cpf} onChange={(e) => changeForm('cpf', e.target.value)} />
      </Form.Item>
    </Modal>
  </Container>
 }

 export default TimeSheets;
