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
        user: null
    }

    componentDidMount = () => {
        fetch('http://localhost:5000/ud')
        .then(res => res.json())
        .then(res => this.setState({user:res}))
        .catch(err => {
            console.log(err);
        });  
      console.log(this.state.user);
    }

    render() {
        return (
            <Query pollInterval={500} query={GET_USER} variables={{ userId: "5faafca08d8dd72b02541ef4"}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    return (
                        <div>
                            <div className="row">
                                <Sidebar state={this.state}/>
                                <div className='col'>
                                    <Switch>
                                        <Route path="/">
                                            <PlaylistScreen {...PlaylistData.profile.playlists[0]} />                            
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