import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

//se der erro na importacao, instalar
//@types/react-router-dom que são os tipos
//para o typescript desse pacote, pois ele nao foi
//construido nativamente para usar o TS
import { BrowserRouter, Route,Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { LIstRooms } from './pages/ListRooms';



function App() {
  return (
    <BrowserRouter>
    {/* Contexto com o tema */}
    <ThemeContextProvider>
      {/* Contexto de autenticacao */}
        <AuthContextProvider>
          <Switch>
            <Route path="/"  exact  component={Home}/>
            <Route path="/rooms/new" component={NewRoom}/>
            <Route path="/rooms/:id" component={Room}/>
            <Route path="/admin/rooms/:id" component={AdminRoom}/>
            <Route path="/admin/listrooms" component={LIstRooms}/>
          </Switch>
        </AuthContextProvider>
    </ThemeContextProvider>
    </BrowserRouter>
  )
        
}

export default App;
