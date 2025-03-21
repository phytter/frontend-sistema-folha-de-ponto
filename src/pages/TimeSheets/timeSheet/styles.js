import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  background: #fefefe;

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }

  [data-theme='dark'] .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #434343;
  }
`;

export const WrapperValues = styled.div`
  padding: 20px;
  width: 90%;
  background-color: #EEEEEE;
  margin: 20px auto
`;

export const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
`;

export const Hours = styled.div`
  display: flex;
  align-items: baseline;
`;
