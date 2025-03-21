import axios from 'axios';
// import { logout } from '@/services/auth';
// import {
//   flashModalWithError,
//   flashWithError,
// } from '../components/common/FlashMessages';
import openNotificationStatus from '../pages/common/NotificationStatus';

// const API_URL = 'http://localhost:3003/api';
const API_URL = 'https://backend-veracruz.herokuapp.com/api'
// const cookies = new Cookies();

const baseApi = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    Authorization: {
      toString() {
        return `${axios.defaults.headers.common.Authorization}`;
      },
    },
  },
});

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.log(error, 'Failed:');

    if (!error?.response) {
      openNotificationStatus('error', null, 'Verifique sua conexão com a internet.')
    }

    // if (error?.response?.status === 403) {
    //   flashWithError(
    //     'Você não tem permissão para acessar este recurso',
    //     error.response.config &&
    //       error.response.config.url.substr(
    //         error.response.config.url.lastIndexOf('/') + 1,
    //       ),
    //   );
    // }

    // if (error?.response?.status === 401) {
    //   flashModalWithError(
    //     'Seu login expirou, por favor faça seu login novamente',
    //     undefined,
    //     {
    //       maskClosable: false,
    //       closable: false,
    //       keyboard: false,
    //       okText: 'Ir para login',
    //       onOk: () => {
    //         logout();
    //         window.location.reload();
    //         // window.location = '/';
    //       },
    //     },
    //   );
    // }



    return Promise.reject(error);
  },
);

export { baseApi, API_URL };
