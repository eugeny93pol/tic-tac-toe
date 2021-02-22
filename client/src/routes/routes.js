import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {OnlinePage} from '../pages/OnlinePage'
import {GamePage} from '../pages/GamePage'
import {CreatePage} from '../pages/CreatePage'

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/games" exact>
                <OnlinePage />
            </Route>
            <Route path="/play/:id" exact>
                <GamePage />
            </Route>
            <Route path="/create" exact>
                <CreatePage />
            </Route>
            <Redirect to="/games" />
        </Switch>
    )
}

