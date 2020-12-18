import React, { Component } from 'react'

const musicGenres = require('music-genres')

class admin extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-3 m-4">
                    <h4 className="row-1 mb-3 text-light">Add sotd to gotw playlist</h4>
                    <form action='/newsotds' method='post'>
                        <button className="row-1 btn btn-primary" type="submit" >Add sotd and get new sotds</button>
                    </form>
                </div>
                <div className="col-8 m-4">
                    <h4 className="row-1 mb-3 text-light">Add current gotw playlist to community curated list and set new gotw playlist</h4>
                    <form action='/newgotw' method='post'>
                        <button className="row-1 btn btn-primary" type="submit" name="newGenre" value={musicGenres.getRandomSubgenre()}>Add then change gotw</button>
                    </form>
                </div>
                <div className='col-8 m-4'>
                    <h4 className='row-1 mb-3 text-light'>Reset user's SOTD votes</h4>
                    <form action='/sotdVoteReset' method='post'>
                        <button className='row-1 btn btn-primary' type='submit'>Reset SOTD Votes</button>
                    </form>
                </div>

            </div>
        )
    }
}

export default admin