import React,{ButtonHTMLAttributes} from 'react'
import '../styles/button.scss';

type Buttonprops=ButtonHTMLAttributes<HTMLButtonElement> &{

    isOutlined?:boolean
};

export const Button = ({isOutlined=false,...props}:Buttonprops) => {
    return (
            <button className={`button ${isOutlined?'outLined':''} ` }
            
            {...props} />
    )
}

