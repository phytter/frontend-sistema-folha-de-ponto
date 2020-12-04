
import React, { useRef, useContext, useState, useEffect, useMemo } from 'react';
import { Button, Input, Form, Table, Space, Modal, Tooltip } from 'antd';
import { Container } from './styles'
import { Header, Title, Popconfirm,GoBack } from '../../common/components';
import InputMask from "react-input-mask";
import { baseApi as api} from '../../../config/api';
import { ReadOutlined } from '@ant-design/icons';
import simpleTableTools from '../../common/simpleTableTools';
import { useApiPagination } from '../../../hooks/useApi';
import moment from 'moment';
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

  const TIME_MASK = [/^([0-2])/, /([0-9])/, ":", /[0-5]/, /[0-9]/]

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
        // inputRef.current.focus();
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
              message: `${title} é obrigatório.`,
            },
          ]}
        >
          {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
          {/* <InputMask ref={inputRef} mask={TIME_MASK} onPressEnter={save} onBlur={save}  /> */}
          <InputMask mask="99:99" onPressEnter={save} onBlur={save}>
            {(inputProps) => <Input {...inputProps} ref={inputRef}  />}
          </InputMask>
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
    console.log(newData)
    setDataSource(prev => ({...prev, days: newData}));
    // this.setState({ dataSource: newData });


//     back_lunch: "30:60"
// ​​
//     day_month: 20
//     ​​
//     day_week: "Segunda-feira"
//     ​​
//     entry: "20:36"
//     ​​
//     out: "10:20"
//     ​​
//     out_lunch: "10:56"
  const { createdAt, regarding} = dataSource;
  const created_at = new Date(createdAt);

  const { back_lunch, day_month, day_week, entry, out_lunch, out, month } = row;

  let ms_ft = 0;
  let [hh_out_lunch,mm_out_lunch] = out_lunch.split(':');
  hh_out_lunch = parseInt(hh_out_lunch); mm_out_lunch = parseInt(mm_out_lunch);
  let [hh_entry, mm_entry] = entry.split(':');
  hh_entry = parseInt(hh_entry); mm_entry = parseInt(mm_entry);

  const primeiraSaida = `${day_month}/${month}/${created_at.getFullYear()} ${hh_out_lunch}:${mm_out_lunch}`
  const primeiraPartida = `${day_month}/${month}/${created_at.getFullYear()} ${hh_entry}:${mm_entry}`

  if (out_lunch && entry) {
    ms_ft = moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(primeiraPartida,"DD/MM/YYYY HH:mm"));
    let d = moment.duration(ms_ft);
    const first_time = Math.floor(d.asHours()) + moment.utc(ms_ft).format(":mm")
    console.log(first_time)
  }

  let [hh_out,mm_out] = out.split(':');
  hh_out = parseInt(hh_out); mm_out = parseInt(mm_out);
  let [hh_back_lunch, mm_back_lunch] = back_lunch.split(':');
  hh_back_lunch = parseInt(hh_back_lunch); mm_back_lunch = parseInt(mm_back_lunch);

  if (out && back_lunch) {

    const segundaSaida = `${day_month}/${month}/${created_at.getFullYear()} ${hh_out}:${mm_out}`
    const segundaEntrada = `${day_month}/${month}/${created_at.getFullYear()} ${hh_back_lunch}:${mm_back_lunch}`

    const ms_lt = moment(segundaSaida,"DD/MM/YYYY HH:mm").diff(moment(segundaEntrada,"DD/MM/YYYY HH:mm"));
    let d_lt = moment.duration(ms_lt);
    const last_time = Math.floor(d_lt.asHours()) + moment.utc(ms_lt).format(":mm")
    // console.log(last_time)
    // qtd de horas trabalhado
    console.log(moment.utc(ms_ft + ms_lt).format("hh:mm"))

    const init_noturno = `${day_month}/${month}/${created_at.getFullYear()} 21:00`
    const out_noturno = `${day_month}/${month}/${created_at.getFullYear()} 05:00`

    const init_h50 = `${day_month}/${month}/${created_at.getFullYear()} 17:00`
    const out_h50 = `${day_month}/${month}/${created_at.getFullYear()} 21:00`

    let ms_an = moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(init_noturno,"DD/MM/YYYY HH:mm"));
    ms_an += moment(out_noturno,"DD/MM/YYYY HH:mm").diff(moment(segundaEntrada,"DD/MM/YYYY HH:mm"));
    console.log(moment.utc(ms_an).format("hh:mm"))

    // 50%
    let ms_h50 = moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(hh_entry < 17 ? init_h50 : primeiraPartida ,"DD/MM/YYYY HH:mm"));
    ms_h50 += moment(hh_out > 21 ? out_h50 : segundaSaida,"DD/MM/YYYY HH:mm").diff(moment(segundaEntrada,"DD/MM/YYYY HH:mm"));
    console.log(moment.utc(ms_h50).format("hh:mm"))

  }

  // 100%
  let ms_h100 = 0;
  if(day_week === 5) {
    const init_h100 = `${day_month}/${month}/${created_at.getFullYear()} 13:00`
    const out_100 = `${day_month}/${month}/${created_at.getFullYear()} 21:00`
    if (hh_entry > 13 && hh_out_lunch <= 21) {
      ms_h100 += moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(primeiraPartida,"DD/MM/YYYY HH:mm"));
    } else if (hh_out_lunch > 12 ) {
      ms_h100 += moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(init_h100,"DD/MM/YYYY HH:mm"));
    }

    if (hh_back_lunch > 13 && hh_out <= 21) {
      ms_h100 += moment(segundaSaida,"DD/MM/YYYY HH:mm").diff(moment(segundaEntrada,"DD/MM/YYYY HH:mm"));
    } else if (hh_out_lunch > 12 ) {
      ms_h100 += moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(init_h100,"DD/MM/YYYY HH:mm"));
    }
    ms_h100 += moment(segundaEntrada,"DD/MM/YYYY HH:mm").diff(moment(out_100,"DD/MM/YYYY HH:mm"));
    // if (hh_entry )
    // ms_h100 += ;
  }

  // 50%
    if (day_week < 6) {

    }

    // an
    if ( hh_entry >= 21 ) {

    }
    // const [hh_out_lunch,mm_out_lunch] = out_lunch.split(':');
    // const [hh_entry, mm_entry] = entry.split(':');
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
      rowKey='_id'
    />

  </Container>
 }

 export default TimeSheets;
