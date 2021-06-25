import { createContext,ReactNode, useEffect, useState } from "react";

type Theme='light'|'dark';

type ThemeContextProviderProps={
    children:ReactNode;
}


type ThemeContextType={
    theme:Theme;
    toogleTheme:()=>void;
}


export const ThemeContext=createContext({} as ThemeContextType);

export function ThemeContextProvider(props:ThemeContextProviderProps){

    
    const [currentTheme,setCurrentTheme]=useState<Theme>(()=>{
    //inicializando useState com uma funcao (basta retornar o mesmo tipo do state)
    const storagedTheme=localStorage.getItem('theme')
    return ( storagedTheme?? 'light') as Theme;
    });


    //**sempre que o tema mudar guardo no localstorage (por conta do f5) */
    useEffect(()=>{
            localStorage.setItem('theme',currentTheme);
    },[currentTheme])


    function toogleTheme(){
        setCurrentTheme(currentTheme==='light'?'dark':'light');
    }

    return(
            <ThemeContext.Provider value={{theme:currentTheme,toogleTheme}}>
                {props.children}
            </ThemeContext.Provider>


    )
}