import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { StarIcon } from './icons';
import { useCol } from '../hooks/firebase'

export const PopUp = ({ uid }) => {
    const [star, setStar] = useState(0);
    const { createRecord } = useCol(`/FeedBack/`)

    const Send = async () => {
        await createRecord(uid, {
            userId: uid,
            feedBack: star
        });
        await console.log('seend')
    }

    return (
        <Popup
            trigger={<button className={'h-40 w-150 fs-20 c-white b-positive bradius-5 rb'} >FeedBack !!</button>}
            modal
            nested
        >
            {
                close => (
                    <div className="modal">
                        <button className="close" onClick={close} >
                            &times;
                    </button>
                        <div className="header"> Feed Back !! </div>
                        <div className='flex justify-center w100' >
                            <div className="content flex justify-between">
                                <div onClick={() => { setStar(1) }} ><StarIcon active={star >= 1 ? true : false} /></div>
                                <div onClick={() => { setStar(2) }} ><StarIcon active={star >= 2 ? true : false} /></div>
                                <div onClick={() => { setStar(3) }} ><StarIcon active={star >= 3 ? true : false} /></div>
                                <div onClick={() => { setStar(4) }} ><StarIcon active={star >= 4 ? true : false} /></div>
                                <div onClick={() => { setStar(5) }} ><StarIcon active={star >= 5 ? true : false} /></div>
                            </div>
                        </div>
                        <div className="actions">
                            <button
                                className="button h-40 w-150 fs-20 c-white b-positive bradius-5 rb"
                                onClick={() => {
                                    close()
                                    Send()
                                }}
                            >
                                Submit
                        </button>
                        </div>
                    </div>
                )}
        </Popup>
    )
}