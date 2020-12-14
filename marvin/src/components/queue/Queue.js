import React, { Component } from 'react'
import QueueSong from './QueueSong'


class Queue extends Component {

    render() {
        let index = this.props.shuffle?this.props.shuffled_index:this.props.index;
        let songs = this.props.shuffle?this.props.shuffled:this.props.songs;
        let queuedSongs = [];
        for (let x = 0; x < songs.length; x++) {
            if (x != index && songs[x].queued)
                queuedSongs.push(songs[x]);
        }
        //let queuedSongs = songs.filter(song => song.queued);
        let nextSongs = songs.filter(song => !song.queued);
        nextSongs.splice(0, index+1);
        console.log("queued", queuedSongs);
        console.log(songs);     

        return (
            <div className="container" style={{backgroundColor:"#ced8e3", position: "fixed", width: "20%", height:"50%", bottom: "100px", right: "100px", borderRadius:10, zIndex:"2", overflowY:'auto'}}>
                <div id="header" className="text-dark row">
                    <button className="col-2" style={{width:50, padding:0, borderRadius:5, position: 'fixed', zIndex:100, right: 100}} onClick={this.props.handleCloseQueue}>close</button>
                </div>
                <div id="queue" className="" style={{overflowX:'hidden'}}>
                   {songs.length !== 0?
                    <div id="queueNowPlaying" className="text-dark" style ={{border: "solid", borderColor: "#a1a1a1",  borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" ,  borderLeftWidth:"0px", }}>
                        <h4 style={{fontSize:20, paddingTop: 10}}>Now Playing</h4>
                        <QueueSong song={songs[index]} />
                    </div>
                    : null
                    }
                    {queuedSongs.length !== 0?
                    <div id="queueQueued" className="text-dark" style={{overflow:''}}>
                        <h4  style={{fontSize:20}}>Queued songs</h4>
                        {queuedSongs.map((song, index) => (
                            <div>
                                <QueueSong song={song} key={index} />
                            </div>
                        ))}
                    </div>
                    : null}
                    {nextSongs.length !== 0?
                    <div id="queueSongs" className="text-light">
                        <h4>Next Up</h4>
                        {nextSongs.map((song, index) => (
                            <div>
                                <QueueSong song={song} key={index} />
                            </div>
                        ))}
                    </div>
                    : null}
                </div>
            </div>
        )
    }
}

export default Queue;
