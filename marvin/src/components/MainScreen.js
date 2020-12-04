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

var shuffle = require('knuth-shuffle').knuthShuffle;


const GET_USER = gql`
    query user($userId: String) {
        user(id: $userId) {
            _id
            email
            password
            username
            userPoints
            collaborativePlaylistsID
            followedPlaylistsID
            ownedPlaylistsID
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
        songs: [],
        index: 0,
        playing: false,
        shuffle: false,
        shuffled: [],
        shuffled_index: 0,
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

    goToPlaylist = (playlist, index) => {
        this.setState({ currPlaylist: playlist, playlistIndex: index })
    }

    createShuffleSongs = () => {
        let songs = this.state.songs;
        let start_song = songs[this.state.index];
        songs.splice(start_song, 1);
        let shuffled = shuffle(songs.slice(0));
        shuffled.unshift(start_song);
        // Fix this.state.songs since it was change from songs.splice (shallow copy manipulation)
        songs.splice(this.state.index, 0, start_song);
        this.setState({shuffle: true, shuffled: shuffled, shuffled_index: 0});
    }

    handleToggleShuffle = () => {
        if (this.state.shuffle == false) {;
           this.createShuffleSongs();
        }
        else {
            this.setState({shuffle: false});
        }
    }

    handleSongChange = (song) => {
        console.log("changing song to ", song.name);
        // Get all the queued songs
        let songs = [{song: song, queued: false}], queued = this.getQueuedSongs();
        // First add the song to play then all the queued songs
        if (queued !== undefined)
            songs = songs.concat(queued);
        this.setState({songs: songs}, () => {
            if (this.state.shuffle == true) {
                this.createShuffleSongs();
            }
        });
    }
    
    handleQueueSong = (song) => {
        let songs = this.state.songs, queue = this.getQueuedSongs();
        let queueLength = queue.length + 1; // Get the index that the queued song will be in (end of queue)
        songs.splice(this.state.index + queueLength, 0, {song: song, queued: true});
        this.setState({songs: songs});
        console.log("queueing song");
    }

    handlePlayPlaylist = (songs) => {
        let playlist = [], queued = this.getQueuedSongs();
        for (var x = 0; x < songs.length; x++) {
            playlist.push({song: songs[x], queued: false});
            if (x == 0 && queued !== undefined) 
                playlist = playlist.concat(queued);
            // vs
            // this.handleSongChange(songs[x])
        }
        this.setState({songs: playlist});
    }

    nextShuffledIndex(index) {
        let song = this.state.shuffled[index];
        let song_index_songs = this.state.songs.findIndex(s => s === song)
        this.setState({shuffled_index: index, index: song_index_songs });
    }

    handleNextSong = () => {
        // WHAT IF WE REACHED THE END OF THE SONGS???
        let shuffle = this.state.shuffle;
        let index = shuffle?this.state.shuffled_index:this.state.index;
        let length = shuffle?this.state.shuffled.length:this.state.songs.length;
        index+=1;
        if (index == length) { 
            if (this.state.shuffle) {
                this.nextShuffledIndex(0);
            }
            else{
                this.setState({index: 0});
            }
            return 0;
        }
        else {    
            // If shuffle is toggled, incr the shuffle_index and set index to curr song index in songs
            if (this.state.shuffle) {
                this.nextShuffledIndex(index);
            }
            else{
                this.setState({index: index});
            }
            return 1;
        }
    }

    handlePrevSong = (played) => {
         // WHAT IF WE AT THE START OF THE SONGS???
        console.log(played);
        let index = this.state.index;
        if (played > 0.03 || index == 0){
            this.setState({index: index});
            return 0;
        }
        else {    
            this.setState({index: index-1});
            return 1;
        }
    }

    getQueuedSongs() {
        let songs = this.state.songs, queue = [];
        console.log("queue:", songs);
        for (let x = 0; x < songs.length; x++){ 
            console.log(songs[x], songs[x].queued);
            if (songs[x].queued == true) 
                queue.push(songs[x]);
        }
        return queue;
    }

    
    render() {
        let user, playing = this.state.playing, songs = this.state.songs, index = this.state.index, 
            shuffled = this.state.shuffled, shuffle = this.state.shuffle,  shuffled_index = this.state.shuffled_index;
        console.log("songs is", songs);
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
                                        <Route path="/app/playlist/:id" render={(props) => (<PlaylistScreen {...props} user={user}
                                            handlePlaylist={this.handlePlayPlaylist} handleSongChange={this.handleSongChange} 
                                            handleQueueSong={this.handleQueueSong} handlePlayPlaylist={this.handlePlayPlaylist} 
                                            />)}
                                        />
                                        <Route path="/app/album">
                                            <AlbumScreen user={user} history={this.props.history}
                                                handlePlaylist={this.handlePlayPlaylist} handleSongChange={this.handleSongChange} 
                                                handleQueueSong={this.handleQueueSong} handlePlayPlaylist={this.handlePlayPlaylist} />
                                        </Route>
                                        <Route  path="/app/artist">
                                            <ArtistScreen user={user} history={this.props.history}/>
                                        </Route>
                                        <Route path="/app/search">
                                            <SearchScreen />
                                        </Route>
                                        <Route path="/app/profile" render={(props) => 
                                            user != null ? <ProfileScreen {...props} user={user}/> : <div/>}>
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
                                <Player songs={songs} playing={playing} index={index} shuffled={shuffle} shuffle={shuffle} shuffled_index={shuffled_index}
                                    handleNextSong={this.handleNextSong} handlePrevSong={this.handlePrevSong} handleToggleShuffle={this.handleToggleShuffle}/>
                            </div>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default MainScreen;