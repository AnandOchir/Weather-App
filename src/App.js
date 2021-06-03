import React, { useEffect, useState } from 'react'
import './index.css'
import './styles/main.scss'
import axios from 'axios'
import { Animation } from './components/icon'
import { useFirebase, useCol, useDoc } from './hooks/firebase.js'
import { HumidityIcon, PopUp, Charts } from './components'

// const TimeConverter = (timestamp) => {
//   let date = new Date(timestamp * 1000);
//   let hours = date.getHours();
//   let minutes = "0" + date.getMinutes();
//   let seconds = "0" + date.getSeconds();

//   let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

//   return formattedTime;
// }

const MonthConverter = (month) => {
  switch (month) {
    case 1:
      return 'January'
    case 2:
      return 'February'
    case 3:
      return 'March'
    case 4:
      return 'April'
    case 5:
      return 'May'
    case 6:
      return 'June'
    case 7:
      return 'July'
    case 8:
      return 'August'
    case 9:
      return 'September'
    case 10:
      return 'October'
    case 11:
      return 'November'
    case 12:
      return 'December'
    default:
  }
}

const DateConverter = (date) => {
  let data = date.split('-')
  let year = data[0]
  let month = Number(data[1])
  let day = data[2]

  return (MonthConverter(month) + ' ' + day + ', ' + year);
}

const RandomNumberAndString = () => {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 15; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
      charactersLength)));
  }
  return result.join('');
}

