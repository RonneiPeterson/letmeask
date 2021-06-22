import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

//se der erro na importacao, instalar
//@types/react-router-dom que são os tipos
//para o typescript desse pacote, pois ele nao foi
//construido nativamente para usar o TS
import { BrowserRouter, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';



function App() {
  return (
    <BrowserRouter>
    {/* Contexto de autenticacao */}
      <AuthContextProvider>
        <Route path="/" exact><Home /></Route>
        <Route path="/rooms/new" ><NewRoom /></Route>
      </AuthContextProvider>
    </BrowserRouter>
  )
        
}

export default App;
