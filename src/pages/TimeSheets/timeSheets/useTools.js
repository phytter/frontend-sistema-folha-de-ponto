import { useEffect, useState, useCallback } from 'react';
import Bread from '../../common/bread';
import openNotificationStatus from '../../common/NotificationStatus';

export default (list, mutate) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [form, setForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState(false);
  const serviceApprovalFlow = new Bread('time-sheets');

  useEffect(() => {
    if (selected && visibleForm) {
      setForm(selected);
    } else {
      setSelected(null);
      setForm({});
    }
  }, [visibleForm]);

  const changeForm = useCallback((key, value) => {
    setForm(prev => ({...prev, [key]: value}))
  }, []);


  const formataData = (data) => {
    var diaS = data.getDay();
    var diaM = data.getDate();
    var mes = data.getMonth();
    var ano = data.getFullYear();

    // switch (diaS) { //converte o numero em nome do dia
    //  case 0:
    //   diaS = "Domingo";
    //   break;
    //  case 1:
    //   diaS = "Segunda-feira";
    //   break;
    //  case 2:
    //   diaS = "Terça-feira";
    //   break;
    //  case 3:
    //   diaS = "Quarta-feira";
    //   break;
    //  case 4:
    //   diaS = "Quinta-feira";
    //   break;
    //  case 5:
    //   diaS = "Sexta-feira";
    //   break;
    //  case 6:
    //   diaS = "Sabado";
    //   break;
    //  }

    // switch (mes) { //converte o numero em nome do mês
    //  case 0:
    //   mes = "Janeiro";
    //   break;
    //  case 1:
    //   mes = "Fevereiro";
    //   break;
    //  case 2:
    //   mes = "Março";
    //   break;
    //  case 3:
    //   mes = "Abril";
    //   break;
    //  case 4:
    //   mes = "Maio";
    //   break;
    //  case 5:
    //   mes = "Junho";
    //   break;
    //  case 6:
    //   mes = "Julho";
    //   break;
    //  case 7:
    //   mes = "Agosto";
    //   break;
    //  case 8:
    //   mes = "Setembro";
    //   break;
    //  case 9:
    //   mes = "Outubro";
    //   break;
    //  case 10:
    //   mes = "Novembro";
    //   break;
    //  case 11:
    //   mes = "Dezembro";
    //   break;
    //  }

     if (diaM.toString().length == 1)
         diaM = "0"+diaM;
     if (mes.toString().length == 1)
         mes = "0"+mes;

   //  return diaS + ", " + diaM + "/" + mes + "/" + ano;
       return [diaS, parseInt(diaM), mes, ano]
   }

  const generateDays = (mes_ref) => {
    const defaultValues = {
      back_lunch: '',
      entry: '',
      out_lunch: '',
      out: '',
      h50: '',
      h100: '',
      hcan: '',
      hsan: '',
    };

    const current_date = new Date();
    const year = current_date.getFullYear();
    let [ f_month, l_month] = mes_ref;
    const day_init = new Date (year, f_month, 20 + 1);
    const day_end = new Date (year, f_month+1, 20);

    let days_arr = [];
    let f_day = formataData(day_init)
    let f_day_l_day = formataData(new Date (year, f_month+1, 0))
    const num_days = parseInt(f_day_l_day[1]) - parseInt(f_day[1]) + 21
    // days_arr.push({ day_month: f_day[1], day_week: f_day[0],month: f_day[2],id: 0, ...defaultValues})
    let it = 1
    while (it <= num_days) {
        const current_day = formataData(new Date (year, f_month, 20 + it))
        days_arr.push({
          day_month: current_day[1],
          day_week: current_day[0],
          month: current_day[2],
          id: it,
          ...defaultValues,
        })
        it++
    }

    // console.log(formataData(day_init));
    // console.log(formataData(day_end));
    return days_arr;
}

  const handleSubmit = useCallback(async () => {
    try {
      setLoadingSubmit(true);

      if (selected) {
        const resp = await serviceApprovalFlow.update(selected._id, {
          ...form,
        });
        mutate((data) => {
          const newList = data?.map((item) => {
            if (item._id === resp._id) {
              return resp;
            }
            return item;
          });
          return { ...data, docs: newList };
        });
      } else {
        let mes_ref = form.regarding?.split(',');
        const days = generateDays([parseInt(mes_ref[0]), parseInt(mes_ref[1])]);
        const resp = await serviceApprovalFlow.store({
          ...form,
          days,
        });
        mutate((data) => {
          return { total: data.total + 1, docs: [...data?.docs, resp] };
        });
      }
      openNotificationStatus('success');
      setVisibleForm(false);
    } catch (err) {
      // openNotificationStatus(
      //   'error',
      //   null,
      //   'Alguns campos não estão corretos!',
      // );
      console.log(err);
      openNotificationStatus('error');
    } finally {
      setLoadingSubmit(false);
    }
  }, [serviceApprovalFlow, mutate, selected]);

  const handleDelete = useCallback(
    async (_id) => {
      try {
        await serviceApprovalFlow.destroy(_id);
        mutate((data) => ({
          total: data.total - 1,
          docs: [...data?.docs.filter((prop) => prop._id !== _id)],
        }));
        openNotificationStatus('success');
      } catch (e) {
        openNotificationStatus('error');
      }
    },
    [serviceApprovalFlow, mutate],
  );

  return {
    handleDelete,
    handleSubmit,
    setSelected,
    setVisibleForm,
    selected,
    visibleForm,
    loadingSubmit,
    errors,
    changeForm,
    form,
  };
};