const App = () => {
  const { auth } = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [temperature, setTemperature] = useState('')
  const [main, setMain] = useState('')
  const [humidity, setHumidity] = useState('')
  const [user, setUser] = useState(null)
  const [userVerified, setUserVerified] = useState(false)
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activityError, setActivityError] = useState('')
  const [activityScore, setActivityScore] = useState(1)
  // const [sun, setSun] = useState({})
  const [login, setLogin] = useState(true)
  const date = new Date().toISOString().slice(0, 10);
  const { data, createRecord } = useCol('/Users/')
  const { data: feedBackData } = useCol('/FeedBack/')
  const { data: lastActivity, updateRecord: updateLastActivity, readAgain } = useDoc(`/Users/${user?.uid}`)
  const { data: activityScores, createRecord: createActivity } = useCol(`/Users/${user?.uid}/ActivityScores/`)
  const height = window.innerHeight
  const width = window.innerWidth
  const [chartData, setChartData] = useState([]);
  const [feedback, setFeedback] = useState(false)

  useEffect(() => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=2028461&appid=d0d15a18bc851b0ddbb0d65536786570`)
      .then(res => {
        const data = res.data
        setWeatherData(data);
        setTemperature((data?.main?.temp - 273.15).toString().substring(0, 4));
        setMain(data?.weather[0].main);
        setHumidity(data?.main?.humidity)
        // setSun({
        //   sunrise: TimeConverter(data?.sys.sunrise),
        //   sunset: TimeConverter(data?.sys.sunset)
        // })
      })
  }, [])

  // if(user) {
  //   setActivityError('')
  // }

  useEffect(() => {
    if(activityScores) {
      setChartData(activityScores.map((e) => {
        return {
          'name': e.date,
          'activityScore': Number(e.activityScore)
        }
      }))
    }
  }, [activityScores])

  useEffect(() => {
      const a = feedBackData?.map((e) => {
        if(e.userId === user?.uid) {
          return e.userId;
        }
      });
      if(a[0]) {
        setFeedback(true) 
      }
  }, [feedBackData, user?.uid])


  const SignUp = (email, password) => {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setUserVerified(true);
        createRecord(user?.uid, {
          email: user.email,
          username: username,
          uid: user.uid
        })
      })
      .catch((error) => {
        setError(error.message)
      });
  }

  const LogOut = () => {
    auth.signOut();
    setUserVerified(false);
    setError('');
    setLoginError('');
    setUser('');
  }

  const Login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user)
        setUserVerified(true)
      })
      .catch((error) => {
        setLoginError(error.message)
      });
  }

  const GetUsername = (data, uid) => {
    const username = data.map((e) => {
      if (e.uid === uid) {
        return e.username;
      }
    })
    return username[0];
  }

  const UpdateActivity = async () => {
    if (user?.uid && lastActivity) {
      const id = RandomNumberAndString();
      let tmp = new Date().toISOString().slice(0, 10).split('-').reverse().join('/');
      tmp = tmp.split('/');
      const date = tmp[1] + '/' + tmp[0] + '/' + tmp[2]

      const date1 = new Date(lastActivity.lastActivity);
      const date2 = new Date(date);
      const diffTime = Math.abs(date2 - date1);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (!lastActivity.lastActivity) {
        diffDays = 1
      }

      if (diffDays >= 1) {
        await createActivity(id, {
          activityId: id,
          activityScore: activityScore,
          date: date
        });
        await updateLastActivity({
          lastActivity: date
        })
        await setActivityError('Your Activity has been sent');
        readAgain()
      } else {
        setActivityError('You are cooldowns please send tomorrow')
      }
    } else {
      setActivityError('Please login ..')
    }
  }

  if (!weatherData || !feedBackData) {
    return (
      <div className={'box'} >
        <div class="lds-facebook">
          <div>
          </div>
          <div>
          </div>
          <div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={'w100 h100'} >
      <div style={{ display: 'flex', flexDirection: 'row' }} >
        <div className={weatherData?.weather[0].icon[2] === 'd' ? 'container' : 'night-container'} >
          <div className={'sub-container'} >
            <div style={{ display: 'flex', justifyContent: 'justify-between', padding: 20 }} >
              <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }} >
                <div>
                  <h2 className={'title'} >Ulaanbaatar</h2>
                  <h4 style={{ opacity: 0.6 }} >{DateConverter(date)}</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <Animation id={weatherData?.weather[0].icon} />
                  <h2 style={{ fontSize: '40px', margin: 0 }} >{main}</h2>
                </div>
              </div>
              <div style={{ width: '50%', height: '300px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                <h2 className={'temp'} >{temperature}°</h2>
                <div className={'flex-row items-center'} >
                  <HumidityIcon width={20} height={20} fill={'black'} />
                  <h2>{humidity}%</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '20%', height: '328px', display: 'flex', justifyContent: 'center', paddingTop: '10px', color: 'orange', flexDirection: 'column', alignItems: 'center', border: '1px solid black' }} >
          {
            userVerified ?
              <>
                <div>{GetUsername(data, user.uid)}</div>
                <p style={{ color: 'red', textDecoration: 'underline' }} onClick={LogOut} >Logout</p>
              </>
              :
              login ?
                <>
                  <h2 style={{ height: '20%' }} >Login</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '80%', alignItems: 'center', width: '100%' }} >
                    <input placeholder={'email'} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <input placeholder={'password'} type={'password'} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <button style={{ width: '70%', height: '30px', borderRadius: '5px', backgroundColor: 'orange', border: 'none' }} onClick={() => { Login(email, password) }} >Login</button>
                    {
                      loginError ?
                        <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'red', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >{loginError}</p>
                        :
                        user ?
                          <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'green', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >Verified, please wait</p>
                          :
                          <div style={{ height: '19px', width: '10px' }} ></div>
                    }
                    <p style={{ fontSize: '15px', color: 'royalblue', textDecoration: 'underline' }} onClick={() => { setLogin(false) }} >SignUp</p>
                  </div>
                </>
                :
                <>
                  <h2 style={{ height: '20%' }} >SignUp</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '80%', width: '100%', alignItems: 'center' }} >
                    <input placeholder={'username'} value={username} onChange={(e) => { setUsername(e.target.value) }} />
                    <input placeholder={'email'} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <input placeholder={'password'} type={'password'} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <button style={{ width: '70%', height: '30px', borderRadius: '5px', backgroundColor: 'orange', border: 'none' }} onClick={() => { SignUp(email, password) }} >SignUp</button>
                    {
                      error ?
                        <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'red', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >{error}</p>
                        :
                        <div style={{ height: '19px', width: '10px' }} ></div>
                    }
                    <p style={{ fontSize: '15px', color: 'royalblue', textDecoration: 'underline' }} onClick={() => { setLogin(true) }} >Login</p>
                  </div>
                </>
          }
        </div>
      </div>
      <div className={'w100 h100 flex-row'} >
        <div className={'pa-8 flex-col items-center'} style={{ width: '30%', height: ((height - 358) + 'px'), border: '1px solid black' }} >
          <h3 className={'rm'} style={{ marginTop: '5px' }} >Today's activity</h3>
          <div className={'w100 h70 flex-col items-center justify-around'} >
            <p>{'Activity 0 -> 10'}</p>
            <input className={'w50 rm'} type="number" min={'1'} max={'10'} value={activityScore} onChange={(e) => { e.target.value <= 10 && setActivityScore(e.target.value) }} ></input>
            {
              activityError === 'Your Activity has been sent' ?
                <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'green', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >{activityError}</p>
                :
                activityError === 'You are cooldowns please send tomorrow' ?
                  <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'red', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >{activityError}</p>
                  :
                  activityError ?
                    <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'red', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >{activityError}</p>
                    :
                    <div style={{ height: '19px', width: '10px' }} ></div>
            }
            <button className={'h-40 w-200 b-secondary bradius-5 rb'} onClick={UpdateActivity} >Send</button>
          </div>
          {
            user?.uid ?
              !feedback &&
                <PopUp uid={user?.uid}/>
            :
              !feedback && <p style={{ fontSize: '10px', margin: 0, marginTop: 5, color: 'red', textDecoration: 'underline', textAlign: 'center', height: '10px' }} >Please login to send feedback !</p>
          }
        </div>
        <div className={'flex justify-center items-center'} style={{ width: '70%', height: ((height - 342) + 'px'), border: '1px solid black' }}  >
          {
            user?.uid ?
              <Charts height={height - 342} width={width * 0.7} data={chartData} />
            :
              <p>Please Login to see your Activity</p>
          }
        </div>
      </div>
    </div>
  );
}

export default App;