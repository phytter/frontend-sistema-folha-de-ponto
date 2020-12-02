import './styles/App.less';
import GlobalStyle from './styles/globalStyle'
import { BrowserRouter } from 'react-router-dom';
import Painel from './Painel'

import Routes from './routes'

const App = () =>  {
  return (
    <>
      <BrowserRouter>
        <Painel>
          <Routes />
        </Painel>
      </BrowserRouter>
      <GlobalStyle />
    </>
  );
}

export default App;
