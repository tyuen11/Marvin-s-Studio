import React from 'react'
import AlbumLink from './AlbumLink';

class AlbumLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Links");
    }

    render() {

        const albumViewStyle = {
            display: "inline-block",
            position: 'relative',
            width: '100%',
            textAlign: 'left'
        }

        return (
            <div className="AlbumLinks" style={albumViewStyle}>
                {this.props.albums.map((album) =>(
                    <AlbumLink {...album}/>
                ))}
            </div>
        )
    }
}

export default AlbumLinks