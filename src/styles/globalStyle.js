import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin:0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html, body,#root {
    min-height: 100%;
  }

  body{
    -webkit-font-smoothing: antialiased !important;
  }

  button{
    cursor: pointer;
  }

  body, input, Button{
    font: 16px sans-serif;
  }
`;
