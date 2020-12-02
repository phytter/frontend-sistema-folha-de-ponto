import React from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const openNotificationStatus = (
  type,
  title,
  description,
  options = { duration: 2 },
) => {
  notification[type]({
    message: title ?? (type === 'error' ? 'Erro' : 'Sucesso !'),
    description: description ?? (type === 'error' ? 'Erro na operação' : ''),
    icon:
      type === 'error' ? (
        <WarningOutlined style={{ color: '#EF2917', marginTop: -4 }} size={30} />
      ) : (
        <CheckCircleOutlined style={{ color: '#009A48', marginTop: -4 }} size={30} />
      ),
    style: {
      display: 'flex',
      alignItems: 'center',
    },
    ...options,
  });
};

export default openNotificationStatus;
