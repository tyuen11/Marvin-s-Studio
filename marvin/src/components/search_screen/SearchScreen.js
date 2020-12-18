import React from 'react'
import { Query } from 'react-apollo';
import * as Icon from 'react-bootstrap-icons'
import { Link, useLocation } from 'react-router-dom';
import gql from 'graphql-tag'
import ProfilePlaylistLinks from '../profile_screen/ProfilePlaylistLinks'
import musicGenres from 'music-genres'


const GET_USERS = gql`
    query users{
        users {
            _id
            username
        }
    }
`

const GET_PLAYLISTS = gql`
    query playlists {
        playlists {
            _id
            title
            privacyType
        }
    }
`

class SearchScreen extends React.Component {

    state = {
        initial: true,
        prevArtists: null,
        query: null
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/searchResult')
            .then(res => res.json())
            .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, songs: res.songs.content,
                query: res.query, prevArtists: this.state.prevArtists }, () => {
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
            .then(res => this.setState({ initial: false, artists: res.artists.content, albums: res.albums.content, songs: res.songs.content,
                 query: res.query, prevArtists: this.state.prevArtists }, () => {
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
                <div className="mt-4 row">
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-100' type='text' placeholder='Search' />
                    </form>
                    <form action='/feelingLucky' method='post'>
                        <button className='btn btn-primary ml-2' type='submit' name='genre' value={musicGenres.getRandomSubgenre()}>Feeling Lucky</button>
                    </form>
                </div>
            )
        let art = this.state.artists.slice(0, 5);
        let alb = this.state.albums !== undefined ? this.state.albums.slice(0, 5) : null;
        let songs = this.state.songs !== undefined ? this.state.songs.slice(0, 5): null;
        console.log(this.state.albums);
        let renderContainer = false //By default don't render anything
        let users, playlists, playlistIDs
        if (this.state.render) { //If this.state.render == true, which is set to true by the timer.
            renderContainer = <div>Look at me! I'm content!</div> //Add dom elements
        }

        return (
            <div id="playlist" className="mt-4 ml-4">
                <div className="mt-4 row">
                    <form action='/sidebar' method='post'>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-100' type='text' placeholder='Search' />
                    </form>
                    <form action='/feelingLucky' method='post'>
                        <button className='btn btn-primary ml-2' type='submit' name='genre' value={musicGenres.getRandomSubgenre()}>Feeling Lucky</button>
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
                            <div key={index} className='text-center pl-3 mb-1 ml-15' style={{ cursor: 'pointer' }}>
                                <form action='/artreq' method='post'>
                                    <button className="text-playlist border-0" style={{ backgroundColor: "#232323" }}
                                        href={`/album/${artist.browseId}`} type="submit" name="artist" value={artist.browseId + " " + artist.thumbnails[1].url} >
                                        <img className="rounded-circle" src={artist.thumbnails[1].url} />
                                        <h5 className="text-center mt-2 " style={{ fontSize: 16 }}> {artist.name}  </h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col ml-3 pr-5 mr-5">
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Albums</h3>
                    </div>
                    {alb !== null ? <div className="row text-wrap w-100" >
                        {alb.map((album, index) => (
                            <div key={index} className='mb-5 col-2 mx-2' style={{ cursor: 'pointer' }}>
                                <form action='/albreq' method='post'>
                                    <button className="text-playlist border-0" style={{ backgroundColor: "#232323" }}
                                        href={`/album/${album.browseId}`} type="submit" name="album" value={album.browseId} >
                                        <img className="rounded" src={album.thumbnails[1].url} />
                                        <h5 className="text-center ">{album.name}</h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div> : <h2 className="text-light">No Albums Found</h2>
                    }
                </div>
                <div className="col ml-3 pr-5 mr-5">
                    <div className="row">
                        <h3 className='text-white text-center my-3'>Songs</h3>
                    </div>
                    {songs !== null ? <div className="row text-wrap w-100" >
                        {songs.map((song, index) => (
                            <div key={index} className='mb-5 col-2 mx-2' style={{ cursor: 'pointer' }}>
                                <form action='/albreq' method='post'>
                                    <button className="text-playlist border-0" style={{ backgroundColor: "#232323" }}
                                        href={`/album/${song.browseId}`} type="submit" name="album" value={song.album.browseId} >
                                        <img className="rounded" src={song.thumbnails[1].url} />
                                        <h5 className="text-center ">{song.name}</h5>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div> : <h2 className="text-light">No Songs Found</h2>
                    }
                </div>
                <Query query={GET_USERS}>
                    {({ loading, error, data }) => {
                        if (loading) return 'Loading'
                        if (error) return `Error! ${error.message}`
                        else {
                            users = data.users.filter(user => user._id !== "5fdc52a21d96445e6ab4d805" && user.username.toLowerCase().includes(this.state.query.toLowerCase()))
                        }
                        return (
                            <div className="col ml-3">
                                <div className="row">
                                    <h3 className='text-white text-center my-3'>Users</h3>
                                </div>
                                {users !== null && users.length ? 
                                    <div className="row text-wrap w-100" >
                                        {users.map((user, index) => (
                                            <div key={index} className='mb-5 col-2 ml-2 text-center' style={{ cursor: 'pointer' }}>
                                                <Link className="text-playlist border-0" style={{ backgroundColor: "#232323" }} to={`/app/profile/${user._id}`} >
                                                    <Icon.PersonCircle size={100} color="white"/>
                                                    <h5> {user.username}  </h5>
                                                </Link>
                                            </div>
                                        ))}
                                    </div> : 
                                    <h2 className="text-light">No Users Found</h2>
                                }
                            </div>
                        )
                    }}
                </Query>
                <Query query={GET_PLAYLISTS}>
                    {({ loading, error, data }) => {
                        if (loading) return 'Loading'
                        if (error) return `Error! ${error.message}`
                        else {
                            playlists = data.playlists.filter(playlist => playlist.title.toLowerCase().includes(this.state.query.toLowerCase()) && playlist.privacyType == 0)
                            playlistIDs = []
                            playlists.forEach(playlist => playlistIDs.push(playlist._id))
                            console.log("Playlists:", playlists)
                            console.log("PlaylistIDs:", playlistIDs)
                        }
                        return (
                            <div className="col ml-3">
                                <div className="row">
                                    <h3 className='text-white text-center my-3'>Playlists</h3>
                                </div>
                                {playlistIDs !== null && playlistIDs.length ? 
                                    <ProfilePlaylistLinks playlists={playlistIDs}/>
                                    // <div className="row text-wrap w-100" >
                                    //     {playlists.map((playlist, index) => (
                                    //         <div key={index} className='mb-5 col-2 ml-2 text-center' style={{ cursor: 'pointer' }}>
                                    //             <Link className="text-playlist border-0" style={{ backgroundColor: "#232323" }} to={`/app/playlist/${playlist._id}`} >
                                    //                 <Icon.MusicNoteBeamed size={100} color="white"/>
                                    //                 <h5> {playlist.title}  </h5>
                                    //             </Link>
                                    //         </div>
                                    //     ))}
                                    // </div> 
                                    : 
                                    <h2 className="text-light">No Playlists Found</h2>
                                }
                            </div>
                        )
                    }}
                </Query>
            </div>
        )
    }
}

export default SearchScreen