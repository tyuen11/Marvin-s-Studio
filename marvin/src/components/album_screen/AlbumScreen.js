import React from 'react'
import AlbumSong from './AlbumSong'
import AddSongModal from '../modals/AddSongModal'

class AlbumScreen extends React.Component {
	state = {
		show: false,
		song: null
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

	handleShow = (song) => {
		console.log(song);
		this.setState({
			show: true,
			song: song
		});
		console.log("done");
		console.log(this.state);
	}

	handleClose = () => {
		this.setState({ show: false });
		console.log("dosne");
	}

	render() {
		if (this.state.album == undefined)
			return <div>Loading...</div>
		let album = this.state.album;
		let songs = album.tracks;
		console.log(songs);

		console.log(album);
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
									<a href="playBtn">
										<input type="image" style={{ width: "8%" }}
											src="https://i.imgur.com/N7tVoo7.png">
										</input>
									</a>
									<a href="shuffleBtn" className="ml-3">
										<input type="image" style={{ width: "10%" }}
											src="https://i.imgur.com/T8JZhAk.png">
										</input>
									</a>
									<a id="queueBtn" className="ml-4">
										<input type="image" style={{ width: "12%" }} onClick={this.handleShow}
											src="https://i.imgur.com/sNVHPL0.png">
										</input>
									</a>

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
						<AlbumSong key={index} song={song} handleShow={this.handleShow} />
					))}
				</div>
				<AddSongModal user={this.props.user} show={this.state.show} song={this.state.song} album={album}
					handleClose={this.handleClose} handleShow={this.handleShow} history={this.props.history} />
			</div>
		)
	}
}

export default AlbumScreen