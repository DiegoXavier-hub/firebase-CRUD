import React, { useEffect, useState } from 'react';
import { db, auth } from './firebaseConnection'
import { doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import {
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import './assets/css/app.css'

function App() {

  const [idUser, setIdUser] = useState('')
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [idade, setIdade] = useState(0)
  const [users, setUsers] = useState([])
  const userRef = collection(db, 'users')
  const [userEmail, setUserEmail] = useState('');
  
  let idInput = document.getElementById('key');
  let nomeInput = document.getElementById('nome');
  let sobrenomeInput = document.getElementById('sobrenome');
  let idadeInput = document.getElementById('idade');

  function validateInputs() {
    let validate = true

    if (nomeInput.value.length < 3) {
      nomeInput.style.border = '2px solid red';
      validate = false
    } else {
      nomeInput.style.border = '2px solid green';
    }

    if (sobrenomeInput.value.length < 3) {
      sobrenomeInput.style.border = '2px solid red';
      validate = false
    } else {
      sobrenomeInput.style.border = '2px solid green';
    }

    if (idadeInput.value < 18) {
      idadeInput.style.border = '2px solid red';
      validate = false
    } else {
      idadeInput.style.border = '2px solid green';
    }

    return validate
  }

  //CREATE

  async function createUsers(){
    if(validateInputs()){

      /*
      await setDoc(doc(db, 'users', 'generateRandomString'), {
        nome: nome,
        sobrenome: sobrenome,
        idade: idade
      })
      .then(() => {
        document.getElementById('console').value = 'Dados registrados com sucesso!'
        setNome('')
        setSobrenome('')
        setIdade(0)
      })
      .catch((error)=>{
        document.getElementById('console').value = 'FATAL ERROR! ' + error
      })
      */

      await addDoc(userRef, {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        idade: idade.trim()
      })
      .then(() => {
        setNome('')
        setSobrenome('')
        setIdade(0)
        document.getElementById('console').value = 'Dados registrados com sucesso!'
      })
      .catch((error)=>{
        document.getElementById('console').value = 'CREATE ERROR! ' + error
      })
    } else {
      document.getElementById('console').value = 'Preencha os campos em vermelho corretamente'
    }
  }

  //READ

  async function readUsers(){

    /*
    const userRef = doc(db, 'users', 'iarWyFg1V3U2diWh3cBH')

    await getDoc(userRef)
    .then((snapshot)=>{
      document.getElementById('console').value = 
      'Success! \n\n' +
      'Nome: ' + snapshot.data().nome + '\n' +
      'Sobrenome: ' + snapshot.data().sobrenome + '\n' +
      'Idade: ' + snapshot.data().idade
    })
    .catch((error)=>{
      document.getElementById('console').value = 'FATAL ERROR! ' + error
    })
    */


    await getDocs(userRef)
    .then((snapshot)=>{
      let listaUsers = []
      snapshot.forEach((doc)=>{
        listaUsers.push({
          id: doc.id,
          nome: doc.data().nome,
          sobrenome:doc.data().sobrenome,
          idade: doc.data().idade
        })
      })
      setUsers(listaUsers)
    })
    .catch((error)=>{
      document.getElementById('console').value = 'READ ERROR! ' + error
    })
  }

  //UPDATE

  async function updateUsers(){
    if(validateInputs()){
      if ((idInput.value.trim().length) < 20) {
        idInput.style.border = '2px solid red';
        document.getElementById('console').value = 'Preencha o campo em vermelho corretamente'
      }else{
        const docRef = doc(db, 'users', idUser.trim())
        idInput.style.border = '2px solid green';
        await updateDoc(docRef, {
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          idade: idade.trim()
        })
        .then((snapshot)=>{
          document.getElementById('console').value = 'Dados atualizados com sucesso!'
          setNome('')
          setSobrenome('')
          setIdade(0)
          setIdUser('')
        })
        .catch((error)=>{
          document.getElementById('console').value = 'UPDATE ERROR! ' + error
        })
      }
    }else{
      document.getElementById('console').value = 'Preencha os campos em vermelho corretamente'
    }

  }

  //DELETE

  async function deleteUsers(id){
    if ((idInput.value.trim().length) < 20) {
      idInput.style.border = '2px solid red';
      document.getElementById('console').value = 'Preencha o campo ID em vermelho corretamente'
    }else{
      const docRef = doc(db, 'users', id.trim())
      await deleteDoc(docRef)
      .then(()=>{
        document.getElementById('console').value = 'Usuário deletado com sucesso!'
      })
      .catch((error)=>{
        document.getElementById('console').value = 'DELETE ERROR! ' + error
      })
    }
  }

  //desloga o usuário e redireciona para a págica de login
  async function Logout() {
    await signOut(auth);
    window.location.href = 'http://localhost:3000/';
  }

  useEffect(()=>{

    nomeInput = document.getElementById('nome');
    sobrenomeInput = document.getElementById('sobrenome');
    idadeInput = document.getElementById('idade');
    
    //Se a state users for alterada, os dados são imprimidos na saida
    document.getElementById('console').value = users.map((user, index) => {
      return (
        (index === 0 ? '' : '\n\n') +
        'id: ' + user.id + '\n' +
        'nome: ' + user.nome + '\n' +
        'sobrenome: ' + user.sobrenome + '\n' +
        'idade: ' + user.idade
      );
    });

      /*
      async function loadUsers(){
        const onsub = onSnapshot(collection(db, 'users'), (snapshot)=>{
          let listaUsers = []
        snapshot.forEach((doc)=>{
          listaUsers.push({
            id: doc.id,
            nome: doc.data().nome,
            sobrenome:doc.data().sobrenome,
            idade: doc.data().idade
          })
        })
        setUsers(listaUsers)
      })
    }
    
    loadUsers()
    */

  }, [users])
  
    //Se não estiver logado, redireciona para a página de login
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem algum usuário logado entra aqui
          setUserEmail(user.email.split('@'));
        }
        if (!user) {
          //se não tem nenhum usuário logado entra aqui
          window.location.href = 'http://localhost:3000/';
        }
      });
  
      return () => unsubscribe();
    }, []);

  return (
    <main className="App">
      <h1>Olá, {userEmail[0]}</h1>
      <div className='input-container'>
        <label>
          <p>ID do usuário: </p>
          <input 
            type="text" 
            value={idUser} 
            onChange={(event) => setIdUser(event.target.value)} 
            id='key'
          />
        </label>

        <label>
          <p>Idade: </p>
          <input 
            type='number' 
            min={0} 
            value={idade} 
            onChange={(event) => setIdade(event.target.value)} 
            onClick={() => {idade == 0 ? setIdade('') : setIdade(idade)}}
            id='idade'
          />
        </label>

        <label>
          <p>Nome: </p>
          <input 
            type="text" 
            value={nome} 
            onChange={(event) => setNome(event.target.value)} 
            id='nome'
          />
        </label>

        <label>
          <p>Sobrenome: </p>
          <input
            type='text'
            value={sobrenome}
            onChange={(event)=>setSobrenome(event.target.value)}
            id='sobrenome'
          />
        </label>

      </div>
      <span>
        <div className='button-container'>
          <button onClick={()=>createUsers()}>Create</button>
          <button onClick={()=>readUsers()}>Read</button>
        </div>
        <div className='button-container'>
          <button onClick={()=>updateUsers()}>Update</button>
          <button onClick={()=>deleteUsers(idUser)}>Delete</button>
        </div>
      </span>
      <div className='console'>
        <p>saida:</p>
        <textarea type='text' id='console' readOnly></textarea>
      </div>
      <button onClick={Logout} id='logout'>Logout</button>

    </main>
  );
}

export default App;
