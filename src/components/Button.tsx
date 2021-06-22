import React,{ButtonHTMLAttributes} from 'react'
import '../styles/button.scss';

type Buttonprops=ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props:Buttonprops) => {
    return (
            <button className="button" {...props} />
    )
}

