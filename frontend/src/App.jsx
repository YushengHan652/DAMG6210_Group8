import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AppProvider } from '../src/context/AppContext';
import Header from '../src/components/common/Header';
import Footer from '../src/components/common/Footer';
import routes from '../src/routes';

const App = () => {
  const content = useRoutes(routes);

  return (
    <AppProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            {content}
          </div>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;