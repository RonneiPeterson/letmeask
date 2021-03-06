import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import '../styles/Auth.scss';
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useEffect, useState } from 'react';
import { database } from '../services/Firebase';

export function NewRoom() {

    const { user,signOut,clearUser } = useAuth();
    const history = useHistory();

    const [newRoom,setNewRoom]=useState('');


    //se tentar vir direto para essa rota e nao estiver logado
    //ele direciona para a home
    useEffect(() => {

        if (!user) {
            history.push('/');
        }
    }, [user,history])

    async function deslogar(){

        await signOut();
        
        //limpa o estado
        clearUser();
        history.push('/');
    }

    async function handleCreateRoom(event:FormEvent)
    {
        event.preventDefault();

        if (newRoom.trim()===''){
            return;
        }

        //referencia para um registro de dados do banco (1 entidade)
        const roomRef=database.ref('rooms');

        try{

            const firebaseRoom=await roomRef.push({
                title:newRoom,
                authorId:user?.id,
            });

            await history.push(`/admin/rooms/${firebaseRoom.key}`);
        }
        catch(error){
            window.alert('Não foi possível criar a sala');
            console.log('Erro ao tentar criar a sala:',error);
        }

       
    }


    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas"></img>
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="LetmeAsk" />
                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da Sala"
                            value={newRoom}
                            onChange={(e)=>setNewRoom(e.target.value)}
                        />
                        <Button
                            type="submit">
                            Criar Sala
                        </Button>

                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/"> Clique aqui </Link></p>

                    <p 
                    className='logoff'
                    onClick={deslogar}>Sair </p>
                </div>

            </main>

        </div>
    )
}