
import React, { useRef, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Input, Form, Table, Row, Col } from 'antd';
import { Container, WrapperValues, Label, Hours } from './styles'
import { Header, Title, Popconfirm,GoBack } from '../../common/components';
import InputMask from "react-input-mask";
import { baseApi as api} from '../../../config/api';
import axios from 'axios';
import moment from 'moment';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { calc_noturno, calc_horas_trabalhada, calc_100, calc_comercial } from './utils_new';
import openNotificationStatus from '../../common/NotificationStatus';


 const TimeSheets = (props) => {
  const [dataSource, setDataSource] = useState({});
  const [feriados, setFeriados] = useState([]);
  const [stateSave, setStateSave] = useState('save');
  const [employer, setEmployer] = useState({});
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
    // const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
    let minutes = Math.abs(d.minutes())
    if (minutes.toString().length == 1)
      minutes = "0" + minutes;
    // const time = d.hours() + ":" + minutes

    if (d.minutes() < 0 && d.hours() === 0)
      return "-" + d.hours() + ":" + minutes
    return d.hours() + ":" + minutes;
  }, []);

  const printTime = (text, label) => {
    if (!text) return null;
    let d = moment.duration(text);
    // const time = Math.floor(d.asHours()) + moment.utc(text).format(":mm")
    let minutes = Math.abs(d.minutes())
    if (minutes.toString().length == 1)
      minutes = "0" + minutes;
    // const time = d.hours() + ":" + minutes

    if (d.minutes() < 0 && d.hours() === 0)
      return "-" + d.hours() + ":" + minutes
    // return d.hours() + ":" + minutes;
    console.log(d.hours() + ":" + minutes, label);
  }

  useEffect(()=>{
    (async () => {
      const resp_time = await api.get(`/time-sheets/${id_time_sheet}`)
      setDataSource(resp_time.data)
      const { regarding } = resp_time.data;
      const [m_1, m_2] = regarding.split(',');

      const feriados_invalidos = ['Dia Convencional', 'Facultativo']

      const resp = await axios.get(`https://api.calendario.com.br/?json=true&ano=${resp_time.data?.year}&ibge=5102702&token=cGh5dHRlckBob3RtYWlsLmNvbSZoYXNoPTE0NDU2MTcwOQ`)
                          .then(resp => {
                            let carnavais = resp.data.filter(item => item.name === 'Carnaval');
                            const tam = carnavais.length;
                            return resp.data.filter(item => {
                              if (!feriados_invalidos.includes(item.type) || (item.date === carnavais[tam-2].date && item.name === 'Carnaval'))
                                return true;
                              return false;
                            })
                          })
      if (parseInt(m_1) === 11) {
        const resp_newyear = await axios.get(`https://api.calendario.com.br/?json=true&ano=${parseInt(resp_time.data?.year)  + 1}&ibge=5102702&token=cGh5dHRlckBob3RtYWlsLmNvbSZoYXNoPTE0NDU2MTcwOQ`)
                            .then(resp => {
                              return resp.data.filter(item => {
                                if (!feriados_invalidos.includes(item.type))
                                  return true;
                                return false;
                              })
                            })
        setFeriados([
          ...resp.map(date => date.date.replace('\\', '')),
          ...resp_newyear.map(date => date.date.replace('\\', '')), ]);
      } else
        setFeriados([...resp.map(date => date.date.replace('\\', '')),]);

      try {
        const resp = await api.get(`/employers/${id_employer}`);
        setEmployer(resp.data);
      } catch (error) {
        console.log('Error employer', e);
      }
    })()

  }, [])

  const showMonth = useCallback((text) => {
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
  }, []);

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

  const handleDate = (day_month, month, year, hh_out_lunch, mm_out_lunch) => (cond) => {
    let date = null;
    if (cond) {
      let converted_day = parseInt(day_month) + 1;
      if (converted_day.toString().length == 1)
        converted_day = "0"+ converted_day
      date = new Date(year, month - 1, parseInt(converted_day), hh_out_lunch, mm_out_lunch)
    } else date = new Date(year, month - 1, day_month, hh_out_lunch, mm_out_lunch)
    return moment(date)
  }

  const calc_times = (
    noturno_ant,
    noturno,
    comercial,
    horas_normal,
    ms_h100,
    day_week,
    date_today,
    total_horas_trab,
    calculated,
  ) => {
    printTime(noturno_ant, 'noturno ant')
    printTime(noturno, 'noturno')
    printTime(comercial, 'comercial')
    // debugger
    let hsan = 0, hcan = 0, horas_t = 0, h50 = 0, h100 = 0;
    if (calculated) {
      hsan = calculated.hsan ?? 0
      hcan = calculated.hcan ?? 0
      horas_t = calculated.horas_t ?? 0
      h50 = calculated.h50 ?? 0
      h100 = calculated.h100 ?? 0
    }

    if (ms_h100) {
      h100 += ms_h100;
      horas_t += ms_h100;
    };

    if (noturno_ant) {
        if (horas_normal > 0)
          if (noturno_ant > horas_normal) {
              hsan += horas_normal;
          } else
              hsan += noturno_ant;

        if (hsan < noturno_ant)
            hcan = noturno_ant - hsan

        horas_t += noturno_ant
    }

    horas_t += comercial
    // debugger
    if(day_week === 0 || feriados.includes(date_today)) {
      h100 += comercial;
    }

    if (noturno) {
      // debugger
        let falta = horas_normal - horas_t;
        if (falta < 0) falta = 0;

        if (horas_t < horas_normal)
            if (falta > noturno) {
                hsan += noturno
            } else
                hsan += falta;

        if (falta < noturno)
            hcan += noturno - falta
        horas_t += noturno
    }
    // debugger
    if (horas_t > horas_normal) {
      h50 = total_horas_trab - horas_normal - hcan - h100;
      if (h50 < 0) h50 = 0;
    } else if (horas_t < horas_normal) {
      h50 = horas_t - horas_normal;
    } else h50 = 0

    return {
      hsan,
      hcan,
      horas_t,
      h50,
      h100,
    };
  }

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
  // let hsan = 0, hcan = 0, h50 = 0;

  // Horario da primeira parte
    let [hh_out_lunch,mm_out_lunch] = out_lunch.split(':');
    hh_out_lunch = parseInt(hh_out_lunch); mm_out_lunch = parseInt(mm_out_lunch);
    let [hh_entry, mm_entry] = entry.split(':');
    hh_entry = parseInt(hh_entry); mm_entry = parseInt(mm_entry);
    if (hh_out_lunch < hh_entry) flag_next_day = true;

  // ponto da primeira parte
    // let primeiraSaida = `${day_month}/${month}/${year} ${hh_out_lunch}:${mm_out_lunch}`
    let primeiraEntrada = `${day_month}/${month}/${year} ${hh_entry}:${mm_entry}`
    primeiraEntrada = moment(primeiraEntrada,"DD/MM/YYYY HH:mm")

    let primeiraSaida = handleDate(day_month, month, year, hh_out_lunch, mm_out_lunch)(hh_out_lunch < hh_entry);

  // Horário da segunda parte
    let [hh_out,mm_out] = out.split(':');
    hh_out = parseInt(hh_out); mm_out = parseInt(mm_out);
    let [hh_back_lunch, mm_back_lunch] = back_lunch.split(':');
    hh_back_lunch = parseInt(hh_back_lunch); mm_back_lunch = parseInt(mm_back_lunch);

    let segundaEntrada = handleDate(day_month, month, year, hh_back_lunch, mm_back_lunch)(hh_back_lunch < hh_out_lunch || flag_next_day );

    const segundaSaida = handleDate(day_month, month, year, hh_out, mm_out)(hh_out < hh_entry || hh_out < hh_back_lunch);

  if (isNaN(hh_out_lunch) && isNaN(hh_back_lunch) && !isNaN(hh_entry) && !isNaN(hh_out)) {
    const dif = segundaSaida.diff(primeiraEntrada) / 2;
    segundaEntrada = primeiraEntrada.clone();
    primeiraSaida = primeiraEntrada.clone();
    segundaEntrada.add(dif, 'ms')
    primeiraSaida.add(dif, 'ms')
    console.log(segundaEntrada.format('DD/MM/YYYY HH:mm'), primeiraSaida.format('DD/MM/YYYY HH:mm'))
  }
  // Dia de hoje
    let converted_day = day_month;
    if (converted_day.toString().length == 1)
      converted_day = "0"+ converted_day
    const date_today  = `${converted_day}/${month}/${year}`
  // Definição das horas a serem cumprida
    let horas_normal = moment.duration('8', 'h').asMilliseconds();
    if (day_week === 6)
      horas_normal = horas_normal - moment.duration('4', 'h').asMilliseconds()
    if (day_week === 0 || feriados.includes(date_today))
      horas_normal = 0

  const ms_tr_1 = calc_horas_trabalhada(
    primeiraEntrada,
    primeiraSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
  );

  const ms_tr_2 = calc_horas_trabalhada(
    segundaEntrada,
    segundaSaida,
    hh_out_lunch,
    hh_back_lunch,
    hh_entry,
    hh_out,
  );
  // Math.floor(d.asHours()) + moment.utc(ms_ft).format(":mm")
  // const d_htrabalhadas = moment.duration(ms_tr)
  // console.log( Math.floor(d_htrabalhadas.asHours()) + moment.utc(ms_tr).format(":mm"), 'Horas trabalhadas', ms_tr);

  const ms_an_1 = calc_noturno(
    primeiraEntrada,
    primeiraSaida,
    row
  );
  const ms_an_2 = calc_noturno(
    segundaEntrada,
    segundaSaida,
    row
  );

  const ms_comercial_1 = calc_comercial(
    primeiraEntrada,
    primeiraSaida,
    // created_at,
    row
  );
  const ms_comercial_2 = calc_comercial(
    segundaEntrada,
    segundaSaida,
    // created_at,
    row
  );

  console.log(moment.utc(ms_an).format("hh:mm"), 'noturno');

  // Horário 100%
  ms_h100 = calc_100(
    primeiraEntrada,
    primeiraSaida,
    day_week,
    month,
    created_at,
    day_month,
    feriados,
    year,
  )

  const ms_h100_2 = calc_100(
    segundaEntrada,
    segundaSaida,
    day_week,
    month,
    created_at,
    day_month,
    feriados,
    year,
  )
  // console.log(moment.utc(ms_comercial).format("hh:mm"),moment(ms_comercial).hours(), 'Horas comercial trabalhadas')

  const times_f = calc_times(
    ms_an_1[1],
    ms_an_1[0],
    ms_comercial_1,
    horas_normal,
    ms_h100,
    day_week,
    date_today,
    ms_tr_1 + ms_tr_2,
  );

  const times_l = calc_times(
    ms_an_2[1],
    ms_an_2[0],
    ms_comercial_2,
    horas_normal,
    ms_h100_2,
    day_week,
    date_today,
    ms_tr_1 + ms_tr_2,
    times_f,
  );

  printTime(times_l.hsan, 'hsan')
  printTime(times_l.hcan, 'hcan')
  printTime(times_l.horas_t, 'horas_t')
  printTime(times_l.h50, 'h50')

  const { hsan, hcan, h100, h50} = times_l;
  newData.splice(index, 1, {
    ...item,
    ...row,
    ...{hsan, hcan, h100, h50},
  });

  setDataSource(prev => ({...prev, days: newData}));
  save({ days: newData });
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
      // width: '10%',
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
        let minutes = Math.abs(d.minutes())
        if (minutes.toString().length == 1)
          minutes = "0" + minutes;
        // console.log(d.hours(), d.minutes())
        if (d.minutes() < 0 && d.hours() === 0)
          return "-" + d.hours() + ":" + minutes
        return d.hours() + ":" + minutes;
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

    <Hours style={{marginTop: 20,  marginBottom: 5}}>
      <Label>Funcionário: </Label>
      {employer?.name}
    </Hours>
    <Hours>
      <Label>Referente á: </Label>
      {showMonth(dataSource?.regarding)}
    </Hours>

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
