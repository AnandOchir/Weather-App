import React, { useEffect, useState } from 'react'

import axios from 'axios'
import {Animation} from './animation'

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [temperature, setTemperature] = useState('')
  const [main, setMain] = useState('')
  const [humidity, setHumidity] = useState('')

  useEffect(() => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=2028461&appid=d0d15a18bc851b0ddbb0d65536786570`)
    .then(res => {
      const data = res.data
      setWeatherData(data);
      setTemperature((data?.main?.temp - 273.15).toString().substring(0, 4));
      setMain(data?.weather[0].main);
      setHumidity(data?.main?.humidity)
    })
  }, [])

  console.log(weatherData)


  return (
    <div>
      <input placeholder={'type here ...'} value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} />
      <button onClick={() => {alert(inputValue)}} >Button</button>
      <h1>{temperature} °C</h1>
      <h1>{main}</h1>
      <h1>{humidity}% чийгшэл</h1>
      <Animation type={'sun'} />
    </div>
  );
}

export default App;

// C, cloud, humidity, (N, E, W, S)
