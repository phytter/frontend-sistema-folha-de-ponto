
import React, { useRef, useContext, useState, useEffect, useMemo } from 'react';
import { Button, Input, Form, Table, Space, Modal, Tooltip } from 'antd';
import { Container } from './styles'
import { Header, Title, Popconfirm,GoBack } from '../../common/components';
import { baseApi as api} from '../../../config/api';
import { ReadOutlined } from '@ant-design/icons';
import simpleTableTools from '../../common/simpleTableTools';
import { useApiPagination } from '../../../hooks/useApi';
import { SaveOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
// import useTools from './useTools'

 const TimeSheets = (props) => {
  const [dataSource, setDataSource] = useState({});
  const EditableContext = React.createContext();
  const { id_time_sheet } = props.match.params

  useEffect(()=>{
    (async () => {
      const resp = await api.get(`/time-sheets/${id_time_sheet}`)
      setDataSource(resp.data)
    })()
  }, [])

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);

    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async e => {
      try {
        const values = await form.validateFields();

        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleSave = row => {
    const newData = [...dataSource.days];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(prev => ({...prev, days: newData}))
    // this.setState({ dataSource: newData });
  };

  const collumns = [
    {
      title: 'Dia',
      dataIndex: 'day_month',
      width: '10%',
    },
    {
      title: 'Entrada',
      dataIndex: 'entry',
      width: '10%',
      editable: true,
    },
    {
      title: 'Saída para almoço',
      dataIndex: 'out_lunch',
      width: '10%',
      editable: true,
    },
    {
      title: 'Retorno do almoço',
      dataIndex: 'back_lunch',
      width: '10%',
      editable: true,
    },
    {
      title: 'saída',
      dataIndex: 'out',
      width: '10%',
      editable: true,
    },
    {
      title: '50%',
      dataIndex: 'h50',
    },
    {
      title: '100%',
      dataIndex: 'h100',
    },
    {
      title: 'HCAN',
      dataIndex: 'hcan',
    },
    {
      title: 'HSAN',
      dataIndex: 'hsan',
    },
  ]

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = useMemo(() => {
    return collumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });
  }, [collumns]);

  return <Container>
    <GoBack onClick={() => props.history.push(`/folhas-de-ponto/3/list`)}/>
    <Header>
      <Title>Folha de ponto</Title>
    </Header>

    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource.days}
      columns={columns}
    />

  </Container>
 }

 export default TimeSheets;
