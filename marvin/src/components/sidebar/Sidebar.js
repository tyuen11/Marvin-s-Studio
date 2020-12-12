import React from 'react'
import logo from '../../icons/marvins.png'
import { Link, useLocation } from 'react-router-dom';
import CreatePlaylistModal from '../modals/CreatePlaylistModal';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_PLAYLIST = gql `
    query playlist($playlistID: String) {
        playlist(id: $playlistID) {
            _id
            title
        }
    }
`

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }
    state = {
        show: false,
    }

    handleShow = () => {
        this.setState({ show: true });
        console.log("sidebar modal done");
    }

    handleClose = () => {
        this.setState({ show: false });
        console.log("dosne");
    }

    render() {
        let playlist;
        let loggedIn = this.props.user != null;
        return (
            <nav className='overflow-visible sticky-top ' style={{height: 605, left:0}}>
                <div className=" p-0 text-center border border-white border-left-0 border-top-0 border-bottom-0" style={{width: 200, height:1100}}>
                    <Link to='/app/community'>
                        <img src={logo} height={85} alt='' />
                    </Link>
                    <form action='/sidebar' method='post'>=
                        <input name='searchText' className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search' />
                    </form>
                    <div className='my-1 pt-1 text-center w-100 display-block' style={{background:'#3d8af7', height: 115}}>
                        <Link to='/app/home'>
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0 '>Home</button>
                        </Link>
                        {this.props.user?<Link to={`/app/profile/${this.props.user._id}`}>
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Your Library</button>
                        </Link>: null }
                        <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'
                            onClick={this.handleShow}>Create Playlist</button>
                    </div>
        
                        <div className='h4 text-primary'>My Playlists</div>
                        {this.props.user != null ? this.props.user.ownedPlaylistsID.map((playlistID, index) => (
                            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: playlistID}} fetchPolicy='network-only'>
                                {({ loading, error, data }) => {
                                    if (loading) return 'Loading...';
                                    if (error) return `Error! ${error.message}`;
                                    else playlist = (data.playlist) ? data.playlist : [];
                                    return(
                                        <div key={index} className='text-white text-left pl-3 mb-1'
                                                style={{cursor: 'pointer'}}>
                                            <Link className='text-white pl-2' to={`/app/playlist/${playlist._id}`}>{playlist.title}</Link>
                                        </div>
                                    )
                                }}
                            </Query>
                        )) : <div></div> }
                        {this.props.user != null ? this.props.user.collaborativePlaylistsID.map((playlistID, index) => (
                            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: playlistID}} fetchPolicy='network-only'>
                                {({ loading, error, data }) => {
                                    if (loading) return 'Loading...';
                                    if (error) return `Error! ${error.message}`;
                                    else playlist = (data.playlist) ? data.playlist : [];
                                    return(
                                        <div key={index} className='text-white text-left pl-3 mb-1'
                                                style={{cursor: 'pointer'}}>
                                            <Link className='text-white pl-2' to={`/app/playlist/${playlist._id}`}>{playlist.title}</Link>
                                        </div>
                                    )
                                }}
                            </Query>
                        )) : <div></div> }

                        {loggedIn ?    
                        <form action='/logout' method="post">
                            <button  action="submit" className='btn btn-primary' style={{position:''}}>Logout</button>
                        </form>
                        : 
                        <form action='/auth/google'>
                            <button action="submit" className='btn btn-primary'>Login</button>
                        </form>
                        }

                </div>
               
               { (this.props.user != null) ? 
                <CreatePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}
                    user={this.props.user} history={this.props.history} />
                : <div/>
                }
                    
            </nav>
        )

    }
}

export default Sidebar;
export {GET_PLAYLIST};