import { useState, useEffect } from 'react'
import Person from './components/Person'
import peopleService from './services/people'
import Message from './components/Message'

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


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [inputFilter, setInputFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const Persons = ( {list} ) => (
  <ul>
    {list.map((person) => (
    <Person key={person.id} person={person} deletePerson={() => deletePersonOf(person.id)}/>
    ))}
  </ul>
)

  useEffect(() => {
    peopleService.getAll().then(initialPeople => {
      setPersons(initialPeople)
    })
  }, [])


  const deletePersonOf = id => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      return peopleService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      }).catch(error => {
        console.error('Failed to delete:', error)
      })
    }
    
  }

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
    const existingPerson = persons.find(person => person.name === newName)
    if (!existingPerson) {
      const personObject = {
        name: newName,
        number: newNumber
      }

      setMessage(`Added ${newName}`)
      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 5000)

      peopleService.create(personObject).then(returnedObject => {
        setPersons(persons.concat(returnedObject))
        setNewName('')
        setNewNumber('')
      })
    }
    else if (!(existingPerson.number === newNumber)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = {...existingPerson, number : newNumber}
        peopleService.update(existingPerson.id, newPerson).then(returnedObject => {
          setPersons(persons.map(p => p.id === existingPerson.id ? returnedObject: p))
        })
        .catch(error => {
          console.log('fail', error)
          setMessage(`Information of ${newName} has already been removed from server`)
          setPersons(persons.filter(p => p.name !== newName))
          setIsError(true)
          setTimeout(() => {
            setMessage(null)
            setIsError(false)
          }, 5000)
        })


        setMessage(`Updated ${newName}`)
        setTimeout(() => {
          setMessage(null)
          setIsError(false)
        }, 5000)
      }
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message text={message} isError={isError} />
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