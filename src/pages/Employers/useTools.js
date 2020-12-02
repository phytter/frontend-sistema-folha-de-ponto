import { useEffect, useState, useCallback } from 'react';
import Bread from '../common/bread';
import openNotificationStatus from '../common/NotificationStatus';

export default (list, mutate) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [form, setForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState(false);
  const serviceApprovalFlow = new Bread('employers');

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

  const handleSubmit = useCallback(async () => {
    try {
      setLoadingSubmit(true);

      if (selected) {
        const resp = await serviceApprovalFlow.update(selected.id, {
          ...form,
        });
        mutate((data) => {
          const newList = data?.map((item) => {
            if (item.id === resp.id) {
              return resp;
            }
            return item;
          });
          // return { ...data, docs: newList };
          return newList;
        });
      } else {
        const resp = await serviceApprovalFlow.store({
          ...form,
        });
        mutate((data) => {
          // return { total: data.total + 1, docs: [...data?.docs, resp] };
          return[...data, resp];
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
    async (id) => {
      // try {
      //   await serviceApprovalFlow.destroy(id);
      //   mutate((data) => ({
      //     total: data.total - 1,
      //     docs: [...data?.docs.filter((prop) => prop.id === id)],
      //   }));
      //   openNotificationStatus('success');
      // } catch (e) {
      //   openNotificationStatus('error');
      // }
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
