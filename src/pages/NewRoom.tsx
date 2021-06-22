import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import '../styles/Auth.scss';
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export function NewRoom() {

    const { user } = useAuth();
    const history = useHistory();


    //se tentar vir direto para essa rota e nao estiver logado
    //ele direciona para a home
    useEffect(() => {

        if (!user) {
            history.push('/');
        }
    }, [])

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
                    <h2>Tirar depois: {user?.name}</h2>
                    <h2>Criar uma nova sala</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Nome da Sala"
                        />
                        <Button
                            type="submit">
                            Criar Sala
                        </Button>

                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/"> Clique aqui </Link></p>
                </div>

            </main>

        </div>
    )
}