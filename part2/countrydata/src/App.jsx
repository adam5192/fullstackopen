import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDisplay from './components/countryDisplay'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  // filter countries on user input
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <div>
        find countries: <input value={query} onChange={handleChange} />
      </div>

      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <div key={country.name.common}>
              <li>{country.name.common} <button onClick={() => setQuery(country.name.common)}>show</button> </li>
            </div>

          ))}
        </ul>
      )}

      {filteredCountries.length === 1 && (
        <CountryDisplay country={filteredCountries[0]} /> 
      )}

      {}
    </div>
  )
}

export default App
