import React from 'react'
import * as Icon from 'react-bootstrap-icons'

import AlbumSong from './AlbumSong'
import AddSongModal from '../modals/AddSongModal'
import playButton from '../../icons/play-button.png'
import shuffleButton from '../../icons/shuffle.png'
import addToQueueButton from '../../icons/playlist.png'
import addToPlaylistButton from '../../icons/addBlue.png'

class AlbumScreen extends React.Component {
	state = {
		show: false,
		song: null,
		flag: 0
	}

	componentDidMount = () => {
		fetch('http://localhost:5000/getAlbum')
			.then(res => res.json())
			.then(res => this.setState({ album: res.album, albumId: res.albumId }))
			.catch(err => {
				console.log(err);
			});
	}
	componentDidUpdate = () => {
		fetch('http://localhost:5000/getAlbum')
			.then(res => res.json())
			.then(res => this.setState({ album: res.album, albumId: res.albumId }))
			.catch(err => {
				console.log(err);
			});
	}

	handleShow = (song, flag) => {
		console.log(song);
		this.setState({
			show: true,
			song: song,
			flag: flag
		});
		console.log(this.state);
	}

	handleClose = () => {
		this.setState({ show: false });
	}

	handleQueueAlbum = (songs) => {
		let ss = songs;
		let song;
		for (let x = 0; x < ss.length; x++ ) {
			song = this.songAddArt(ss[x]);
			this.props.handleQueueSong(song);
		}
	}

	songAddArt(preSong) {
        let song = JSON.parse(JSON.stringify(preSong));
		song["albumArt"] = song.thumbnails[0].url;
		song["title"] = song.name;
		song["artistName"] = song.artistNames;
    	return song;
	}

	handlePlayPlaylistP = (songs) => {
		let editedSongs = [];
		let song;
		for (let x = 0; x< songs.length; x++) {
			song = this.songAddArt(songs[x]);
			editedSongs.push(song);
		}
		this.props.handlePlayPlaylist(editedSongs);

	}
	
	componentWillUnmount = () => {
		console.log("ALBUMSCREEN TO UNMOUNT");
	}

	render() {
		let user = this.props.user;
		if (this.state.album == undefined)
			return <div>Loading...</div>
		let album = this.state.album, albumId = this.state.albumId;
		let songs = album.tracks;
		console.log(songs)
		return (
			<div id="album" className="album">
				<div className="row border-light" >
					<div id="top" className="col ml-3">
						<div className="row">
							<div id="AlbumInfoAndActions" className="col-8 pb-4">
								<div id="AlbumName" className="row">
									<h1 className="text-light ml-4 mt-5">{album.title}</h1>
								</div>
								<div id="Artist" className="row">
									<h4 className="text-light ml-4"> Album by {album.artist[0].name} </h4>
								</div>
								<div id="actions" className=" ml-3 mt-5">
									<button className='btn btn-outline-primary border-0 bg-transparent'>
										<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-play-circle-fill" onClick={this.handlePlayPlaylistP.bind(this, songs)} viewBox="0 0 16 16">
											<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
											<path fill-rule="evenodd" d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
										</svg>
									</button>

									<Icon.List className='btn btn-outline-primary border-0 bg-transparent' style={{ fontSize: 80 }} onClick={this.handleQueueAlbum.bind(this, songs)}/>


									<Icon.PlusCircle className='btn btn-outline-primary border-0 bg-transparent' style={{ fontSize: 65 }} onClick={() => this.handleShow(null, 1)} />

								</div>
							</div>
							<div id="img" className="col-4 mt-4" >
								<div className="row mt-4 mb-2 text-center">
									<a href="albumPic">
										<input type="image"
											src={album.thumbnails[2] ? album.thumbnails[2].url : "https://dalelyles.com/musicmp3s/no_cover.jpg"}>
										</input>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row ml-5 mt-3 " >
					<div className="col-6"> <h3 style={{ color: "white" }}>Title</h3> </div>
					<div className="col-4"> <h3 style={{ color: "white" }}>Runtime</h3> </div>
					<div className="col-4"></div>
				</div>
				<div className="divider song-divider" />

				<div >
					{songs.map((song, index) => (
						<AlbumSong key={index} style={{ cursor: 'pointer' }}
							handleSongChange={this.props.handleSongChange} handleQueueSong={this.props.handleQueueSong}
							song={song} handleShow={() => this.handleShow(song, 0)} songAddArt={this.songAddArt}/>
					))}

				</div>

				{user !== null ? <AddSongModal user={this.props.user} albumId={albumId} show={this.state.show} song={this.state.song} album={album}
					handleClose={this.handleClose} handleShow={this.handleShow} history={this.props.history}
					flag={this.state.flag} /> : <div />}
			</div>
		)
	}
}

export default AlbumScreen