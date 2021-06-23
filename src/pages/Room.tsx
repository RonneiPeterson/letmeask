import { useParams } from "react-router-dom"
import logoImg from '../assets/images/logo.svg'
import { Button } from "../components/Button"
import '../styles/room.scss'
import {RoomCode} from '../components/RoomCode';
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/Firebase";
import { isUndefined } from "util";


type RoomParams={
    id:string
}


type FirebaseQuestions=Record<string,{
author:{
    name:string;
    avatar:string;
    }    
content:string;
isAnswered:boolean;
isHighlighted:boolean;
}>

type Question={
    id:string;
    author:{
        name:string;
        avatar:string;
        }    
    content:string;
    isAnswered:boolean;
    isHighlighted:boolean;  

}
export function Room() {

    const {user} =useAuth();
    const params=useParams<RoomParams>();
    const roomId=params.id;
    const [newQuestion,setNewQuestion]=useState('');
    const [questions,setQuestions]=useState<Question[]>([]);
    const [title,setTitle]=useState('');

    useEffect(()=>{

        const roomRef=database.ref(`rooms/${roomId}`);

        //listener "on" 
        roomRef.on('value',room=>{
            
            const databaseRoom=room.val();
            //console.log(databaseRoom);

            if (!databaseRoom)
            {
                return;
            }
            
                    
            const firebaseQuestions:FirebaseQuestions=databaseRoom.questions;
            
                //firebaseQuestions é um objeto
                //quando faço object.entries ele retorna algo como
                //[id],[valor],[outroid],[outrovalor]
                const parsedQuestions=Object.entries(firebaseQuestions).map(
                    ([key,value])=>{
                    return{
                        id:key,
                        content:value.content,
                        author:value.author,
                        isHighlighted:value.isHighlighted,
                        isAnswered:value.isAnswered,
                    }
                    })
                
                    setTitle(databaseRoom.title);
                    setQuestions(parsedQuestions);
        })

    },[roomId])

    async function handleSendQuestion(event:FormEvent){
        event.preventDefault();

        if (newQuestion.trim()===''){
            return;
        }

        if (!user){
            throw new Error('You must be logged in')
        }

        const question={
            content:newQuestion,
            author:{
                name:user.name,
                avatar:user.avatar
            },
            isHighlighted:false,
            isAnswered:false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    return (
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeAsk" />
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length>0 &&<span>{questions.length} perguntas</span>}

                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        value={newQuestion}
                        onChange={e=>setNewQuestion(e.target.value)}

                        placeholder="O que você quer perguntar?"
                    />

                    <div className="form-footer">
                        {
                            user?(
                                  <div className="user-info">
                                      <img src={user.avatar} alt=""/>
                                      <span>{user.name}</span>
                                  </div> 
                            ):
                            (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                            )
                        }
                        
                        <Button type="submit"
                        disabled={!user}
                        >Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )

}