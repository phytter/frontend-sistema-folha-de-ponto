
import React, { useRef, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Input, Form, Table, Row, Col } from 'antd';
import { Container, WrapperValues, Label, Hours } from './styles'
import { Header, Title, Popconfirm,GoBack } from '../../common/components';
import InputMask from "react-input-mask";
import { baseApi as api} from '../../../config/api';
import axios from 'axios';
import moment from 'moment';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { calc_noturno, calc_horas_trabalhada, calc_100, calc_comercial } from './utils';
import openNotificationStatus from '../../common/NotificationStatus';


 const TimeSheets = (props) => {
  const [dataSource, setDataSource] = useState({});
  const [feriados, setFeriados] = useState([]);
  const [stateSave, setStateSave] = useState('save');
  const EditableContext = React.createContext();
  const { id_time_sheet, id_employer } = props.match.params

  const soma = (days) => {
    let h50 = 0, h100=0, hsan = 0, hcan = 0;
    days?.forEach(day => {
      if (day.h50)
      h50+= parseInt(day.h50);
      if (day.h100)
      h100 += parseInt(day.h100);
      if (day.hsan)
      hsan += parseInt(day.hsan);
      if (day.hcan)
      hcan += parseInt(day.hcan);
    });
    return { h50, hcan, h100, hsan };
  }

  const horas_calculadas = useMemo(()=> soma(dataSource?.days), [dataSource?.days])

  const showTime = useCallback((text) => {
    if (!text) return null;
    let d = moment.duration(text);
    const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
    return time;
  }, []);

  useEffect(()=>{
    console.log(feriados)
  }, [feriados]);

  useEffect(()=>{
    (async () => {
      const resp_time = await api.get(`/time-sheets/${id_time_sheet}`)
      setDataSource(resp_time.data)
      const { regarding } = resp_time.data;
      const [m_1, m_2] = regarding.split(',');

      const resp = await axios.get(`https://api.calendario.com.br/?json=true&ano=${resp_time.data?.year}&ibge=5102702&token=cGh5dHRlckBob3RtYWlsLmNvbSZoYXNoPTE0NDU2MTcwOQ`)

      if (parseInt(m_1) === 11) {
        const resp_newyear = await axios.get(`https://api.calendario.com.br/?json=true&ano=${parseInt(resp_time.data?.year)  + 1}&ibge=5102702&token=cGh5dHRlckBob3RtYWlsLmNvbSZoYXNoPTE0NDU2MTcwOQ`)
        setFeriados([
          ...resp.data.map(date => date.date.replace('\\', '')),
          ...resp_newyear.data.map(date => date.date.replace('\\', '')), ]);
      } else
        setFeriados([...resp.data.map(date => date.date.replace('\\', '')),]);
    })()

  }, [])

  const save = async (data) => {
    try {
      setStateSave('saving')
      const resp = await api.put(`/time-sheets/${id_time_sheet}`, data);
      setStateSave('save')
    } catch (e) {
      setStateSave('error')
      openNotificationStatus('error', null, 'Save automático falhou, clique em salvar para manter suas alterações', { duration: 5 })
      console.log('Errror ', e)
    }
  }

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
              required: false,
              message: `${title} é obrigatório.`,
            },
          ]}
        >
          <InputMask mask="99:99" onPressEnter={save} onBlur={save} >
            {(inputProps) => <Input {...inputProps}   ref={inputRef}/>}
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
    // this.setState({ dataSource: newData });

  const { createdAt, regarding} = dataSource;
  const created_at = new Date(createdAt);

  let { back_lunch, day_month, day_week, entry, out_lunch, out, month, year } = row;

  month = parseInt(month) + 1;
  if (month.toString().length == 1)
    month = "0"+month;

  let ms_h100 = 0;
  let ms_an = 0;
  let flag_next_day = false
  let hsan = 0, hcan = 0, h50 = 0;

  // Horario da primeira parte
    let [hh_out_lunch,mm_out_lunch] = out_lunch.split(':');
    hh_out_lunch = parseInt(hh_out_lunch); mm_out_lunch = parseInt(mm_out_lunch);
    let [hh_entry, mm_entry] = entry.split(':');
    hh_entry = parseInt(hh_entry); mm_entry = parseInt(mm_entry);
    if (hh_out_lunch < hh_entry) flag_next_day = true;

  // ponto da primeira parte
    let primeiraSaida = `${hh_out_lunch < hh_entry ? day_month + 1 : day_month}/${month}/${created_at.getFullYear()} ${hh_out_lunch}:${mm_out_lunch}`
    let primeiraEntrada = `${day_month}/${month}/${created_at.getFullYear()} ${hh_entry}:${mm_entry}`
    primeiraSaida = moment(primeiraSaida,"DD/MM/YYYY HH:mm")
    primeiraEntrada = moment(primeiraEntrada,"DD/MM/YYYY HH:mm")

  // Horário da segunda parte
    let [hh_out,mm_out] = out.split(':');
    hh_out = parseInt(hh_out); mm_out = parseInt(mm_out);
    let [hh_back_lunch, mm_back_lunch] = back_lunch.split(':');
    hh_back_lunch = parseInt(hh_back_lunch); mm_back_lunch = parseInt(mm_back_lunch);

  // Ponto da segunda parte
    let segundaEntrada = `${hh_back_lunch < hh_out_lunch || flag_next_day ?
      day_month + 1 : day_month
    }/${month}/${created_at.getFullYear()} ${hh_back_lunch}:${mm_back_lunch}`

    let segundaSaida = `${hh_out < hh_entry || hh_out < hh_back_lunch ? // hh_out < hh_back_lunch || hh_out < hh_out_lunch || flag_next_day ||
                            day_month + 1 : day_month
                          }/${month}/${created_at.getFullYear()} ${hh_out}:${mm_out}`
    segundaSaida = moment(segundaSaida,"DD/MM/YYYY HH:mm")
    segundaEntrada = moment(segundaEntrada,"DD/MM/YYYY HH:mm")

  const ms_tr = calc_horas_trabalhada(
    primeiraEntrada,
    primeiraSaida,
    segundaEntrada,
    segundaSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
  );
  // Math.floor(d.asHours()) + moment.utc(ms_ft).format(":mm")
  const d_htrabalhadas = moment.duration(ms_tr)
  console.log( Math.floor(d_htrabalhadas.asHours()) + moment.utc(ms_tr).format(":mm"), 'Horas trabalhadas', ms_tr);

  ms_an = calc_noturno(
    primeiraEntrada,
    primeiraSaida,
    segundaEntrada,
    segundaSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
    created_at,
    row
  );

  let ms_comercial = calc_comercial(
    primeiraEntrada,
    primeiraSaida,
    segundaEntrada,
    segundaSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
    created_at,
    row
  );

  // console.log(moment.utc(ms_an).format("hh:mm"), 'noturno');

  // Horário 100%
  ms_h100 = calc_100(
    primeiraEntrada,
    primeiraSaida,
    segundaEntrada,
    segundaSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
    day_week,
    month,
    created_at,
    day_month,
    feriados,
    year,
  )

  let converted_day = day_month;
  if (converted_day.toString().length == 1)
    converted_day = "0"+ converted_day

  const date_today  = `${converted_day}/${month}/${year}`

  let horas_normal = moment.duration('8', 'h').asMilliseconds();
  if (day_week === 6)
    horas_normal = horas_normal - moment.duration('4', 'h').asMilliseconds()
  // console.log(moment.utc(ms_comercial).format("hh:mm"), 'Horas comercial trabalhadas')

  if (ms_an) {
    hsan = (ms_comercial) <  ms_an ? (horas_normal - ms_comercial) : 0;
    hcan = ms_an - hsan
    // console.log(moment.utc(hsan).format("hh:mm"), 'hsan')
    // console.log(moment.utc(hcan).format("hh:mm"), 'hcan')
    h50 = ms_tr - horas_normal - hcan - ms_h100
  } else if ( day_week !== 0 && !feriados.includes(date_today))
    h50 = ms_tr - horas_normal
  // console.log(day_week)
  // console.log(moment.utc(h50).format("hh:mm"), 'h50')

  if(day_week === 0 || feriados.includes(date_today)) {
    ms_h100 += ms_comercial;
  }

  console.log(date_today, row)
  newData.splice(index, 1, {
    ...item,
    ...row,
    ...{hsan, hcan, h100: ms_h100, h50},
  });
  // debugger
  setDataSource(prev => ({...prev, days: newData}));
  save({ days: newData });
  // ms_ft = moment(primeiraSaida,"DD/MM/YYYY HH:mm").diff(moment(primeiraPartida,"DD/MM/YYYY HH:mm"));
  // let d = moment.duration(ms_ft);
  // first_time = Math.floor(d.asHours()) + moment.utc(ms_ft).format(":mm")
};

  const show_name_day = (dia) => {
    let diaS = '';
    switch (dia) { //converte o numero em nome do dia
      case 0:
       diaS = "Domingo";
       break;
      case 1:
       diaS = "Segunda-feira";
       break;
      case 2:
       diaS = "Terça-feira";
       break;
      case 3:
       diaS = "Quarta-feira";
       break;
      case 4:
       diaS = "Quinta-feira";
       break;
      case 5:
       diaS = "Sexta-feira";
       break;
      case 6:
       diaS = "Sabado";
       break;
      }
    return diaS
  }

  const collumns = [
    {
      title: 'Dia',
      dataIndex: 'day_month',
      width: '10%',
      render: (text, record) => {
        return `${text} ${show_name_day(record.day_week)}`
      }
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
      render: (text) => {
        if (!text) return null;
        let d = moment.duration(text);
        const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
        return time;
      }
    },
    {
      title: '100%',
      dataIndex: 'h100',
      render: (text) => {
        if (!text) return null;
        let d = moment.duration(text);
        const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
        return time;
      }
    },
    {
      title: 'HCAN',
      dataIndex: 'hcan',
      render: (text) => {
        if (!text) return null;
        let d = moment.duration(text);
        const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
        return time;
      }
    },
    {
      title: 'HSAN',
      dataIndex: 'hsan',
      render: (text) => {
        if (!text) return null;
        let d = moment.duration(text);
        const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
        return time;
      }
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
    <GoBack onClick={() => props.history.push(`/folhas-de-ponto/${id_employer}/list`)}/>
    <Header>
      <Title>Folha de ponto</Title>
      <Button
        loading={stateSave === 'saving'}
        type={stateSave === 'error' ? 'primary' : 'success'}
        onClick={() => save(dataSource)}
        icon={stateSave === 'error' ? <WarningOutlined /> : (stateSave === 'save' && <CheckCircleOutlined />)}
      >
        {stateSave === 'error' ? 'Salvar' : 'Salvo'}
      </Button>
    </Header>

    <WrapperValues>
      <Row type='flex' justify='center' gutter={30} align='middle'>
        <Col>
          <Hours>
            <Label>50%: </Label>
            {showTime(horas_calculadas?.h50)}
          </Hours>
        </Col>
        <Col>
          <Hours>
            <Label>100%: </Label>
            {showTime(horas_calculadas?.h100)}
          </Hours>
        </Col>
        <Col>
          <Hours>
            <Label>HSAN: </Label>
            {showTime(horas_calculadas?.hsan)}
          </Hours>
        </Col>
        <Col>
          <Hours>
            <Label>HCAN: </Label>
            {showTime(horas_calculadas?.hcan)}
          </Hours>
        </Col>
      </Row>
    </WrapperValues>

    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      loading={!dataSource.days}
      dataSource={dataSource.days}
      columns={columns}
      pagination={{showSizeChanger: true,}}
      rowKey='id'
    />

  </Container>
 }

 export default TimeSheets;
