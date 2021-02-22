import React, {useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {socket} from '../App'
import {useHistory} from 'react-router-dom'
import Tags from '@yaireo/tagify/dist/react.tagify'


export const CreatePage = () => {
    const {request, loading} = useHttp()
    const history = useHistory()
    const [tagifyProps, setTagifyProps] = useState({})

    const [tags, setTags] = useState([])
    const [title, setTitle] = useState('')

    const baseTagifySettings = {
        maxTags: 7,
        placeholder: 'Write some tags',
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value),
        dropdown: {
            classname: 'dropdown',
            enabled: 1
        }
    }

    const changeHandler = event => {
        setTitle(event.target.value)
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/games/create', 'POST', {title, tags, creator: socket.id})
            if (data) {
                socket.emit('startGame', data._id)
                history.push(`/play/${data._id}`)
            }
        } catch (e) {
        }
    }

    const backHandler = () => {
        history.push('/online')
    }

    useEffect(async () => {
        setTagifyProps({loading: true})
        try {
            const fetched = await request('/api/games/tags', 'GET', null, {})
            const names = fetched.map((tag) => {
                return tag.name})
            setTagifyProps((lastProps) => ({
                ...lastProps,
                whitelist: names,
                loading: false
            }))
        } catch (e) {}

    }, [request])

    return(
        <div className="d-flex justify-content-center">
            <div className="col col-sm-8 col-md-6 col-lg-4 p-2 p-sm-0">
                <h3 className="mt-3 mt-sm-4 mt-lg-5">Start your game</h3>
                <p>To start a new game, enter a name (required) and add tags if you want</p>
                <form>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingTitle"
                            name="title"
                            value={ title }
                            onChange={ changeHandler }
                            placeholder="Name of the game"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <Tags
                            settings={baseTagifySettings}
                            className="tagify-custom"
                            {...tagifyProps}
                            onChange={e => {
                                const tagNames = e.target.value.split(',')
                                setTags(tagNames)
                            }}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <button
                            className="btn btn-outline-dark"
                            onClick={ backHandler }
                        >Back to games</button>
                        <button
                            type="submit"
                            className="btn btn-dark"
                            onClick={createHandler}
                            disabled={ loading || title.length < 2 }
                        >{ loading ? 'Loading...' : `Let's start!` }</button>
                    </div>
                </form>
            </div>
        </div>
    )
}