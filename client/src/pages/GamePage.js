import React, {useCallback, useEffect, useState} from 'react'
import {socket} from '../App'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {ModalMessage} from '../components/ModalMessage'

export const GamePage = () => {
    const {request, loading} = useHttp()
    const [game, setGame] = useState(null)
    const [type, setType] = useState(true)
    const [move, setMove] = useState(false)
    const [moves, setMoves] = useState(Array(9).fill(-1))
    const [message, setMessage] = useState('Waiting for an opponent')

    const gameId = useParams().id
    const bootstrap = require('bootstrap')

    const getGame = useCallback(async () => {
        try {
            const fetched = await request(`/api/games/${gameId}`, 'GET', null)
            setGame(fetched)
        } catch (e) {}
    }, [gameId, request])

    const showMessage = useCallback(() => {
        const m = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
            backdrop: false,
            keyboard: false
        })
        m.show()
    }, [])


    useEffect(() => {
        getGame()

        socket.on('setZero', (id) => {
            setType(false)
        })

        socket.on('doMove', (id) => {
            setMove(true)
            setMessage('Make your move')
        })

        socket.on('wait', () => {
            setMove(false)
            setMessage('Waiting for the opponent to move')
        })

        socket.on('ready', () => {
            setMove(true)
            setMessage('Opponent found, make your move')
        })

        socket.on('updateMoves', (m) => {
            setMoves(m)
        })

        socket.on('win', () =>{
            setMessage('You are win the game!')
            showMessage()
        })

        socket.on('lose', () => {
            setMessage('You lost the game')
            showMessage()
        })

        socket.on('draw', () => {
            setMessage('No more moves')
            showMessage()
        })

    }, [getGame, socket])

    const moveHandler = (e) => {
        const target = e.target.getAttribute('data-value')
        if (move && moves[target]<0) {

            let tmpMoves = moves
            tmpMoves[target] = type ? 1 : 0
            setMoves(tmpMoves)

            setMove(false)
            socket.emit('move', { move: target, moves})
        }
    }

    return(
        <>
        <div className="container-fluid d-flex align-items-start align-items-sm-center justify-content-center"
             style={{minHeight: '100vh'}}>
            <div className="row">
                <div className="col-sm align-self-center my-5 my-sm-0">
                    <h2> {!loading && game && game.title} </h2>
                    <p>{
                        !loading && game && game.tags.map(tag => {
                            return(
                                <span className="custom-tag" key={tag}>{tag}</span>
                            )
                        })
                    }</p>
                    <div className="d-none d-sm-block">
                        <p>The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.</p>
                        <p>When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.</p>
                    </div>

                    <div className="alert alert-success text-center" role="alert">
                        { message }
                    </div>

                </div>
                <div className="col-sm">
                    <div className="d-flex justify-content-center">
                        <div className="game p-2 gap-2 bg-secondary rounded-3">
                            {
                                moves.map((m, i) => {
                                    return (
                                        <div
                                            className={`box rounded-3 ${
                                                m<0 ?
                                                    (move) ?
                                                        (type) ? 'box-cross-c' : 'box-zero-c'
                                                        : ''
                                                    : m===0 ? ' box-zero' : ' box-cross'}`
                                            }
                                            data-value={ i }
                                            onClick={ moveHandler }
                                            key={ i }
                                        />)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <ModalMessage message={ message }/>
        </>
    )
}