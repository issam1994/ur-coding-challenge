import React from 'react'

const IssuesBox = (props) => {
    return <div className="issuesBox">
            <p><strong>Issues:</strong> {props.issues || "0"}</p>
        </div>
}

export default IssuesBox