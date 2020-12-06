import moment from 'moment';

const calc_noturno = (
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
  ) => {
  const { day_month, month } = row;

  let init_noturno = `${day_month}/${month}/${created_at.getFullYear()} 21:00`;
  init_noturno = moment(init_noturno,"DD/MM/YYYY HH:mm");
  let out_noturno = `${day_month+1}/${month}/${created_at.getFullYear()} 05:00`;
  out_noturno = moment(out_noturno,"DD/MM/YYYY HH:mm");
  // Noturnão
  let ms_an = 0;
  // se caso só tem horario de incio e fim
  if (isNaN(hh_out_lunch) && isNaN(hh_back_lunch) && !isNaN(hh_entry) && !isNaN(hh_out)) {
    // debugger
    if (primeiraEntrada >= init_noturno && segundaSaida <= out_noturno) {
      // Entre o horário
      ms_an += segundaSaida.diff(primeiraEntrada);
    } else if (primeiraEntrada <= init_noturno && segundaSaida > init_noturno && segundaSaida <= out_noturno) {
      // Começa antes e termina no meio
      ms_an += segundaSaida.diff(init_noturno);
    } else if (primeiraEntrada >= init_noturno && primeiraEntrada < out_noturno && segundaSaida > out_noturno) {
      // Começa no meio e terminar depois
      ms_an += out_noturno.diff(primeiraEntrada);
    } else if (primeiraEntrada <= init_noturno && segundaSaida >= out_noturno) {
      // Começa antes e termina depois
      ms_an += out_noturno.diff(init_noturno);
    }
    return ms_an;
  }

  if (primeiraEntrada >= init_noturno && primeiraSaida <= out_noturno) {
    ms_an += primeiraSaida.diff(primeiraEntrada);
  } else if (primeiraEntrada <= init_noturno && primeiraSaida > init_noturno && primeiraSaida <= out_noturno) {
    ms_an += primeiraSaida.diff(init_noturno);
  } else if (primeiraEntrada >= init_noturno && primeiraEntrada < out_noturno && primeiraSaida > out_noturno) {
    ms_an += out_noturno.diff(primeiraEntrada);
  } else if (primeiraEntrada <= init_noturno && primeiraSaida >= out_noturno) {
    ms_an += out_noturno.diff(init_noturno);
  }

  if (segundaEntrada >= init_noturno && segundaSaida <= out_noturno) {
    // Entre o horário
    ms_an += segundaSaida.diff(segundaEntrada);
  } else if (segundaEntrada <= init_noturno && segundaSaida > init_noturno && segundaSaida <= out_noturno) {
    // Começa antes e termina no meio
    ms_an += segundaSaida.diff(init_noturno);
  } else if (segundaEntrada >= init_noturno && segundaEntrada < out_noturno && segundaSaida > out_noturno) {
    // Começa no meio e terminar depois
    ms_an += out_noturno.diff(segundaEntrada);
  } else if (segundaEntrada <= init_noturno && segundaSaida >= out_noturno) {
    // Começa antes e termina depois
    ms_an += out_noturno.diff(init_noturno);
  }
  return ms_an;
}


