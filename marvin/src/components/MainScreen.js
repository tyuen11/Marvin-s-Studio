import React, { Component } from 'react';
import PlaylistScreen from './playlist_screen/PlaylistScreen';
import AlbumScreen from './AlbumScreen';
import { Switch, Route} from 'react-router';
import Sidebar from './sidebar/Sidebar.js';
import PlaylistData from '../PlaylistData.json'
import ArtistScreen from './artist_screen/ArtistScreen';
import Player from './Player'


class MainScreen extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <Sidebar {...PlaylistData}/>
                    <div>
                        <Switch>
                            <Route path="/user/playlist">
                                <PlaylistScreen />
                            </Route>
                            <Route path="/user/album">
                                <AlbumScreen />
                            </Route>
                            <Route path="/user/artist">
                                <ArtistScreen {...PlaylistData}/>
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