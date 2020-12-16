import React from 'react'
import { Link, useLocation } from 'react-router-dom';




class SearchScreen extends React.Component {

    state = {
        initial: true,
        prevArtists: null,
        query: null
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/searchResult')
            .then(res => res.json())
            .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, query: res.query, prevArtists: this.state.prevArtists }, () => {
                console.log(this.state);
            }))
            .catch(err => {
                console.log(err);
                this.forceUpdate();
            });
    }


    componentDidUpdate = () => {
        fetch('http://localhost:5000/searchResult')
            .then(res => res.json())
            .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, query: res.query, prevArtists: this.state.prevArtists }, () => {
                // console.log(this.state);
            }))
            .catch(err => {
                console.log(err);
                this.forceUpdate();
            });
    }

    render() {
        // console.log(this.state);
        // if (!this.state.initial && this.state.artists === undefined) {
        //     this.forceUpdate();
        // }
        if (this.state.initial)
            return (
                <div className="mt-4 w-25" >
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' border border-primary placeholder='Search' />
                    </form>
                </div>
            )
        let art = this.state.artists.slice(0, 5);
        let alb = this.state.album !== undefined ? this.state.albums.slice(0, 5) : null;
        let renderContainer = false //By default don't render anything
        if (this.state.render) { //If this.state.render == true, which is set to true by the timer.
            renderContainer = <div>Look at me! I'm content!</div> //Add dom elements
        }

        return (
            <div id="playlist" className="mt-4 ml-4">
                <div className="w-25">
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search' />
                    </form>
                </div>
                <div className="row">
                    <h1 className="text-light mt-4 mb-4 mx-4" > Search results for "{this.state.query}" </h1>
                </div>
                <div className="col ml-3" >
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Artists </h3>
                    </div>
                    <div className="row mb-4" >
                        {art.map((artist, index) => (
                            <div key={index} className='text-playlist text-center pl-3 mb-1 ml-15' style={{ cursor: 'pointer' }}>
                                <form action='/artreq' method='post'>
                                    <button className="border-0" style={{ backgroundColor: "#232323" }}
                                        href={`/album/${artist.browseId}`} type="submit" name="artist" value={artist.browseId + " " + artist.thumbnails[1].url} >
                                        <img className="rounded-circle" src={artist.thumbnails[1].url} />
                                        <h5 className="text-light text-center mt-2 " style={{ fontSize: 16 }}> {artist.name}  </h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col ml-3">
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Albums</h3>
                    </div>
                    {alb !== null ? <div className="row text-wrap w-100" >
                        {alb.map((album, index) => (
                            <div key={index} className='text-playlist mb-5 col-3' style={{ cursor: 'pointer' }}>
                                <form action='/albreq' method='post'>
                                    <button className="border-0" style={{ backgroundColor: "#232323" }}
                                        href={`/album/${album.browseId}`} type="submit" name="album" value={album.browseId} >
                                        <img className="rounded" src={album.thumbnails[1].url} />
                                        <h5 className="text-light text-center "> {album.name}  </h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div> : <h2 className="text-light">No albums found.</h2>
                    }
                </div>
            </div>
        )
    }
}

export default SearchScreen