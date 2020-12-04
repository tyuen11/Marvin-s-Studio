import React from 'react'
import { Link, useLocation } from 'react-router-dom';




class SearchScreen extends React.Component {

    state = {
        initial: true,
        prevArtists: null
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/searchResult')
        .then(res => res.json())
        .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, query: res.query}))
        .catch(err => {
            console.log(err);
        });

        console.log(this.state);
        
    }

    componentDidUpdate = () => {
        fetch('http://localhost:5000/searchResult')
        .then(res => res.json())
        .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, query: res.query}))
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        if (this.state.initial) 
            return (
                <div className="mt-4 w-25">
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search' />
                    </form>
                </div>
            )
        let art = this.state.artists.slice(0, 5);
        let alb = this.state.albums.slice(0, 5);
    

        return (
            <div id="playlist" className="mt-4">
                <div className="w-25">
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search' />
                    </form>
                </div>
                <div className="row" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderLeftWidth: "0px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                    <h1 className="text-light mt-4 mb-4 mx-4" > Search results for "{this.state.query}" </h1>
                </div>
                <div className="col ml-3" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderLeftWidth: "0px", borderRightWidth: "0px" }}>
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Artists </h3>
                    </div>
                    <div className="row mb-4" >
                        {art.map((artist, index) => (
                                <div key={index} className='text-white text-center pl-3 mb-1 ml-15' style={{ cursor: 'pointer' }}>
                                     <form action='/artreq'  method='post'>
                                        <button className="border-0" style={{backgroundColor:"#232323"}} 
                                            href={`/album/${artist.browseId}`} type="submit" name="artist" value={artist.browseId + " " + artist.thumbnails[1].url} >
                                            <img className="rounded-circle" src={artist.thumbnails[1].url} onError="this.onerror=null; this.src='https://dalelyles.com/musicmp3s/no_cover.jpg';"/>
                                            <h5 className="text-light text-center "> {artist.name}  </h5>
                                        </button>
                                    </form>

                                </div>
                          
                        ))}
                    </div>
                </div>

                <div className="col ml-3" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderLeftWidth: "0px", borderRightWidth: "0px" }}>
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Albums</h3>
                    </div>
                    <div className="row mb-4" >
                        {alb.map((album, index) => (
                            <div key={index} className='text-white text-center mb-1  mx-3' style={{ cursor: 'pointer' }}>
                                <form action='/albreq' method='post'>
                                    <button className="border-0" style={{backgroundColor:"#232323"}} 
                                        href={`/album/${album.browseId}`} type="submit" name="album" value={album.browseId} >
                                        <img className="rounded" src={album.thumbnails[1].url} onError="this.onerror=null; this.src='https://dalelyles.com/musicmp3s/no_cover.jpg';"/>
                                        <h5 className="text-light text-center "> {album.name}  </h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchScreen
