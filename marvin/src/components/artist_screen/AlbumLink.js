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
        let album = this.props.album
        return (
            // <Link className='col-3 pb-5 mb-4 text-white ' to={`/album/${this.props.album.browseId}`}>
            //     <div style={{cursor: 'pointer', width: 150, height: 150}}
            //         onClick={this.goToAlbum}>
            //         <img className="rounded" src={this.props.album.thumbnails[0].url} height="100%" width="100%"/>
            //         <div className='text-center'>{this.props.album.name}</div>
            //     </div>
            // </Link>
            <div key={this.props.index} className='col-3 pb-5 mb-4 text-white ' style={{ cursor: 'pointer' }}>
                <form action='/albreq' method='post'>
                    <div style={{cursor: 'pointer', width: 150, height: 150}}>
                        <button className="border-0 text-playlist" style={{backgroundColor:"#232323"}}
                            href={`/album/${album.browseId}`} type="submit" name="album" value={album.browseId} >
                            <img className="rounded" src={album.thumbnails[0].url} alt="https://dalelyles.com/musicmp3s/no_cover.jpg" height="100%" width="100%"/>
                            <div className='text-center'>{this.props.album.name}</div>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AlbumLink