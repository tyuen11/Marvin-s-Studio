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
            <div>
                <div className="row">
                    <Sidebar className="col-2" {...PlaylistData}/>
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
    }
}

export default MainScreen;