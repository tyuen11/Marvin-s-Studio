import React from 'react'
import AlbumLinks from './AlbumLinks';

class ArtistScreen extends React.Component {
    state = {
        artist: null,
        pp: null,
        viewArtist: true
    }
    
    componentDidMount = () => {
        fetch('http://localhost:5000/getArtist')
            .then(res => res.json())
            .then(res => this.setState({ artist: res.artist, pp: res.pp }))
            .catch(err => {
                console.log(err)
            })
        console.log(this.state.user)
    }

    changeCurrView = (val) => {
        this.setState({ viewArtist: val })
    }

    render () {
        if (this.state.artist == undefined)
            return <div>Loading...</div>
        let artist = this.state.artist;
        let albums = artist.products.albums.content;
        let singles = artist.products.singles.content;
        let albStyle = (this.state.viewArtist) ? "underline #2C4871" : "underline transparent"
        let singStyle = (this.state.viewArtist) ? "underline transparent" : "underline #2C4871"
        return (
            <div className='d-flex h-100' style={{width: '900px'}}>
                <div className='pl-5 pt-4 w-100'>
                    <div className='display-4 text-white border border-white border-left-0 border-right-0 border-top-0 mb-3'>
                        <div className="">
                            <img className='rounded-circle mb-5 mr-5' src={this.state.pp}/>
                            {artist.name}
                        </div>
                        <div className='row justify-content-left mb-3'>
                            <div className='h3 ml-3 mr-5' onClick={() => this.changeCurrView(true)}
                                style={{textDecoration: albStyle, cursor: "pointer"}}>Albums</div>
                            <div className='h3' onClick={() => this.changeCurrView(false)}
                                style={{textDecoration: singStyle, cursor: "pointer"}}>Singles</div>
                        </div>
                    </div>
                    <AlbumLinks albums={this.state.viewArtist ? albums : singles}/>
                </div>
            </div>
        )
    }
}

export default ArtistScreen