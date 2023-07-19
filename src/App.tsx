import Layout from './components/ui/Layout';
import Home from './pages/Home';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <>
    <GlobalStyles/>
      <Layout>
        <Home />
      </Layout>
    </>
  );
}

export default App;
