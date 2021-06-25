import { ReactNode } from 'react';
import './styles.scss';
import classnames from 'classnames';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?:ReactNode;
    isAnswered?:boolean;
    isHighlighted?:boolean;
}


export function Question({ content, author,children,isAnswered=false,isHighlighted=false }: QuestionProps) {

    return (
        <div className={
                //se a props isanswered ou isHighlighted estiver true, acrescenta classes a mais na div    
                
                //1º maneira
                //`question ${isAnswered?'answered':''} ${isHighlighted?'highlighted':''}`

                //2º maneira é usar o componente classnames
                //nomedaclasse,{},{}
                //onde
                //{nomedaclasseadicional:boolean ou funcao que retorna true se for para por essa classe adicional },
                classnames(
                'question',
                {answered:isAnswered},
                {highlighted:isHighlighted && !isAnswered},//so poe highilited se nao estiver answered
                )
            
            }>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )

}