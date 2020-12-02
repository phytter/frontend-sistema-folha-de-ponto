import React from 'react';
import { Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';

export const simpleTableSearch = (dataIndex, searchInput, filter) => {
  const handleSearch = (s, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const filter_decoded = filter ? JSON.parse(decodeURIComponent(filter)) : {};
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Pesquisar`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 100 }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    // onFilter: (value, record) => null,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    filteredValue: filter_decoded?.[dataIndex]
      ? [filter_decoded?.[dataIndex]]
      : null,
    // render: text =>
    //   this.state.searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[this.state.searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  };
};

export const simpleTableSorter = (key, sort) => {
  const sorter = sort?.split('-');
  const order = sorter?.length === 2 ? 'descend' : 'ascend';
  return {
    sorter: () => null,
    showSorterTooltip: false,
    sortOrder: _.last(sorter) === key && order,
  };
};

const simpleTableTools = (dataIndex, searchInput, opt) => {
  const { sort, filter } = opt;

  return {
    ...simpleTableSorter(dataIndex, sort),
    ...simpleTableSearch(dataIndex, searchInput, filter),
  };
};

export default simpleTableTools;
