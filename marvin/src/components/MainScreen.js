import React, { Component } from 'react';
import PlaylistScreen from './playlist_screen/PlaylistScreen';
import AlbumScreen from './AlbumScreen';
import { Switch, Route} from 'react-router';
import Sidebar from './sidebar/Sidebar.js';
import PlaylistData from '../PlaylistData.json'
import ArtistScreen from './artist_screen/ArtistScreen';
import Player from './Player'

import ProfileScreen from './profile_screen/ProfileScreen';
import SearchScreen from './search_screen/SearchScreen';
import { Query } from 'react-apollo';
import gql from 'graphql-tag'

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

class MainScreen extends Component {
    state = {
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/ud')
          .then(res => res.json())
          .then(res => this.setState({user:res.user}))
          .catch(err => {
              console.log(err);
          });  
        console.log(this.state.user);
    }

    goToPlaylist = (e) => {
        this.setState({ currPlaylist: e })
    }

    render() {
        let user;
        return (
            <Query pollInterval={500} query={GET_USER} variables={{ userId: this.state.user}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    else user = data.user;
                    console.log(user);
                    return (
                        <div>
                            <div className="row">
                                <Sidebar user={user} history={this.props.history}/>
                                <div className='col'>
                                    <Switch>
                                        <Route exact path="/">
                                            <PlaylistScreen history={this.props.history}/>                        
                                        </Route>
                                        <Route  path="/album">
                                            <AlbumScreen />
                                        </Route>
                                        <Route path="/artist">
                                            <ArtistScreen {...PlaylistData}/>
                                        </Route>
                                        <Route path="/user/search">
                                            <SearchScreen />
                                        </Route>
                                        <Route path="/profile">
                                            <ProfileScreen {...PlaylistData}/>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>
                            <div className="row">
                                <Player/>
                            </div>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default MainScreen;