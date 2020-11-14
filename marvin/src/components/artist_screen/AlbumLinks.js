import React from 'react'
import AlbumLink from './AlbumLink';

class AlbumLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Links");
    }

    render() {
        return (
            <div className='row position-absolute text-wrap w-100' style={{paddingRight: '20%', paddingLeft: 20}}>
                {this.props.albums.map((album) =>(
                    <AlbumLink album={album}/>
                ))}
            </div>
        )
    }
}

export default AlbumLinks