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


type RoomParams = {
    id: string
}


export function AdminRoom() {


    const params = useParams<RoomParams>();
    const roomId = params.id;
    const history = useHistory();
    const {user,isloading}=useAuth();

    const { title, questions,roomAuthorId } = useRoom(roomId)

    const {theme}=useTheme();

    async function handleDeleteQuestion(questionId: string) {

        if (!window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            return;
        }

        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    async function handleEndRoom() {

        if (window.confirm('Certeza que deseja encerrar a sala?')) {
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date(),
            })

            history.push('/');
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string, isanswered: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isanswered
        });

    }

    async function handleHighlightQuestion(questionId: string, ishighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !ishighlighted
        });

    }

    useEffect(()=>{

        if (!user)
        {
            history.push('/');
        }
        else{
            /*   
            //esta logado, vou conferir se o usuario é o dono dessa sala
               if (!isloading && user.id!=roomAuthorId)
                {
                    console.log('user id: ',user.id);
                    console.log('Roomauthorid:',roomAuthorId);
                    window.alert('Você não é autor dessa sala');
                }

*/
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
                    <div>
                    
                        <RoomCode code={roomId} />
                        <Button isOutlined
                            onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}

                </div>



                <div className="question-list">
                    {
                        questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {
                                        !question.isAnswered && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                                                >
                                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                                >
                                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                                </button>
                                            </>
                                        )

                                    }

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
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