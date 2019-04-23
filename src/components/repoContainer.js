import React from 'react'
import Avatar from './avatar'
import RepoName from './repoName'
import RepoDesc from './repoDesc'
import StarsBox from './starsBox'
import IssuesBox from './issuesBox'
import Submitted from './submitted'

const RepoContainer = (props) => {
    return <div className = "repoContainer">
        <div className = "avatarDiv">
        <Avatar avatar = {props.avatar}/>
        </div>
        <div className = "infoContainer">
        <RepoName name = {props.name}/>
        <RepoDesc description = {props.description}/>
        <StarsBox stars = {props.stars}/>
        <IssuesBox issues = {props.issues}/>
        <Submitted timeInterval = {props.timeInterval} userName = {props.userName}/>
        </div>
        </div>
}
export default RepoContainer
