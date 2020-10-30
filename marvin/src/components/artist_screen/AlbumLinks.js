import React from 'react'
import AlbumLink from './AlbumLink';

class AlbumLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Links");
    }

    render() {
        return (
            <div className='row'>
                {this.props.albums.map((album) =>(
                    <AlbumLink {...album}/>
                ))}
            </div>
        )
    }
}

export default AlbumLinks