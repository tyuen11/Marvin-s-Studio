import React from 'react'
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
			.then(res => this.setState({ album: res }))
			.catch(err => {
				console.log(err);
			});
		console.log(this.state.user);

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

	render() {
		let user = this.props.user;
		if (this.state.album == undefined)
			return <div>Loading...</div>
		let album = this.state.album;
		let songs = album.tracks;

		return (
			<div id="album" className="album">
				<div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
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
                                        <img src={playButton} style={{ height: 40 }} onClick={this.props.handlePlayPlaylist.bind(this, songs)}/>
                                    </button>

									<button className='btn btn-outline-primary border-0 bg-transparent'>
                                        <img src={shuffleButton} style={{ height: 40 }}/>
                                    </button>
			
									<button className='btn btn-outline-primary border-0 bg-transparent'>
                                        <img src={addToQueueButton} style={{ height: 40 }}/>
                                    </button>
									
									<button className='btn btn-outline-primary border-0 bg-transparent' onClick={this.handleShow}>
                                        <img src={addToPlaylistButton} style={{ height: 40 }}/>
                                    </button>
								</div>
							</div>
							<div id="img" className="col-4 mt-4" >
								<div className="row mt-4 mb-2 text-center">
									<a href="albumPic">
										<input type="image"
											src={album.thumbnails[2].url} alt="https://dalelyles.com/musicmp3s/no_cover.jpg">
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
				<div>
					<div className="divider song-divider" />
					{songs.map((song, index) => (
						<AlbumSong key={index} style={{cursor: 'pointer'}} 
							handleSongChange={this.props.handleSongChange} handleQueueSong={this.props.handleQueueSong}
							song={song} handleShow={() => this.handleShow(song, 0)}/>
					))}

				</div>

				{user !== null ? <AddSongModal user={this.props.user} show={this.state.show} song={this.state.song} album={album}
					handleClose={this.handleClose} handleShow={this.handleShow} history={this.props.history} 
					flag={this.state.flag} /> : <div/>}
			</div>
		)
	}
}

export default AlbumScreen