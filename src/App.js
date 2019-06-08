import React, { Component } from "react";
import "./App.css";
import RepoContainer from "./components/repoContainer";

class App extends Component {
  state = {
    repos: [],
    isLoadingFirstPage: true
  };
  //
  componentWillMount() {
    this.loadFirstPage();
  }
  //
  oneMonthBeforeToday = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let dateString = `${year}-${
      month < 9 && month !== 0 ? "0" + month : month === 0 ? 12 : month
    }-${day < 10 ? "0" + day : day}`;
    return dateString;
  };
  //
  listenToScrolling = () =>
    window.addEventListener("scroll", this.loadNextPage);
  //
  scrolledToTheEndOfList = () =>
    window.innerHeight + document.documentElement.scrollTop ===
    document.documentElement.offsetHeight;
  //
  dontListenToScrolling = () =>
    window.removeEventListener("scroll", this.loadNextPage);
  //
  loadFirstPage = () => {
    let firstPageUrl = `https://api.github.com/search/repositories?q=created:>${this.oneMonthBeforeToday()}&sort=stars&order=desc`;
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
      });
  };
  //
  loadNextPage = () => {
    if (this.scrolledToTheEndOfList()) {
      this.dontListenToScrolling();
      let currentPage = this.state.currentPage;
      let nextPageUrl = `https://api.github.com/search/repositories?q=created:>${this.oneMonthBeforeToday()}&sort=stars&order=desc${"&page=" +
        (currentPage + 1)}`;
      fetch(nextPageUrl)
        .then(res => res.json())
        .then(data => {
          let { repos } = this.state;
          let nextPageRepos = data.items;
          this.setState({
            repos: repos.concat(nextPageRepos),
            currentPage: currentPage + 1
          });
          this.listenToScrolling();
        });
    }
  };
  //
  componentWillUnmount() {
    this.dontListenToScrolling();
  }

  //
  displayStarsAndIssuesAppropriatly = starsOrIsssues => {
    if (starsOrIsssues > 1000) {
      return (starsOrIsssues / 1000).toFixed(1) + "k";
    } else {
      return starsOrIsssues;
    }
  };

  //
  timePassedSinceLastTimePushed = pushed_at => {
    const TODAY = new Date();
    return TODAY - new Date(pushed_at);
  };
  //
  convertAndDisplayTimeWithAppropriateUnit = pushed_at => {
    if (
      this.convertMillesecondsToHours(
        this.timePassedSinceLastTimePushed(pushed_at)
      ) >= 24
    )
      return (
        this.convertMillesecondsToDays(
          this.timePassedSinceLastTimePushed(pushed_at)
        ) + " day(s) ago"
      );
    else if (
      this.convertMillesecondsToMinutes(
        this.timePassedSinceLastTimePushed(pushed_at)
      ) >= 60
    )
      return (
        this.convertMillesecondsToHours(
          this.timePassedSinceLastTimePushed(pushed_at)
        ) + " hour(s) ago"
      );
    else
      return (
        this.convertMillesecondsToMinutes(
          this.timePassedSinceLastTimePushed(pushed_at)
        ) + " minute(s) ago"
      );
  };
  //
  convertMillesecondsToMinutes = milleseconds => {
    const A_MILLESECOND_IN_MINUTES = 1000 * 60;
    return parseInt(milleseconds / A_MILLESECOND_IN_MINUTES);
  };
  //
  convertMillesecondsToHours = milleseconds => {
    const A_MILLESECOND_IN_HOURS = 1000 * 60 * 60;
    return parseInt(milleseconds / A_MILLESECOND_IN_HOURS);
  };
  //
  convertMillesecondsToDays = milleseconds => {
    const A_MILLESECOND_IN_DAYS = 1000 * 60 * 60 * 24;
    return parseInt(milleseconds / A_MILLESECOND_IN_DAYS);
  };
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
                timeInterval={this.convertAndDisplayTimeWithAppropriateUnit(
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
