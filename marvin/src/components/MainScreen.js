import React, { Component } from 'react';
import PlaylistScreen from './playlist_screen/PlaylistScreen';
import AlbumScreen from './album_screen/AlbumScreen';
import { Switch, Route, Link} from 'react-router';
import Sidebar from './sidebar/Sidebar.js';
import PlaylistData from '../PlaylistData.json'
import ArtistScreen from './artist_screen/ArtistScreen';

import Player from './player/Player.js'
import Queue from './queue/Queue.js'
import ProfileScreen from './profile_screen/ProfileScreen';
import SearchScreen from './search_screen/SearchScreen';
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import HomeScreen from './home_screen/HomeScreen';
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
            recentlyPlayed 
            mostPlayed {
                playlistId
                count
            }
            votedPlaylists {
                playlistID
                votes
            }
            votedSOTD
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
        showQueue: false
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

    handleShowQueue = () => {
        this.setState({ showQueue: true });
    }

    handleCloseQueue = () => {
        this.setState({ showQueue: false});
    }

    goToPlaylist = (playlist, index) => {
        this.setState({ currPlaylist: playlist, playlistIndex: index })
    }

    createShuffleSongs = () => { // NEED TO SHUFFLE ONLY NONQUEUED SONGS!!!
        let songs = this.state.songs, queued = this.getQueuedSongs();
        if (songs.length === queued.length) {
            this.setState({shuffle: true, songs: songs, shuffled: songs, shuffled_index: 0});
        }
        else {
            let start_song = songs[this.state.index];
            songs.splice(start_song,  queued.length + 1);
            let shuffled = shuffle(songs.slice(0));
            shuffled = queued.concat(shuffled);
            shuffled.unshift(start_song);
            // Fix this.state.songs since it was change from songs.splice (shallow copy manipulation)
            songs = queued.concat(songs);
            songs.splice(this.state.index, 0, start_song);
            console.log(songs);
            this.setState({shuffle: true, songs: songs, shuffled: shuffled, shuffled_index: 0});
        }
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
        this.setState({songs: songs, index: 0}, () => {
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
        }
        this.setState({songs: playlist});
    }

    nextShuffledIndex(index) {
        let song = this.state.shuffled[index];
        let song_index_songs = this.state.songs.findIndex(s => JSON.stringify(s.song) === JSON.stringify(song.song) && s.queued === song.queued);
        this.setState({shuffled_index: index, index: song_index_songs });
    }

    handleNextSong = () => {
        // WHAT IF WE REACHED THE END OF THE SONGS???
        let shuffle = this.state.shuffle;
        let index = shuffle?this.state.shuffled_index:this.state.index;
        let length = shuffle?this.state.shuffled.length:this.state.songs.length;
        let songs = shuffle?this.state.shuffled:this.state.songs;
        let song = this.state.shuffle?this.state.shuffled[index]:this.state.songs[index];

        // this.removeQueueSong(index);
        if (!song.queued) // We the song that just played is not a queued song, just incr the index of that song to go to the next song
            index+=1;

        if (song.queued) { // If the song just played is a queued song, remove it from our songs list
            if (shuffle) { // If the player is playing the shuffled array, we remove the queued song from the shuffled songs list but need to remove it from the nonshuffled songs list
                let song_index_songs = this.state.songs.findIndex(s => JSON.stringify(s.song) === JSON.stringify(song.song) && s.queued === song.queued);
                this.state.songs.splice(song_index_songs, 1);
            }
            songs.splice(index, 1);
            length = songs.length; // Update the length of the songs array since a queued song was removed
        }
        if (index == length) { // If we have reached the end of our songs list, go back to the beginning of the lsit
            if (this.state.shuffle) 
                // If we are going back to the first song of the shuffled songs list, we must
                // update what index that song is in the regular songs list so that when 
                // a user clicks unshuffle the order of songs being played continues from an inorder fashion 
                this.nextShuffledIndex(0);
            else
                this.setState({index: 0});
            return 0;
        }
        else {
            // If shuffle is toggled, incr the shuffle_index and set index to curr song index in songs
            if (this.state.shuffle) 
                this.nextShuffledIndex(index);
            else
                this.setState({index: index}); 
            return 1;
        }
        console.log(this.state.shuffled, this.state.songs);
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
        let songs = this.state.songs, queue;;
        console.log("queue:", songs);
        queue = songs.filter(song => song.queued);
        return queue;
    }

    
    render() {
        let user, playing = this.state.playing, songs = this.state.songs, index = this.state.index, 
            shuffled = this.state.shuffled, shuffle = this.state.shuffle,  shuffled_index = this.state.shuffled_index;
        // console.log("songs is", songs);
        // console.log("main screen says", this.state.playing);
        // console.log(user);

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
                                <div className='col overflow-hidden' style={{paddingBottom: 100}}>

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
                                        <Route path="/app/artist">
                                            <ArtistScreen user={user} history={this.props.history}/>
                                        </Route>
                                        <Route path="/app/search">
                                            <SearchScreen />
                                        </Route>
                                        <Route path="/app/profile/:id" render={(props) => 
                                            user != null ? <ProfileScreen {...props} user={user}/> : <div/>}>
                                        </Route>
                                        <Route path="/app/home">
                                            <HomeScreen handleSongChange={this.handleSongChange} playing={playing} user={user}/>
                                        </Route>
                                        <Route path="/app/community">
                                            <CommunityScreen/>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>
                            {this.state.showQueue? <Queue songs={songs} index={index} shuffled={shuffled} 
                                shuffle={shuffle} shuffled_index={shuffled_index} handleCloseQueue={this.handleCloseQueue}/>
                                :null }
                            <div className="row fixed-bottom">
                                <Player songs={songs} playing={playing} index={index} shuffled={shuffled} shuffle={shuffle} shuffled_index={shuffled_index}
                                    handleNextSong={this.handleNextSong} handlePrevSong={this.handlePrevSong} handleToggleShuffle={this.handleToggleShuffle}
                                    handleShowQueue={this.handleShowQueue} showQueue={this.state.showQueue} handleCloseQueue={this.handleCloseQueue}/>
                            </div>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default MainScreen;