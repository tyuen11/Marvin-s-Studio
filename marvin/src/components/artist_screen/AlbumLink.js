import React from 'react'
import { Link } from 'react-router-dom';

class AlbumLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Link"+ props.title);
    }

    goToAlbum = () => {
        console.log("Go to Album" + this.props.title)
    }

    render() {
        return (
            <Link className='col-3 mb-5 text-white p-0' to={`app/album/${this.props.album.browseId}`}>
                <div style={{cursor: 'pointer', width: 150, height: 150}}
                    onClick={this.goToAlbum}>
                    <img className='border rounded border-white' src={this.props.album.thumbnails[0].url} height="100%" width="100%"></img>
                    <div className='text-center'>{this.props.album.name}</div>
                </div>
            </Link>
        )
    }
}

export default AlbumLink