import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryDisplay = ( {country} ) => {
    const [weather, setWeather] = useState(null)
    const capital = country.capital[0]
    const apiKey = 'bc6cf0593a6a55812407a8dc86610dad'

    useEffect(() => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`

        axios.get(url).then(response => {
            setWeather(response.data)
        }).catch(error => {
            console.error('Failed to fetch weather', error)
        })
    }, [capital])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {capital} </p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(lang => (
                <li key={lang}>{lang}</li>
                ))}
            </ul>

            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
            

            {weather && (
                <>
                    <h3>Weather in {capital}</h3>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </>
            )}

        </div>
    )
}


export default CountryDisplay