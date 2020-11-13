import React from 'react'
import logo from '../../icons/marvins.png'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom';
import CreatePlaylistModal from '../modals/CreatePlaylistModal';
import { Query, Mutation } from 'react-apollo'

const GET_USER = gql`
    query user($userId: String) {
        user(id: $userId) {
            _id
            email
            password
            username
            userPoints
            collaborativePlaylists {
                _id
                genre
                numPlays
                numTracks
                playlistPoints
                privacyType
                songs {
                    _id
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            ownedPlaylists {
                _id
                genre
                numPlays
                numTracks
                playlistPoints
                privacyType
                songs {
                    _id
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            followedPlaylists {
                _id
                genre
                numPlays
                numTracks
                playlistPoints
                privacyType
                songs {
                    _id
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            recentlyPlayed {
                playlistId
                type
            }
            mostPlayed {
                playlistId
                type
            }
            votedPlaylists {
                playlistID
                votes
            }
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser (
        $id: String!
        $collaborativePlaylists: [PlaylistInput]!
        $followedPlaylists: [PlaylistInput]!
        $ownedPlaylists: [PlaylistInput]!
        $recentlyPlayed: [PlayedInput]!
        $mostPlayed: [PlayedInput]!
        $userPoints: Int!
        $votedPlaylists: [VotedPlaylistInput]!
    ) {
        updateUser (
            id: $id
            collaborativePlaylists: $collaborativePlaylists
            followedPlaylists: $followedPlaylists
            ownedPlaylists: $ownedPlaylists
            recentlyPlayed: $recentlyPlayed
            mostPlayed: $mostPlayed
            userPoints: $userPoints
            votedPlaylists: $votedPlaylists
        ) {
            collaborativePlaylists {
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            followedPlaylists {
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            ownedPlaylists {
                _id
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            recentlyPlayed {
                playlistId
                type
            }
            mostPlayed {
                playlistId
                type
            }
            votedPlaylists {
                playlistID
                votes
            }
        }
    }
`;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }
    state = {
        show: false,
        playlists: this.props.ownedPlaylists,
        username: this.props.username,
        playlistName: "",
    }
    
    createPlaylist = (e) => {
        let newOwnedPlaylists = this.props.state;
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
            <Mutation mutation={UPDATE_USER} key={this.props.ownedPlaylists._id}>
                {(updateUser, { loading, error }) => (
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
                                {this.props.ownedPlaylists.map((playlist, index) => (
                                    <div key={index} className='text-white text-left pl-3 mb-1'
                                            style={{cursor: 'pointer'}}>
                                        <Link to={`/${playlist._id}`}>{playlist.title}</Link>
                                    </div>
                                ))}
                                <form action='/logout' method="post">
                                <button action="submit">Logout</button>
                                </form>
                        </div>
                        <CreatePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}
                            callback={updateUser} user={this.props}/>
                    </div>
                )}
            </Mutation>
        )

    }
}

export default Sidebar