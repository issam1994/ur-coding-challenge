import React from 'react'

const Submitted = (props) => {
    return <div className="submitted">
        <p><i>Submitted {props.timeInterval} by <strong>{props.userName}</strong></i></p>
        </div>
}

export default Submitted