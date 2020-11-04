import React from 'react'
import Player from '../Player'
import Sidebar from '../sidebar/Sidebar'
import AlbumLinks from './AlbumLinks';

class ArtistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props");
    }
    render () {
        return (
            <div className='d-flex h-100 position-fixed p-0' style={{width: 'calc(100%-200px)'}}>
                <div className='display-inline pl-5 pt-4 w-100'>
                    <div className='display-4 text-white border border-white border-left-0 border-right-0 border-top-0 mb-3'>
                        <img className='rounded-circle mr-3 mb-4' src={this.props.artist.image} height='80' width='80'></img>
                        {this.props.artist.name}
                        <div className='h4'>Albums</div>
                    </div>
                    <AlbumLinks {...this.props.artist}/>
                </div>
            </div>
        )
    }
}

export default ArtistScreen