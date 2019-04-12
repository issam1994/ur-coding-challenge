import React from 'react'

const StarsBox = (props) => {
    return <div className="starsBox">
            <p><strong>Stars:</strong> {props.stars || "0"}</p>
        </div>
}

export default StarsBox