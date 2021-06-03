import React, { useEffect, useState } from 'react'
import './index.css'
import './styles/main.scss'
import axios from 'axios'
import { Animation } from './components/icon'
import { useFirebase, useCol, useDoc } from './hooks/firebase.js'
import { HumidityIcon, PopUp, Charts, Box, Button, Text } from './components'

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
  // Authintcation
  const { auth } = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userVerified, setUserVerified] = useState(false);
  const [login, setLogin] = useState(true);
  // Weather
  const [weatherData, setWeatherData] = useState(null);
  const [temperature, setTemperature] = useState('')
  const [main, setMain] = useState('')
  const [humidity, setHumidity] = useState('')
  // Errors
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activityError, setActivityError] = useState('')
  // Data's
  const [activityScore, setActivityScore] = useState(1)
  const [chartData, setChartData] = useState([]);
  // Firestore Data's
  const { data, createRecord } = useCol('/Users/')
  const { data: feedBackData } = useCol('/FeedBack/')
  const { data: lastActivity, updateRecord: updateLastActivity, readAgain } = useDoc(`/Users/${user?.uid}`)
  const { data: activityScores, createRecord: createActivity } = useCol(`/Users/${user?.uid}/ActivityScores/`)
  // others
  const date = new Date().toISOString().slice(0, 10);
  const [feedback, setFeedback] = useState(false);
  // window width, height
  const height = window.innerHeight
  const width = window.innerWidth

  // UseEffect
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

  useEffect(() => {
    if (activityScores) {
      setChartData(activityScores.map((e) => {
        return {
          'name': e.date,
          'activityScore': Number(e.activityScore)
        }
      }))
    }
  }, [activityScores])

  useEffect(() => {
    const data = feedBackData?.map((e) => {
      if (e.userId === user?.uid) {
        return e.userId;
      }
    });
    if (data[0]) {
      setFeedback(true)
    }
  }, [feedBackData, user?.uid])

  // Auth
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

  // DB
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

  // Loading ...
  if (!weatherData || !feedBackData) {
    return (
      <div className={'loader-box'} >
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
    <Box >
      <div className={'flex-row'}>
        <div className={weatherData?.weather[0].icon[2] === 'd' ? 'container' : 'night-container'} >
          <Box >
            <div className={'flex justify-between pa-20'} >
              <div className={'w50 h100 flex-col justify-center items-start ml-10'} >
                <div>
                  <Text className={`fs-40 ${weatherData?.weather[0].icon[2] === 'n' && 'c-white'}`} >Ulaanbaatar</Text>
                  <Text className={'op fs-20'} >{DateConverter(date)}</Text>
                </div>
                <div className={'flex-row items-center'} >
                  <Animation id={weatherData?.weather[0].icon} />
                  <Text className={`fs-40 rm ${weatherData?.weather[0].icon[2] === 'n' && 'c-white'}`}>{main}</Text>
                </div>
              </div>
              <div className={'w50 h-300 textcenter flex-center'} >
                <Text className={`fs-100 rm ${weatherData?.weather[0].icon[2] === 'n' && 'c-white'}`} >{temperature}°</Text>
                <div className={'flex-row items-center'} >
                  <HumidityIcon width={20} height={20} fill={`${weatherData?.weather[0].icon[2] === 'n' ? 'white' : 'black'}`} />
                  <Text className={`${weatherData?.weather[0].icon[2] === 'n' && 'c-white'}`} >{humidity}%</Text>
                </div>
              </div>
            </div>
          </Box>
        </div>
        <div className={'w20 h-328 flex-center pt-10 br-black-1 c-auth'} >
          {
            userVerified ?
              <>
                <div>{GetUsername(data, user.uid)}</div>
                <Text className={'c-red fs-15 ul'} onClick={LogOut} >Logout</Text>
              </>
              :
              login ?
                <>
                  <Text className={'h20'} >Login</Text>
                  <div className={'h80 flex-col items-center w100'} >
                    <input placeholder={'email'} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <input placeholder={'password'} type={'password'} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <Button className={'w70 h-30 mb-15'} onClick={() => { Login(email, password) }} >Login</Button>
                    {
                      loginError ?
                        <Text className={'fs-10 rm mt-5 c-red ul textcenter h-10'} >{loginError}</Text>
                        :
                        user ?
                          <Text className={'fs-10 rm mt-5 c-green ul textcenter h-10'} >Verified, please wait</Text>
                          :
                          <div className={'h-19 w-10'} ></div>
                    }
                    <Text className={'fs-15 c-rblue ul mt-20'} onClick={() => { setLogin(false) }} >SignUp</Text>
                  </div>
                </>
                :
                <>
                  <Text className={'h20'}>SignUp</Text>
                  <div className={'flex-col h80 w100 items-center'} >
                    <input placeholder={'username'} value={username} onChange={(e) => { setUsername(e.target.value) }} />
                    <input placeholder={'email'} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <input placeholder={'password'} type={'password'} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <Button className={'w70 h-30 mb-15'} onClick={() => { SignUp(email, password) }} >SignUp</Button>
                    {
                      error ?
                        <Text className={'fs-10 rm mt-5 c-red ul textcenter h-10'} >{error}</Text>
                        :
                        <div className={'h-19 w-10'} ></div>
                    }
                    <Text className={'fs-15 c-rblue ul mt-20'} onClick={() => { setLogin(true) }} >Login</Text>
                  </div>
                </>
          }
        </div>
      </div>
      <Box className={'flex-row'} >
        <div className={'pa-8 flex-col items-center w30 br-black-1'} style={{ height: ((height - 358) + 'px') }} >
          <Text className={'rm mt-5'} >Today's activity</Text>
          <div className={'w100 h70 flex-col items-center justify-around'} >
            <Text className={'fs-15'} >{'Activity 0 -> 10'}</Text>
            <input className={'w50 rm'} type="number" min={'1'} max={'10'} value={activityScore} onChange={(e) => { e.target.value <= 10 && setActivityScore(e.target.value) }} />
            {
              activityError === 'Your Activity has been sent' ?
                <Text className={'fs-10 rm mt-5 c-green ul textcenter h-10'} >{activityError}</Text>
                :
                activityError === 'You are cooldowns please send tomorrow' ?
                  <Text className={'fs-10 rm mt-5 c-red ul textcenter h-10'} >{activityError}</Text>
                  :
                  activityError ?
                    <Text className={'fs-10 rm mt-5 c-red ul textcenter h-10'}>{activityError}</Text>
                    :
                    <div className={'h-19 w-10'} ></div>
            }
            <Button className={'h-40 w-200'} onClick={UpdateActivity} >Send</Button>
          </div>
          {
            user?.uid ?
              !feedback &&
              <PopUp uid={user?.uid} />
              :
              !feedback && <Text className={'fs-10 rm mt-5 c-red ul textcenter h-10'}>Please login to send feedback !</Text>
          }
        </div>
        <div className={'flex w70 br-black-1 justify-center items-center'} style={{ height: ((height - 342) + 'px') }}  >
          {
            user?.uid ?
              <Charts height={height - 342} width={width * 0.7} data={chartData} />
              :
              <p>Please Login to see your Activity</p>
          }
        </div>
      </Box>
    </Box>
  );
}

export default App;