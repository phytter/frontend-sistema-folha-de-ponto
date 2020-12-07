
import { useRef } from 'react';
import { Button, Input, Form } from 'antd';
import { Header, Title, Container, Popconfirm, GoBack } from '../../common/components';
import { Table, Space, Modal, Tooltip, Select } from 'antd';
import simpleTableTools ,{ simpleTableSorter } from '../../common/simpleTableTools';
import { useApiPagination } from '../../../hooks/useApi';
import { SaveOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment';
import useTools from './useTools'
import { Link } from 'react-router-dom';

 const TimeSheets = (props) => {
   const search = useRef();

   const { id_employer } = props.match.params;

   const {
    data,
    mutate,
    isLoading,
    pagination,
    handleTableChange,
  } = useApiPagination(`/time-sheets`, { sorter: '-createdAt' }, `id_employer=${id_employer}`);

  const list = data?.docs ?? [];

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
  } = useTools(list, mutate, id_employer);

  const { sort, filter } = pagination;

  const collums = [
    {
      title: 'Criado',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ...simpleTableSorter('createdAt', sort),
      render: (txt) => {
        return moment(txt).format("DD/MM/YYYY HH:mm")
      }
    },
    {
      title: 'Ano',
      dataIndex: 'year',
      key: 'year',
      // ...simpleTableSorter('year', sort),
      ...simpleTableTools('year', search, { sort, filter }),
      // render: (txt) => {
      //   return moment(txt).format("DD/MM/YYYY HH:mm")
      // }
    },
    {
      title: 'Referente á',
      dataIndex: 'regarding',
      key: 'regarding',
      ...simpleTableSorter('regarding', sort),
      render: (text) => {
        switch (text) {
          case '0,1':
            return 'Janeiro/Fevereiro'
          case '1,2':
            return 'Fevereiro/Março'
          case '2,3':
            return 'Março/Abril'
          case '3,4':
            return 'Abril/Maio'
          case '4,5':
            return 'Maio/Julho'
          case '5,6':
            return 'Julho/Junho'
          case '6,7':
            return 'Junho/Agosto'
          case '7,8':
            return 'Agosto/Setembro'
          case '8,9':
            return 'Setembro/Outubro'
          case '9,10':
            return 'Outubro/Novembro'
          case '10,11':
            return 'Novembro/Dezembro'
          case '11,0':
            return 'Dezembro/Janeiro'
          default:
            break;
        }
      }
    },
    {
      title: 'Ações',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title='Editar'>
            <Link to={`/folhas-de-ponto/${id_employer}/list/${record._id}/edit`}>
              <Button
                // onClick={() => [setSelected(record), setVisibleForm(true)]}
                size="small"
                icon={<EditOutlined />}
                />
            </Link>
          </Tooltip>
          <Popconfirm
              description={'este item'}
              onConfirm={() => handleDelete(record._id)}
            >
              <Button size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
        </Space>
      )
    }
  ]
  // const form = {}
  const Option = Select.Option;

  const openForm = () => {
    // const year =  moment(new Date()).format('YYYY');
    // console.log(year.toString())
    // setTimeout(()=>{
    //   changeForm('year', year.toString());
    // }, 100)
    setVisibleForm(true)
  }

  return <Container>
    <GoBack onClick={() => props.history.push('/folhas-de-ponto')}/>
    <Header>
      <Title>Folhas de ponto</Title>
      <Button onClick={openForm} icon={<PlusOutlined />} type='primary' >
        Novo folha de ponto
      </Button>
    </Header>
      <Table
        rowKey="_id"
        style={{ marginTop: 20 }}
        columns={collums}
        dataSource={list}
        pagination={{ ...pagination, total: data?.total }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    <Modal
      title={'Nova folha de ponto'}
      visible={visibleForm}
      onCancel={() => setVisibleForm(false)}
      okText="Salvar"
      okButtonProps={{ loading: loadingSubmit, icon: <SaveOutlined /> }}
      cancelText="Cancelar"
      onOk={() => [handleSubmit()]}
    >
      <Form.Item label='Ano' >
        <Input value={form.year} onChange={(e) => changeForm('year', e.target.value)} />
      </Form.Item>
      <Form.Item label='Referente á'>
        <Select onChange={(e) => changeForm('regarding', e)} value={form.regarding}>
          <Option value={'0,1'}>Janeiro/Fevereiro</Option>
          <Option value={'1,2'}>Fevereiro/Março</Option>
          <Option value={'2,3'}>Março/Abril</Option>
          <Option value={'3,4'}>Abril/Maio</Option>
          <Option value={'4,5'}>Maio/Julho</Option>
          <Option value={'5,6'}>Julho/Junho</Option>
          <Option value={'6,7'}>Junho/Agosto</Option>
          <Option value={'7,8'}>Agosto/Setembro</Option>
          <Option value={'8,9'}>Setembro/Outubro</Option>
          <Option value={'9,10'}>Outubro/Novembro</Option>
          <Option value={'10,11'}>Novembro/Dezembro</Option>
          <Option value={'11,0'}>Dezembro/Janeiro</Option>
        </Select>
      </Form.Item>
    </Modal>
  </Container>
 }

 export default TimeSheets;
