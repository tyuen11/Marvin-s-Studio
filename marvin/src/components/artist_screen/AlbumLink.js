import React from 'react'

class AlbumLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Album Link"+ props.title);
    }

    goToAlbum = () => {
        console.log("Go to Album" + this.props.title)
    }

    render() {
        const albumImgStyle = {
            borderRadius: 10,
            borderStyle: 'solid',
            borderThickness: 1,
            borderColor: 'white',
            height: 90
        }

        return (
            <div className='col s4' style={{display: 'inline-block', color: 'white', width: 150, textAlign: 'center', cursor: 'pointer'}}
                onClick={this.goToAlbum}>
                <img src={this.props.image} style={albumImgStyle}></img>
                <div>{this.props.title}</div>
            </div>
        )
    }
}

export default AlbumLink