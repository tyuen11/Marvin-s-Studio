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
        return (
            <div className='col mr-5 text-white p-0' style={{cursor: 'pointer', width: 120, height: 120}}
                onClick={this.goToAlbum}>
                <img className='border rounded border-white w-100 h-100' src={this.props.image}></img>
                <div className='text-center'>{this.props.title}</div>
            </div>
        )
    }
}

export default AlbumLink