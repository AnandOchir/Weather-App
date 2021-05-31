import React from 'react'
import './index.css'

export const Animation = ({type}) => {
    return (
        <div>
            <h1>Weather</h1>
            <div class="container">
                {
                    type == 'sun' &&
                    <div class="weather-sun">
                        <div class="sun">
                            <div class="rays"></div>
                            <div class="rays"></div>
                            <div class="rays"></div>
                            <div class="rays"></div>
                        </div>
                    </div>
                }
                {
                    type == 'cloud' &&
                    <div class="weather-cloud">
                        <div class="cloud"></div>
                        <div class="cloud"></div>
                    </div>
                }
                {
                    type == 'snow' &&
                    <div class="weather-snow">
                        <div class="snow">
                            <div class="f"></div>
                        </div>
                    </div>
                }
                {
                    type == 'cloudAndSun' &&
                    <div class="weather-cloudAndSun">
                        <div class="cloud"></div>
                        <div class="sun">
                            <div class="rays"></div>
                            <div class="rays"></div>
                            <div class="rays"></div>
                            <div class="rays"></div>
                        </div>
                    </div>
                }
                {
                    type == 'rain' &&

                    <div class="weather-rain">
                        <div class="cloud"></div>
                        <div class="rain"></div>
                        <div class="rain"></div>
                        <div class="rain"></div>
                        <div class="rain"></div>
                    </div>
                }
            </div>
        </div>
    )
}
