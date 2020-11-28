import React, { Component } from 'react';
import PlaylistScreen from './playlist_screen/PlaylistScreen';
import AlbumScreen from './album_screen/AlbumScreen';
import { Switch, Route, Link} from 'react-router';
import Sidebar from './sidebar/Sidebar.js';
import PlaylistData from '../PlaylistData.json'
import ArtistScreen from './artist_screen/ArtistScreen';

import Player from './player/Player.js'
import ProfileScreen from './profile_screen/ProfileScreen';
import SearchScreen from './search_screen/SearchScreen';
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import HomeScreen from './HomeScreen';
import CommunityScreen from './CommunityScreen';

const GET_USER = gql`
    query user($userId: String) {
        user(id: $userId) {
            _id
            email
            password
            username
            userPoints
            collaborativePlaylistsID
            collaborativePlaylists {
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
                    songID
                    albumName
                    artistName
                }
                title
            } 
            followedPlaylistsID
            followedPlaylists {
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
                    songID
                    genre
                    title
                    albumName
                    artistName
                }
                title
            }
            ownedPlaylistsID
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
                    songID
                    genre
                    title
                    albumName
                    artistName
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

class MainScreen extends Component {
    state = {
        queue: [{song: undefined, queued: false}],
        playing: false
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/ud')
          .then(res => res.json())
          .then(res => this.setState({user:res.user}))
          .catch(err => {
              console.log(err);
          });  
        console.log(this.state.user);

        this.setState({currSong: ""});
    }

    goToPlaylist = (playlist, index) => {
        this.setState({ currPlaylist: playlist, playlistIndex: index })
    }

    handleSongChange = (song) => {
        console.log("changing song to ", song.name);
        var queue = {song: song, queued: false};
        console.log("queue:", queue);
        this.setState({currSong: song, playing: true});

    }
    handlePlayPlaylist = (songs) => {
        var queue;
        for (var x = 0; x < songs.length; x++) {
            queue.append({song: songs[x], queued: false});
        }
        this.setState({queue: queue});
    }
    
    render() {
        let user, currSong = this.state.currSong, playing = this.state.playing;
        let queue = this.state.queue;
        console.log("queue is", queue);
        console.log("main screen says", this.state.playing);


        return (
            <Query pollInterval={500} query={GET_USER} variables={{ userId: this.state.user}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    else user = data.user;
                    return (
                        <div>
                            <div className="row flex-nowrap mr-0">
                                <Sidebar user={user} history={this.props.history} playlistCallback={this.goToPlaylist}/>
                                <div className='col overflow-auto' style={{paddingBottom: 100}}>
                                    <Switch>
                                        <Route path="/app/playlist/:id" render={(props) => (<PlaylistScreen {...props} user={user}/>)}
                                        />
                                        <Route  path="/app/album">
                                            <AlbumScreen user={user} history={this.props.history}
                                                handlePlaylist={this.handlePlayPlaylist} handleSongChange={this.handleSongChange}/>
                                        </Route>
                                        <Route  path="/app/artist">
                                            <ArtistScreen user={user} history={this.props.history}/>
                                        </Route>
                                        <Route path="/app/search">
                                            <SearchScreen />
                                        </Route>
                                        <Route path="/app/profile">
                                            <ProfileScreen user={user} playlistCallback={this.goToPlaylist} history={this.props.history} {...PlaylistData}/>
                                        </Route>
                                        <Route path="/app/home">
                                            <HomeScreen/>
                                        </Route>
                                        <Route path="/app/community">
                                            <CommunityScreen/>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>
                            <div className="row fixed-bottom">
                                <Player queue={queue} currSong={currSong} playing={playing}/>
                            </div>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default MainScreen;