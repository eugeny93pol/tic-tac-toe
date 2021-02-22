import React from 'react'
import {useHistory} from 'react-router-dom'
import {socket} from '../App'

export const GameCard = (data) => {
    const history = useHistory()

    const game = data.game

    const joinHandler = async () => {
        await socket.emit('joinGame', game._id)
        history.push(`/play/${game._id}`)
    }

    return(
        <div className="card card-game" onClick={ joinHandler }>
            <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{ game.title }</h5>
                <p className="card-text">{
                    game.tags.map((tag) => {
                        return (<span key={tag} className='custom-tag'>{tag}</span>)
                    })
                }</p>
                <button
                    type="button"
                    className="btn btn-dark"
                >Join</button>
            </div>
        </div>
    )
}