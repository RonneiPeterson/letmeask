import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import GoogleIconImg from '../assets/images/google-icon.svg'
import '../styles/Auth.scss';
import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";


//um hook personalizado que ja retorna o useContext do
//contexto AuthContext
import { useAuth } from "../hooks/useAuth";
import { createCipher } from 'crypto';

export function Home(){

    const history=useHistory();
    
    //const {user,signInWithGogle}=useContext(AuthContext);
    const {user,signInWithGogle}=useAuth();//usando um hook personalizado
    
    //ao clicar no botao se nao estiver conectado no google
    //chama a funcao passada via context
    async function handleCreateRoom(){
        
        if (!user){
                try
                {
                    await signInWithGogle();
                }
                catch(e)
                {
                    //quando nao da certo o login
                    //console.log('erro:',e);
                }
            }

        if (user){
                 history.push('/rooms/new');
        }
       
    }

return(
    <div id="page-auth">
        <aside>
            <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas"></img>
            <strong>Crie salas de Q&amp;A ao vivo</strong>
            <p>Tire as dúvidas da sua audiência em tempo real</p>
        </aside>
        <main>
            <div className="main-content">
                <img src={LogoImg} alt="LetmeAsk" />
                <button className="create-room"
                onClick={handleCreateRoom}
                >
                    <img src={GoogleIconImg} alt="" />
                    Crie sua sala com o Google
                </button>

                {/* Fara o desenho da linha que divide */}
                <div className="separator">ou entre em uma sala</div>
                <form>
                        <input
                        type="text"
                        placeholder="Digite o código da sala"
                        />
                        <Button  
                        type="submit">
                            Entrar na Sala
                        </Button>

                </form>
            </div>

        </main>

    </div>
)
}