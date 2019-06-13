import React, { Component } from "react";
import "./App.css";
import RepoContainer from "./components/repoContainer";

class App extends Component {
  state = {
    repos: [],
    isLoadingFirstPage: true,
    currentPage: 0
  };
  //
  componentWillMount() {
    this.getDataFromApi();
  }
  //
  getDataFromApi = () => {
    let { currentPage } = this.state;
    let apiUrl = `https://api.github.com/search/repositories?q=created:>${this.oneMonthBeforeToday()}&sort=stars&order=desc${"&page=" +
      (currentPage + 1)}`;
    fetch(apiUrl)
      .then(res => res.json())
      .then(this.extractReposFromFetchedData);
  };
  //
  loadNextPage = () => {
    if (this.hasScrolledToTheEndOfList()) {
      this.stopListeningToScrolling();
      this.getDataFromApi();
    }
  };
  //
  extractReposFromFetchedData = data => {
    let { items: newRepos } = data;
    this.updateRepos(newRepos);
    this.listenToScrolling();
  };
  //
  updateRepos = fetchedRepos => {
    let { repos, currentPage } = this.state;
    this.setState({
      repos: [...repos, ...fetchedRepos],
      isLoadingFirstPage: false,
      currentPage: currentPage + 1
    });
  };
  //
  oneMonthBeforeToday = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
      // the api recognizes months as from 1 to 12 while the date obj in js treats months as from 0 to 11.
    let dateString = `${year}-${
      month < 9 && month !== 0 ? "0" + month : month === 0 ? 12 : month
    }-${day < 10 ? "0" + day : day}`;
    console.log(dateString);
    return dateString;
  };
  //
  listenToScrolling = () =>
    window.addEventListener("scroll", this.loadNextPage);
  //
  hasScrolledToTheEndOfList = () =>
    window.innerHeight + document.documentElement.scrollTop ===
    document.documentElement.offsetHeight;
  //
  stopListeningToScrolling = () =>
    window.removeEventListener("scroll", this.loadNextPage);
  //
  convertAndDisplayTimePassedWithAppropriateUnit = pushed_at => {
    if (this.hasADayOrMorePassedSincePushed(pushed_at))
      return this.timePassedSincePushedInDays(pushed_at) + " day(s) ago";
    else if (this.hasAnHourOrMorePassedSincePushed(pushed_at))
      return this.timePassedSincePushedInHours(pushed_at) + " hour(s) ago";
    else
      return this.timePassedSincePushedInMinutes(pushed_at) + " minute(s) ago";
  };
  //
  timePassedSincePushed = pushed_at => {
    const TODAY = new Date();
    return TODAY - new Date(pushed_at);
  };
  //
  hasADayOrMorePassedSincePushed = pushed_at =>
    this.timePassedSincePushedInHours(pushed_at) >= 24;
  //
  hasAnHourOrMorePassedSincePushed = pushed_at =>
    this.timePassedSincePushedInMinutes(pushed_at) >= 60;
  //
  timePassedSincePushedInDays = pushed_at =>
    this.convertTimePassedToDays(this.timePassedSincePushed(pushed_at));
  //
  timePassedSincePushedInHours = pushed_at =>
    this.convertTimePassedToHours(this.timePassedSincePushed(pushed_at));
  //
  timePassedSincePushedInMinutes = pushed_at =>
    this.convertTimePassedToMinutes(this.timePassedSincePushed(pushed_at));
  //
  convertTimePassedToMinutes = TimePassed => {
    const A_MILLESECOND_IN_MINUTES = 1000 * 60;
    return parseInt(TimePassed / A_MILLESECOND_IN_MINUTES);
  };
  //
  convertTimePassedToHours = TimePassed => {
    const A_MILLESECOND_IN_HOURS = 1000 * 60 * 60;
    return parseInt(TimePassed / A_MILLESECOND_IN_HOURS);
  };
  //
  convertTimePassedToDays = TimePassed => {
    const A_MILLESECOND_IN_DAYS = 1000 * 60 * 60 * 24;
    return parseInt(TimePassed / A_MILLESECOND_IN_DAYS);
  };
  //
  displayStarsAndIssuesAppropriatly = starsOrIsssues => {
    if (starsOrIsssues > 1000) {
      return (starsOrIsssues / 1000).toFixed(1) + "k";
    } else {
      return starsOrIsssues;
    }
  };
  //
  componentWillUnmount() {
    this.stopListeningToScrolling();
  }
  //
  render() {
    const { isLoadingFirstPage, repos } = this.state;

    return (
      <div className="App">
        {isLoadingFirstPage
          ? "Loading.."
          : repos.map(repo => (
              <RepoContainer
                avatar={repo.owner["avatar_url"]}
                name={repo.name}
                description={repo.description}
                stars={this.displayStarsAndIssuesAppropriatly(
                  repo["stargazers_count"]
                )}
                issues={this.displayStarsAndIssuesAppropriatly(
                  repo["open_issues_count"]
                )}
                timeInterval={this.convertAndDisplayTimePassedWithAppropriateUnit(
                  repo["pushed_at"]
                )}
                userName={repo.owner.login}
                key={repo.id}
              />
            ))}
      </div>
    );
  }
}

export default App;
