import React from 'react'
import {useHistory} from 'react-router-dom'

export const ModalMessage = ({message}) => {
    const history = useHistory()

    const clickHandler = () => {
        history.push('/games')
    }

    return(
        <div id="staticBackdrop" className="modal fade"  data-bs-backdrop="static"
             data-bs-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div  className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Game Over</h5>
                        <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"
                                onClick={ clickHandler }
                        />
                    </div>
                    <div className="modal-body">
                        <p>{ message }</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-dark"
                                data-bs-dismiss="modal"
                                onClick={ clickHandler }
                        >Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}