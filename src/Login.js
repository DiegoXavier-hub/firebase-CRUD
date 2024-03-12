import React, { useState, useEffect } from 'react';
import './assets/css/login.css'
import { auth } from './firebaseConnection'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //verifica os campos e cadastra o usuário
    async function Cadastrar(){
        if (email.trim() === '' || email.includes('@') === false){
            document.getElementById('email').style.border = '2px solid red';
            alert('Este email é inválido')
            return;
        }
        if (password.trim().length < 6) {
            document.getElementById('password').style.border = '2px solid red';
            alert('A senha deve ter no mínimo 6 caracteres')
            return;
        }
        document.getElementById('email').style.border = '0px solid red';
        document.getElementById('password').style.border = '0px solid red';

        await createUserWithEmailAndPassword(auth, email, password)
        .then((value)=>{
            alert('Cadastrado com sucesso')
            console.log(value)
            setEmail('')
            setPassword('')
            window.location.href = 'http://localhost:3000/home';
        })
        .catch((error)=>{
            switch(error.code){
                case 'auth/weak-password':
                    alert('Senha fraca, tente uma senha mais forte')
                    break;
                case 'auth/invalid-email':
                    alert('Email inválido')
                    break;
                case 'auth/email-already-in-use':
                    alert('Este email já está em uso')
                    break;
                default:
                    alert('Ocorreu um erro ao cadastrar')
                    break;
            }
        })
    }

    //loga e redireciona o usuário
    async function Login(){
        await signInWithEmailAndPassword(auth, email, password)
        .then((value)=>{
            window.location.href = 'http://localhost:3000/home';
        })
        .catch(()=>{        
            alert('Email ou senha incorretos')
        })
    }

    //Se o usuario estiver logado, ele é redirecionado para o app
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = 'http://localhost:3000/home';
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <main id='Login'>
            <div id='Login-container'>
                <label>
                    <h2>Login</h2>
                    <p>Email: </p>
                    <input 
                        type='text' 
                        min={0} 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} 
                        id='email'
                    />
                </label>
                <label>
                    <p>Senha: </p>
                    <input 
                        type='password' 
                        min={0} 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                        id='password'
                    />
                </label>
                <div>
                    <button onClick={Login}>Entrar</button>
                    <button onClick={Cadastrar}>Cadastrar</button>
                </div>
            </div>
        </main>
    );
}

export default Login;