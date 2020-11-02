import React, { Component } from 'react';
import PlaylistScreen from './playlist_screen/PlaylistScreen';
import AlbumScreen from './AlbumScreen';
import { Switch, Route} from 'react-router';
import Sidebar from './sidebar/Sidebar.js'


class MainScreen extends Component {
    render() {
        return (
            <div className="row">
                <Sidebar className="col col-2"/>
                <div>
                 <Switch>
                    <Route path="/user/playlist">
                        <PlaylistScreen />
                    </Route>
                    <Route path="/user/album">
                        <AlbumScreen />
                    </Route>
                    <Route path="/user/album">
                        <AlbumScreen />
                    </Route>
                </Switch>
                </div>
                
            </div>
        )
    }
}

export default MainScreen;