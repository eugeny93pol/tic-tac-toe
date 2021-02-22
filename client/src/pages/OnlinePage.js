import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {socket} from '../App'
import {GameCard} from '../components/GameCard'
import bootstrap from 'bootstrap'


export const OnlinePage = () => {
    const [games, setGames] = useState([])
    const [tags, setTags] = useState([])
    const [filters, setFilters] = useState('')

    const {request} = useHttp()
    const history = useHistory()

    useEffect(() => {
        let cleanupFunction = false
        socket.emit('getGames')
        socket.on('GamesInOnline', data => {
            if (!cleanupFunction) {
                setGames(data)
            }
        })
        return () => cleanupFunction = true
    }, [])

    const getData = useCallback(async () => {
        try {
            const fetched = await request('/api/games/tags', 'GET', null, {})
            setTags(fetched)
        } catch (e) {}
    }, [request])

    useEffect(() => {
        getData()
    }, [getData])

    const createHandler = () => {
        history.push('/create')
    }

    const filterHandler = useCallback(async (e) => {
        const filter = e.target.getAttribute('data-filter')
        if(filters === filter) {
            setFilters('')
        }
        setFilters(filter)
    },[filters])

    return (
        <div className="container-fluid p-0">
            <header>
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarToggleExternalContent"
                                aria-controls="navbarToggleExternalContent" aria-expanded="false"
                                aria-label="Toggle navigation"
                                onClick={ () => { getData() }}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-light"
                            onClick={ createHandler }
                        >Start a new game</button>
                    </div>
                </nav>
                <div className="collapse" id="navbarToggleExternalContent">
                    <div className="bg-dark p-4">
                        {
                            tags.map(tag=> {
                                return (
                                    <button type="button" key={tag._id} id={tag._id} data-filter={tag.name}
                                            className={`btn px-2 m-2 py-0 ${
                                                tag.name === filters ? 'btn-light' : 'btn-outline-light'
                                            }`}
                                            onClick={filterHandler}
                                    >{tag.name}</button>
                                )
                            })
                        }
                    </div>
                </div>
            </header>
            <div className="container-fluid mt-2">
                <main className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2">
                    {
                        games.filter(game => {
                            if (filters !== '')
                                return game.tags.indexOf(filters) >= 0;
                            return true
                        }).map(game => {
                            return (
                                <div className="col" key={game._id}>
                                    <GameCard game={game}/>
                                </div>
                            )
                        })
                    }
                </main>
            </div>
        </div>

    )
}