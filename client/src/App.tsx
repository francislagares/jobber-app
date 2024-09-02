import { BrowserRouter } from 'react-router-dom';

import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="relative flex min-h-screen w-screen flex-col">
          <AppRouter />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
