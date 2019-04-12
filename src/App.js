import React, { Component } from 'react';
import './App.css';
import RepoContainer from './components/repoContainer'

class App extends Component {
    
    state = {
        repos: [],
        isLoading: true,
        page: 1
    }
    // this function returns today's date minus 1 month
goBack30 = (today) => {
//    console.log(today)
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    return `${year}-${month < 9 && month !== 0 ? "0" + (month): month === 0 ? 12  : month }-${day < 10 ? "0" + day: day}`
}
    // depending on the string passed, this function updates state with new repos
loadData = (str) => {
    let today = new Date();
    let last30Days = this.goBack30(today);
    let pageNumber = this.state.page;
    let isLoading = this.state.isloading;
    // on the first run of the app we load the first page of repos
    if (str === "first load"){
        fetch(`https://api.github.com/search/repositories?q=created:>${last30Days}&sort=stars&order=desc`).then(res => res.json())
        .then(data => {
        const repos = data.items;
//        console.log(repos)
        this.setState({
        repos: repos,
        isLoading: false
        })  
    })
    }
    // on the next load, the app fetches the next page of repos to update state by adding more repos and saving the current page number
    else if (str === "next load" && !isLoading){
        fetch(`https://api.github.com/search/repositories?q=created:>${last30Days}&sort=stars&order=desc${"&page=" + (pageNumber + 1)}`).then(res => res.json())
        .then(data => {
        let currentRepos = this.state.repos;
        let NextRepos = data.items;
//        console.log(repos)
        this.setState({
        repos: currentRepos.concat(NextRepos),
        page: pageNumber + 1
        })
        })
    }
}
    // when a user scrolls down to the end, this function is triggered and calls LoadData to fetch the next page of repos
loadMore = () => {
//    console.log("scrolling");
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight){
        this.loadData("next load");
//        console.log("end of the line!");
      }
}
    // in this lifecycle method we load the first page of repos by calling loadData() and passing the string "first load"
componentWillMount(){
    
    this.loadData("first load");
    
    
}
    // listening to scroll event
componentDidMount(){
    window.addEventListener("scroll", () => this.loadMore())
}
    // removing the event listener when the component unmounts {a good practice}
componentWillUnmount(){
    window.removeEventListener("scroll", () => this.loadMore());
}

  render() {
      
    const reposArr = this.state.repos;
    const converToDays = 1000*60*60*24;
    const converToHours = 1000*60*60;
    const converToMinutes = 1000*60;
    let isLoading = this.state.isLoading
    let today = new Date();
    
    return (
      <div className="App">
        <h1 id="title">Trending Repos</h1>
        {isLoading? "Loading.." :reposArr.map( repo =>
        <RepoContainer
        avatar = {repo.owner["avatar_url"]}
        name = {repo.name}
        description = {repo.description}
        stars = {repo["stargazers_count"] > 1000? (repo["stargazers_count"]/ 1000).toFixed(2) + "k":repo["stargazers_count"]}
        issues = {repo["open_issues_count"] > 1000? (repo["open_issues_count"]/ 1000).toFixed(2) + "k":repo["open_issues_count"]}
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
