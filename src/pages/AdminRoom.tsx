import { useHistory, useParams } from "react-router-dom"
import logoImg from '../assets/images/logo.svg'
import { Button } from "../components/Button"
import '../styles/room.scss'
import {RoomCode} from '../components/RoomCode';
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

import deleteImg from '../assets/images/delete.svg';
import { database } from "../services/Firebase";


type RoomParams={
    id:string
}


export function AdminRoom() {

    
    const params=useParams<RoomParams>();
    const roomId=params.id;
    const history=useHistory();

    const {title,questions}=useRoom(roomId)

    async function handleDeleteQuestion(questionId:string){

        if (!window.confirm('Tem certeza que deseja excluir essa pergunta?'))
        {
            return;
        }

        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    async function handleEndRoom(){

        if (window.confirm('Certeza que deseja encerrar a sala?'))
        {
            await database.ref(`rooms/${roomId}`).update({
                endedAt:new Date(),
            })

            history.push('/');
        }
    }

    


    return (
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeAsk" onClick={(e)=>history.push('/')}/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined
                        onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length>0 &&<span>{questions.length} perguntas</span>}

                </div>

               

                <div className="question-list">
                    {   
                        questions.map(question=>{
                            return(
                                <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                >
                                <button
                                type="button"
                                onClick={()=>handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>

                                </Question>
                            );
                        })                  
                    }
                </div>



              </main>
        </div>
    )

}