import React from 'react'
import SongSearchLinks from './SongSearchLinks';
import { Link, useLocation } from 'react-router-dom';



class SearchScreen extends React.Component {
        state = {
                artists: null,
                albums:null
        }
        componentDidMount = () => {
                fetch('http://localhost:5000/searchArtist')
                        .then(res => res.json())
                        .then(res => this.setState({ artists: res.content }))
                        .catch(err => {
                                console.log(err);
                        });
                        fetch('http://localhost:5000/searchAlbum')
                        .then(res => res.json())
                        .then(res => this.setState({ albums: res.content }))
                        .catch(err => {
                                console.log(err);
                        });
        }
        render() {
                if (this.state.artists == undefined)
                        return <div>Loading...</div>
                let art = this.state.artists.slice(0, 5)

                if (this.state.albums == undefined)
                return <div>Loading...</div>
        let alb = this.state.albums.slice(0, 5)
                console.log(alb)
                return (
                        <div id="playlist" >
                                <div className="row" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                        <h3 className="text-light" style={{ paddingTop: "20px", fontSize: "50px", paddingLeft: "20px" }}> Search Results for</h3>
                                </div>
                                <div className="col" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderLeftWidth: "0px", borderRightWidth: "0px" }}>
                                        <div className="row">
                                                <h3 className='text-white text-center'>Artists </h3>

                                        </div>
                                        <div className="row" >
                                                {art.map((artist, index) => (
                                                        <div key={index} className='text-white text-center pl-3 mb-1 ml-15'style={{ cursor: 'pointer' }}>
                                                                <Link to= {`/artist/${art[index].browseId}`}>
                                                                        <a><input type="image"
                                                                                src={art[index].thumbnails[1].url} alt="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                                                        </input> 
                                                                        </a>
                                                                        </Link> 
                                                             
                                                                <h4 className="text-light"> {art[index].name} </h4>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                                <div className="col" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderLeftWidth: "0px", borderRightWidth: "0px" }}>
                                        <div className="row">
                                                <h3 className='text-white text-center'>Albums</h3>

                                        </div>
                                        <div className="row" >
                                                {art.map((album, index) => (
                                                        <div key={index} className='text-white text-center pl-3 mb-1 ml-15'style={{ cursor: 'pointer' }}>
                                                                
                                                                <h4 className="text-light "> {alb[index].name} </h4>
                                                                <Link to= {`/album/${alb[index].browseId}`}>
                                                                        <a><input type="image"
                                                                                src={alb[index].thumbnails[1].url} alt="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                                                        </input> 
                                                                        </a>
                                                                        </Link> 
                                                                <h4 className="text-light text-center "> {alb[index].artist} </h4>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                )
        }
}

export default SearchScreen
