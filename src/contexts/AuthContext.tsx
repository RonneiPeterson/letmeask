import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/Firebase';


//* **tipos do typescript** */
type UserType = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: UserType | undefined,
  signInWithGoogle: () => Promise<void>,//funcao async
  signOut:()=>void
}

type AuthContextProviderProps = {
  children: ReactNode
}
//******************************** */

//contexto global (foi criado um hook personalizado para acesso a ele)
//em /hooks/useAuth
export const AuthContext = createContext({} as AuthContextType);



//********MAIN***********/
export function AuthContextProvider(props: AuthContextProviderProps) 
{
  //estados "globais" que serao compartilhados
  const [user, setUser] = useState<UserType>()


  //Na primeira vez que entrar ([]) ele verifica se tem um usuario
  //logado se tiver recupera os dados e poe no estado
  useEffect(() => {

   //declarando um event listener pelo onAuth... 

    //se o estado de autenticacao mudar verifica se tem um usuario
    //ja logado, se sim recupera para o nosso state
    //em casos de f5 ou fechar a pagina....
    const unsubscribe = auth.onAuthStateChanged(user => {
      
      if (user) {

        //extraindo os dados do objeto que retornou pelo google
        const { displayName, photoURL, uid } = user

        //se o usuario nao tiver nome ou foto nao pode usar o APP
        if (!displayName || !photoURL) {
          //dispara um erro
          throw new Error('Missing information from Google Account.');
        }

        //setando o estado global com os dados do usuario
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });

      }
    })

    //no retorno de um useeffect é recomendado que faça o 
    //"descadastro" de todos event listener que foram cadastrados
    return () => {
      unsubscribe();
    }

  }, [])

  //**FUNCAO PASSADA VIA CONTEXT PARA LOGAR NO GOOGLE * */
  async function signInWithGoogle() {

    //autenticacao do usuario no Firebase
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    //se tem um usuario no retorno
    if (result.user) {

      //extraindo os dados do objeto que retornou pelo google
      const { displayName, photoURL, uid } = result.user

      //se o usuario nao tiver nome ou foto nao pode usar o APP
      if (!displayName || !photoURL) {
        //dispara um erro
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    }
  }

    async function signOut()
    {
      return await auth.signOut();
    }



  /*
  
  Funcao retornara um ContextProvider com estados e funcoes 
  que ficarao disponiveis para os componentes abaixo
  como envolvemos no "APP" a aplicacao com esse componente
  precisa chamar o children aqui
    */

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle,signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}