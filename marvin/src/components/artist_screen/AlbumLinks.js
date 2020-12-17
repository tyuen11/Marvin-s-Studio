import React from 'react'
import AlbumLink from './AlbumLink';

class AlbumLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Links");
    }

    render() {
        return (
            <div className='row text-wrap w-100 mt-3' style={{paddingRight: '20%', paddingLeft: 20}}>
                {this.props.albums.map((album, index) =>(
                    <AlbumLink album={album} index={index}/>
                ))}
            </div>
        )
    }
}

export default AlbumLinks