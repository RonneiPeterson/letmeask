import { useEffect, useState } from "react";
import { database } from "../services/Firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions=Record<string,{
    author:{
        name:string;
        avatar:string;
        }    
    content:string;
    isAnswered:boolean;
    isHighlighted:boolean;
    likes:Record<string,{
        authorId:string;}>
   
    }>
    type QuestionType={
        id:string;
        author:{
            name:string;
            avatar:string;
            }    
        content:string;
        isAnswered:boolean;
        isHighlighted:boolean;  
        likeCount:number;
        //hasLiked:boolean;
        likeId:string|undefined;
    
    }


//*********************************************************** */    
export function useRoom(roomId:string){
    const [questions,setQuestions]=useState<QuestionType[]>([]);
    const [title,setTitle]=useState('');
    const [roomAuthorId,setRoomAuthorId]=useState('');
    const{user}=useAuth();

    useEffect(()=>{

        const roomRef=database.ref(`rooms/${roomId}`);

        if (!roomRef)
        {
            return;
        }

        //* PEGANDO OS DADOS DA SALA INDEPENDENTE SE TEM QUESTION OU NAO */
        roomRef.get().then((snapshot) => {
            if (snapshot.exists()) 
            {
                //id do autor
                setRoomAuthorId(snapshot.val().authorId);
                //title da sala
                setTitle(snapshot.val().title);
            } else {
                    console.log("Sem dados da Sala");
            }
            }).catch((error) => {
                console.error('Erro buscar dados da sala ',error);
            });
        //* */

        
        //listener "on"  para "escutar" alteracao dos dados e listar as questions
        roomRef.on('value',room=>{
            
            const databaseRoom=room.val();
            
            if (!databaseRoom)
            {
                return;
            }
                    
            //se questions estiver  vazio vai retornar um {}
            //para nao gerar excecao no Object.entries().map....
            const firebaseQuestions:FirebaseQuestions=databaseRoom.questions??{};

                //firebaseQuestions é um objeto
                //quando faço object.entries ele retorna algo como
                //[id],[valor],[outroid],[outrovalor]
            const parsedQuestions=Object.entries(firebaseQuestions).map(
                    ([key,value])=>{
                        
                    return{
                        id:key,
                        content:value.content,
                        author:value.author,
                        isAnswered:value.isAnswered,
                        isHighlighted:value.isHighlighted,
                        likeCount:Object.values(value.likes ?? {}).length,
                        //funcao some retorna true ou false
                        //nesse exemplo retorna true se o like tiver o autor igual ao usuario
                        //hasLiked:Object.values(value.likes ?? {}).some(like=>like.authorId===user?.id)
                        
                        //alterado para pegar o ID do Like que o usuario deu nesse comentario
                        likeId:Object.entries(value.likes ?? {}).find(([key,like])=>like.authorId===user?.id)?.[0],
                    }
                    })
                
                    
                    setQuestions(parsedQuestions);
        })

        //removendo o listener do firebase
        return ()=>{
                if (roomRef)    
                {
                    roomRef.off('value');
                }
        }

    },[roomId,user?.id]);

    return {questions,title,roomAuthorId}

}