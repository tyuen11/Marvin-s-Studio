import React from 'react'
import SongSearchLinks from './SongSearchLinks';

class SearchScreen extends React.Component {
        render() {
                return (
                        <div id="playlist" className="container" >
                                <div className="row" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                        <h3 className="text-light" style={{ paddingTop: "20px", fontSize: "50px", paddingLeft: "20px" }}> Search Results for Anon </h3>
                                        {fetch('/search').then(res => res.json())}
                                </div>
                                <div className="row" >
                                        <div className="col">
                                        </div>
                                        <div className="col"> <h3 style={{ color: "white" }}>Artists </h3>
                                        </div>Î
                                </div>
                                <div className='row'>
                                        <div className="col"> <h3 style={{ color: "white" }}>Albums</h3>
                                        </div>
                                        <div className="col" style={{ border: "solid", borderWidth: "1px", color: "white" }}> <h3 style={{ color: "white" }}>Users </h3>

                                        </div>Î
                                </div>
                        </div>
                )
        }
}

export default SearchScreen
