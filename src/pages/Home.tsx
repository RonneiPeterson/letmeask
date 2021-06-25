import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import GoogleIconImg from '../assets/images/google-icon.svg'
import '../styles/Auth.scss';
import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";


//um hook personalizado que ja retorna o useContext do
//contexto AuthContext
import { useAuth } from "../hooks/useAuth";

import { FormEvent, useState } from 'react';
import { database } from '../services/Firebase';
import { useTheme } from '../hooks/useTheme';


export function Home(){

    const history=useHistory();
    
    //const {user,signInWithGogle}=useContext(AuthContext);
    const {user,signInWithGoogle}=useAuth();//usando um hook personalizado

    const [roomCode,setRoomCode]=useState('');

    const {theme}=useTheme();
    
    //ao clicar no botao se nao estiver conectado no google
    //chama a funcao passada via context
    async function handleCreateRoom(){
        
        //console.log('clicou no crie com o google ');
        //console.log(user);

        if (!user){
                try
                {
                    await signInWithGoogle();
                    history.push('/rooms/new');
                }
                catch(e)
                {
                    window.alert('Não foi possível fazer o login com o Google');
                    //quando nao da certo o login
                    console.log('erro:',e);
                }
            }

        if (user){
                 history.push('/rooms/new');
        }
       
    }

async function handleJoinRoom(event:FormEvent){
    event.preventDefault();

    if (roomCode.trim()==='')
    {
        return;
    }

    const roomRef=await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()){
        alert('Room does not exist');
        return;
    }

    if (roomRef.val().endedAt){
        alert('Room already closed!');
        return;
    }

    //se a ROOM foi criada pelo usuario atual abre o admin
    if (roomRef.val().authorId===user?.id)
    {
        history.push(`/admin/rooms/${roomCode}`)
    }
    else history.push(`/rooms/${roomCode}`)
}



return(
    <div id="page-auth" className={theme}>

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
                <form onSubmit={handleJoinRoom}>
                        <input
                        type="text"
                        placeholder="Digite o código da sala"
                        value={roomCode}
                        onChange={(e)=>setRoomCode(e.target.value)}
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
