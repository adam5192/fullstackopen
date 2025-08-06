import { useState, useEffect } from 'react'
import Person from './components/Person'
import axios from 'axios'

const Filter = ( {text, value, handle} ) => (
  <div>
    {text} <input value={value} onChange={handle} />
  </div>
)

const PeopleForm = ( {submit, nameValue, nameChange, numberValue, numberChange} ) => (
  <form onSubmit={submit}>
    <div>
      name: <input 
            value={nameValue}
            onChange={nameChange}
            required/> 
      <br />
      number: <input 
              value={numberValue}
              onChange={numberChange}/>
    </div>
    <div>
      <button type="submit" >add</button>
    </div>
  </form>
)

const Persons = ( {list} ) => (
  <ul>
    {list.map((person) => (
    <Person key={person.name} person={person} />
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [inputFilter, setInputFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios.get('http://localhost:3001/persons').then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }
  useEffect(hook, [])
  console.log('render', persons.length, 'person(s)')

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleInputFilter = (event) => {
    setInputFilter(event.target.value)
  }

  const personsToShow = (inputFilter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(inputFilter.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()
    if (!persons.some(person => person.name === newName)) {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text="filter shown with" value={inputFilter} handle={handleInputFilter} />
      <h3>add a new</h3>
      <PeopleForm submit={addPerson} nameValue={newName} nameChange={handleNewName} 
                  numberValue={newNumber} numberChange={handleNewNumber} />
      <h3>Numbers</h3>
      <Persons list={personsToShow} />
    </div>
  )
}

export default App