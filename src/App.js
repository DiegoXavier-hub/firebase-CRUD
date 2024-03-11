import React, { useEffect, useState } from 'react';
import { db } from './firebaseConnection'
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import './assets/css/app.css'

function App() {

  const [idUser, setIdUser] = useState('')
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [idade, setIdade] = useState(0)
  const [users, setUsers] = useState([])
  const userRef = collection(db, 'users')
  
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
      alert('Preencha os campos corretomente!')
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
      let lista = []
      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          sobrenome:doc.data().sobrenome,
          idade: doc.data().idade
        })
      })
      setUsers(lista)
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
        alert('Preencha o campo ID corretamente')
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
    }

  }

  useEffect(()=>{

    nomeInput = document.getElementById('nome');
    sobrenomeInput = document.getElementById('sobrenome');
    idadeInput = document.getElementById('idade');

    document.getElementById('console').value = users.map((user, index) => {
      return (
        (index === 0 ? '' : '\n\n') +
        'id: ' + user.id + '\n' +
        'nome: ' + user.nome + '\n' +
        'sobrenome: ' + user.sobrenome + '\n' +
        'idade: ' + user.idade
      );
    });

  }, [users])

  return (
    <main className="App">
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
          <button onClick={()=>updateUsers()}>Delete</button>
        </div>
      </span>
      <div className='console'>
        <p>saida:</p>
        <textarea type='text' id='console' readOnly></textarea>
      </div>

    </main>
  );
}

export default App;
