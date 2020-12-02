import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { useLocation, useHistory } from 'react-router-dom';
import _ from 'lodash';
import { baseApi as api } from '../config/api';

export function useApiPagination(url, defaul, params) {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const lastList = useRef(null);
  const location = useLocation();
  const history = useHistory();

  const {
    pageSize: page_size,
    current: page_num,
    searchjson,
    sort,
    filter,
  } = pagination;

  const { data, error, mutate } = useSWR(
    `${url}?page_size=${page_size ?? 10}&page_num=${page_num ?? 1}${
      defaul?.params ? `&${defaul?.params}` : ''
    }${searchjson ? `&searchjson=${searchjson}` : ''}${
      sort ? `&sort=${sort}` : `&sort=${defaul?.sorter}`
    }${filter ? `&filter=${filter}` : ``}${params ? `&${params}` : ''}`,
    async (url) => {
      const response = await api.get(url);
      return response.data;
    },
    {},
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let page = parseInt(searchParams.get('page') ?? 1);
    let pageSize = parseInt(searchParams.get('pageSize') ?? 10);
    let searchjson = searchParams.get('searchjson');
    let sort = searchParams.get('sort') ?? '';
    let filter = searchParams.get('filter') ?? '';

    // if (!page && !pageSize) return;
    if (page < 1) page = 1;
    if (pageSize > 100) pageSize = 100;
    if (pageSize < 1) pageSize = 10;

    setPagination((prev) => ({
      ...prev,
      current: page ?? 1,
      pageSize: pageSize ?? 10,
      total: data?.total,
      searchjson,
      sort,
      filter,
    }));
  }, [location.search]);

  useEffect(() => {
    if (!data) return;
    lastList.current = data;
  }, [data]);

  const handleTableChange = useCallback(
    (paginate, filters, sorter) => {
      let search = {};
      Object.keys(filters).forEach((key_search) => {
        if (!filters?.[key_search]?.[0]) return;
        search = { ...search, [key_search]: filters?.[key_search]?.[0] };
      });

      const sort = sorter.order
        ? `${sorter.order === 'descend' ? '-' : ''}${sorter.field}`
        : '';
      const searchParams = new URLSearchParams(location.search);
      const { current, pageSize } = paginate;
      searchParams.set('page', current);
      searchParams.set('pageSize', pageSize);

      if (sort) searchParams.set('sort', sort);
      else searchParams.delete('sort');

      if (_.keys(search).length)
        searchParams.set('filter', encodeURIComponent(JSON.stringify(search)));
      else searchParams.delete('filter');

      const url_l = location.pathname.split('?')[0];
      history.push(`${url_l}?${searchParams.toString()}`);
    },
    [history, location],
  );

  return {
    data: data ?? lastList.current,
    error,
    mutate,
    isLoading: !error && !data,
    pagination: { ...pagination, total: data?.total ?? pagination.total ?? 0 },
    handleTableChange,
  };
}
