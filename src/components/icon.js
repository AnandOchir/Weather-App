import React from 'react'

export const Animation = ({id}) => {

    return (
        <div>
            <div>
                <img src={`https://openweathermap.org/img/wn/${id}@2x.png`} alt={'img'} />
            </div>
        </div>
    )
}
