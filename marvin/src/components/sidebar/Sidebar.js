import React from 'react'
import logo from '../../icons/marvins.png'
import { Link, useLocation } from 'react-router-dom';
import CreatePlaylistModal from '../modals/CreatePlaylistModal';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }
    state = {
        show: false,
    }
    
    createPlaylist = (e) => {
        let user = this.props.user;
        let newOwnedPlaylists = user.ownedPlaylists;
        let newPlaylist = {
            genre: null,
            numPlays:0,
            numTracks: 0,
            privacyType: 0,
            songs: [],
            title: e.target.value
        }
        user.ownedPlaylists.push(newPlaylist);
        console.log(user);
    }

    handleShow = () => {
        this.setState({ show: true });
        console.log("done");
    }

    handleClose = () => {
        this.setState({ show: false });
        console.log("dosne");
    }

    render() {
        return (
            <div style={{ height: 934 }} >
                <div className="p-0 h-100 text-center border border-white border-left-0 border-top-0 border-bottom-0" style={{width: 200}}>
                    <Link to='/login'>
                        <img src={logo} height={85} alt=''/>
                    </Link>
                    <input className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search'></input>
                    <div className='my-1 pt-1 text-center w-100 display-block' style={{background:'#3d8af7', height: 115}}>
                        <Link to='/profile'>
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Home</button>
                        </Link>
                        <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Your Library</button>
                        <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'
                            onClick={this.handleShow}>Create Playlist</button>
                        </div>
                        <div className='h4 text-primary'>My Playlists</div>
                        {this.props.user.ownedPlaylists.map((playlist, index) => (
                            <div key={index} className='text-white text-left pl-3 mb-1'
                                    style={{cursor: 'pointer'}}>
                                <Link to={`/${playlist._id}`}>{playlist.title}</Link>
                            </div>
                        ))}
                        <form action='/logout' method="post">
                        <button action="submit">Logout</button>
                        </form>
                </div>
                <CreatePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow} user={this.props.user}/>
            </div>
        )

    }
}

export default Sidebar