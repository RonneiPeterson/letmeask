import { useHistory, useParams } from "react-router-dom"
import logoImg from '../assets/images/logo.svg'
import { Button } from "../components/Button"
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode';
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { database } from "../services/Firebase";
import { useTheme } from "../hooks/useTheme";
import { ThemeToogle} from "../components/ThemeToogle";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { isJSDocReturnTag } from "typescript";


type RoomParams = {
    id: string
}


export function LIstRooms() {


    const params = useParams<RoomParams>();
    //const roomId = params.id;
    const history = useHistory();
    const {user,isloading}=useAuth();
    

    const {theme}=useTheme();


    useEffect(()=>{

        if (!user)
        {
            history.push('/');
            return;
        }
        
        const roomRef=database.ref('rooms');

        if (!roomRef)
        {
            return;
        }

        //* PEGANDO OS DADOS DA SALA INDEPENDENTE SE TEM QUESTION OU NAO */
        /*
        O problema dessa estrategia é que como é raiz toda a alteracao dos filhos (comentarios, curtidas...)
        reflete em uma chamada nestelistener que recarrega TUDO de novo (PAI e Filhos)
        
        */
        roomRef.on('value',
        (snapshot) => {
                            console.log(snapshot.val());
                        });

            
        //* */

        return ()=>{
            console.log('Retirando o listener')  ;
            roomRef.off();
        }

    },[user]);


    return (
        <div id='page-room' className={theme}>
            <header>
                <div className="content">
                    <div className="logo_and_toogletheme">
                        <img src={logoImg} alt="letmeAsk" onClick={(e) => history.push('/')} />
                        <ThemeToogle />
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">

                </div>


                <div className="rooms-list">
                    <span>lista de salas</span>
                </div>



            </main>
        </div>
    )

}