const calc_comercial = (
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
  ) => {
  const { day_month, month } = row;

  let init_comercial = `${day_month}/${month}/${created_at.getFullYear()} 05:00`;
  init_comercial = moment(init_comercial,"DD/MM/YYYY HH:mm");
  let out_comercial = `${day_month}/${month}/${created_at.getFullYear()} 21:00`;
  out_comercial = moment(out_comercial,"DD/MM/YYYY HH:mm");

  let ms_comercial = 0;
  // se caso só tem horario de incio e fim
  if (isNaN(hh_out_lunch) && isNaN(hh_back_lunch) && !isNaN(hh_entry) && !isNaN(hh_out)) {
    // debugger
    if (primeiraEntrada >= init_comercial && segundaSaida <= out_comercial) {
      // Entre o horário
      ms_comercial += segundaSaida.diff(primeiraEntrada);
    } else if (primeiraEntrada <= init_comercial && segundaSaida > init_comercial && segundaSaida <= out_comercial) {
      // Começa antes e termina no meio
      ms_comercial += segundaSaida.diff(init_comercial);
    } else if (primeiraEntrada >= init_comercial && primeiraEntrada < out_comercial && segundaSaida > out_comercial) {
      // Começa no meio e terminar depois
      ms_comercial += out_comercial.diff(primeiraEntrada);
    } else if (primeiraEntrada <= init_comercial && segundaSaida >= out_comercial) {
      // Começa antes e termina depois
      ms_comercial += out_comercial.diff(init_comercial);
    }
    return ms_comercial;
  }
  // debugger
  if (primeiraEntrada >= init_comercial && primeiraSaida <= out_comercial) {
    ms_comercial += primeiraSaida.diff(primeiraEntrada);
  } else if (primeiraEntrada <= init_comercial && primeiraSaida > init_comercial && primeiraSaida <= out_comercial) {
    ms_comercial += primeiraSaida.diff(init_comercial);
  } else if (primeiraEntrada >= init_comercial && primeiraEntrada < out_comercial && primeiraSaida > out_comercial) {
    ms_comercial += out_comercial.diff(primeiraEntrada);
  } else if (primeiraEntrada <= init_comercial && primeiraSaida >= out_comercial) {
    ms_comercial += out_comercial.diff(init_comercial);
  }
  console.log(moment.utc(ms_comercial).format("hh:mm"), ' pt1')
  if (segundaEntrada >= init_comercial && segundaSaida <= out_comercial) {
    // Entre o horário
    ms_comercial += segundaSaida.diff(segundaEntrada);
  } else if (segundaEntrada <= init_comercial && segundaSaida > init_comercial && segundaSaida <= out_comercial) {
    // Começa antes e termina no meio
    ms_comercial += segundaSaida.diff(init_comercial);
  } else if (segundaEntrada >= init_comercial && segundaEntrada < out_comercial && segundaSaida > out_comercial) {
    // Começa no meio e terminar depois
    console.log(moment.utc(out_comercial.diff(segundaEntrada)).format("hh:mm"), ' pt2')

    ms_comercial += out_comercial.diff(segundaEntrada);
  } else if (segundaEntrada <= init_comercial && segundaSaida >= out_comercial) {
    // Começa antes e termina depois
    ms_comercial += out_comercial.diff(init_comercial);
  }
  console.log(moment.utc(ms_comercial).format("hh:mm"), ' pt3')

  return ms_comercial;
}

const calc_horas_trabalhada = (
  primeiraEntrada,
  primeiraSaida,
  segundaEntrada,
  segundaSaida,
  hh_out_lunch,
  hh_back_lunch,
  hh_entry,
  hh_out,
) => {
  // se caso só tem horario de incio e fim
  // debugger
  if (isNaN(hh_out_lunch) && isNaN(hh_back_lunch) && !isNaN(hh_entry) && !isNaN(hh_out)) {
    const ms = segundaSaida.diff(primeiraEntrada);
    return ms;
  }
  // debugger
  const ms_ft = primeiraSaida.diff(primeiraEntrada);
  const ms_lt = segundaSaida.diff(segundaEntrada);
  // console.log(moment.utc(ms_lt).format("hh:mm"), 'l time')
  // console.log(moment.utc(ms_ft).format("hh:mm"), 'f time')
  // const supposed = moment.duration(ms_ft).add(moment.duration(ms_lt)).asHours();
  // console.log(moment.utc(ms_ft + ms_lt).format("hh:mm"), 'f time', supposed)
  return ms_ft + ms_lt;
  // const first_time = Math.floor(d.asHours()) + moment.utc(ms_ft).format(":mm")
}

const calc_100 = (
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
  day_month
) => {
  // 100% no sabádo
  if (day_week === 6) {
    let init_h100 = `${day_month + 1}/${month}/${created_at.getFullYear()} 05:00`
      init_h100 = moment(init_h100,"DD/MM/YYYY HH:mm")
    let out_100 = `${day_month + 1}/${month}/${created_at.getFullYear()} 21:00`
      out_100 = moment(out_100,"DD/MM/YYYY HH:mm")
    // debugger
    if (isNaN(hh_out_lunch) && isNaN(hh_back_lunch) && !isNaN(hh_entry) && !isNaN(hh_out) && segundaSaida > init_h100) {
      const ms = segundaSaida.diff(init_h100);
      return ms;
    }
    let ms_h100 = 0
    if (primeiraSaida > init_h100 && primeiraEntrada < init_h100) {
      ms_h100 += init_h100.diff(primeiraSaida);
    }

    if (segundaSaida > init_h100 && segundaEntrada < init_h100) {
      ms_h100 +=  segundaSaida.diff(init_h100);
    }

    console.log(moment.utc(ms_h100).format("hh:mm"), 'Horas 100%')
    return ms_h100;
  }

  return 0;
};

export { calc_noturno, calc_horas_trabalhada, calc_100, calc_comercial };
