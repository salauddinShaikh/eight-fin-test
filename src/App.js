import React, { Component } from 'react';
import { MockData } from './mockData';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: MockData.slice(0, 12),
      currentPage: 1,
      totalNoOfPage: Math.ceil(MockData.length / 12),
      pages: [],
    }
    this.itemPerPage = 12;
    this.sortBy = "";
    this.searchKey = "";
    this.filteredList = MockData;
  }
  componentDidMount() {
    const sessionState = sessionStorage.getItem('state');
    if (sessionState) {
      let state = JSON.parse(sessionState)
      this.sortList({ target: { value: state.sortBy } })
      this.onSearch({ target: { value: state.searchKey } }, state.pageNo)
    } else {
      this.sortList({ target: { value: 'Title' } })
    }
  }
  onPageChange = (pageNo) => {
    let startIndex = (pageNo - 1) * this.itemPerPage;
    let endIndex = pageNo * this.itemPerPage;
    let list = this.filteredList.slice(startIndex, endIndex)
    let pages = [];
    let totalNoOfPage = Math.ceil(this.filteredList.length / this.itemPerPage);
    for (let i = 1; i <= totalNoOfPage; i++) {
      pages.push(i);
    }
    this.setState({ list, currentPage: pageNo, totalNoOfPage, pages });
    sessionStorage.setItem('state', JSON.stringify({ searchKey: this.searchKey, sortBy: this.sortBy, pageNo }))
  }
  onSearch = (event, pageNo = 1) => {
    let searchString = event.target.value;
    if (searchString) {
      this.filteredList = MockData.filter((v, i) =>
        v.name.toLowerCase().includes(searchString.toLowerCase())
      );
    } else {
      this.filteredList = MockData;
    }
    this.searchKey = event.target.value;
    this.onPageChange(pageNo);
  }
  sortList = (event) => {
    if (event.target.value === 'Date') {
      this.filteredList.sort((a, b) => ((new Date(a.dateLastEdited)).getTime() > ((new Date(b.dateLastEdited)).getTime())) ? 1 : ((new Date(b.dateLastEdited)).getTime() > ((new Date(a.dateLastEdited)).getTime()) ? -1 : 0));
    } else {
      this.filteredList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    }
    this.sortBy = event.target.value;
    this.onPageChange(1);
  }
  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }
 
  render() {
    const { list, currentPage, pages } = this.state;
    return (
      <div className="container">
        <div className="action-row">
          <div className="action-item">
            <input type="text" value={this.searchKey} onChange={this.onSearch} className="search-input" placeholder="Search" />
          </div>
          <div className="action-item">
            <span>Sort By</span>
            <select onChange={this.sortList} value={this.sortBy} className="search-input">
              <option value="Title">Title</option>
              <option value="Date">Date</option>
            </select>
          </div>
        </div>
        <div className="grid-row">
          {list.length === 0 && <h3>No Result found</h3>}
          {list.map((item, key) =>
            <div className="grid-item" key={key}>
              <div className="tiles">
                <img src={item.image} alt="Avatar" className="card-image" />
                <div className="card-detail">
                  <div><b>{item.name}</b></div>
                  <div className="description">{item.description}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="center">
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => this.onPageChange(currentPage - 1)}>«</button>
            {
              pages.map((item, index) =>
                <button
                  onClick={() => this.onPageChange(index + 1)}
                  className={index + 1 === currentPage ? "active" : ""}
                  key={index}>{index + 1}</button>
              )
            }
            <button disabled={currentPage === pages.length} onClick={() => this.onPageChange(currentPage + 1)}>»</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className="hide-sm">Description</th>
                <th >Image</th>
                <th className="hide-sm" style={{ width: '10%' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, key) =>
                <tr key={key}>
                  <td>{item.name}</td>
                  <td className="overflow hide-sm">{item.description}</td>
                  <td className=""><img className='table-img' src={item.image} /></td>
                  <td className="hide-sm">{this.formatDate(item.dateLastEdited)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
