import React, { Component } from 'react';
import './App.css';
import RepoContainer from './components/repoContainer'

class App extends Component {
    state = {
        repos: [],
        isLoadingFirstPage: true
    }
////////////////////
componentWillMount(){
    this.loadFirstPage();
}
/////////////////////
oneMonthBeforeToday = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let dateString = `${year}-${month < 9 && month !== 0 ? "0" + (month): month === 0 ? 12  : month }-${day < 10 ? "0" + day: day}`
    return dateString
}
//////////////////////
loadFirstPage = () => {
    let firstPageUrl = `https://api.github.com/search/repositories?q=created:>${this.oneMonthBeforeToday()}&sort=stars&order=desc`
    fetch(firstPageUrl)
        .then(res => res.json())
            .then(data => {
                const repos = data.items;
                this.setState({
                        repos: repos,
                        isLoadingFirstPage: false,
                        currentPage: 1
                    });
                this.listenToScrolling();
        })
}
/////////////////////
listenToScrolling = () => window.addEventListener("scroll", this.loadNextPage);
///////////////////////
loadNextPage = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight){
        let currentPage = this.state.currentPage
        let nextPageUrl = `https://api.github.com/search/repositories?q=created:>${this.oneMonthBeforeToday()}&sort=stars&order=desc${"&page="+(currentPage + 1)}`
        fetch(nextPageUrl)
            .then(res => res.json())
                .then(data => {
                    let {repos} = this.state;
                    let nextPageRepos = data.items;
                    this.setState({
                            repos: repos.concat(nextPageRepos),
                            currentPage: currentPage + 1
                        })
                })
    }
}
///////////////////////
componentWillUnmount(){
    window.removeEventListener("scroll", this.loadNextPage);
}
//////////////////////
  render() {
    const {isLoadingFirstPage, repos} = this.state
    const converToDays = 1000*60*60*24;
    const converToHours = 1000*60*60;
    const converToMinutes = 1000*60;
    const today = new Date();
    
    return (
      <div className="App">
        {isLoadingFirstPage? "Loading.." :repos.map( repo =>
        <RepoContainer
            avatar = {repo.owner["avatar_url"]}
            name = {repo.name}
            description = {repo.description}
            stars = {repo["stargazers_count"] > 1000? (repo["stargazers_count"]/ 1000).toFixed(1) + "k":repo["stargazers_count"]}
            issues = {repo["open_issues_count"] > 1000? (repo["open_issues_count"]/ 1000).toFixed(1) + "k":repo["open_issues_count"]}
            // this part was really fun :D!
            timeInterval = {parseInt((today - new Date(repo["pushed_at"])) / converToHours) >= 24 ? parseInt((today - new Date(repo["pushed_at"])) / converToDays) + " day(s) ago": parseInt((today - new Date(repo["pushed_at"])) / converToMinutes) >= 60 ? parseInt((today - new Date(repo["pushed_at"])) / converToHours) + " hour(s) ago": parseInt((today - new Date(repo["pushed_at"])) / converToMinutes) + " minute(s) ago"}
            userName = {repo.owner.login}
            key = {repo.id}
        />)}
      </div>
    );
  }
}

export default App;
