import React from 'react'
import { Link } from 'react-router-dom'

class HomeScreen extends React.Component {
    render () {
        return (
            <div className='container h-100'>
                <div className='row justify-content-center'>
                    <div id='gotw' className='col-10 mt-5'>
                        <img className='w-100 img-responsive' style={{height: 200, objectFit: 'cover'}} 
                            src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"/>
                        <span className='h4 position-absolute text-black' style={{top: 5, left: 20}}>Genre of the week</span>
                        <span className='display-2 w-100 font-weight-bold text-black text-center position-absolute' style={{top: 30, left:10}}>Rock</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 pt-2 text-center d-block'>
                        <div className='h5 text-white'>Song 1</div>
                        <div className='position-relative'>
                            <img className='rounded' src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png" style={{height: 150, width: 150}}/>
                            <span className='h1 position-absolute' style={{top: 50, left: 150}}>{'\u25b6'} </span>
                        </div>
                        <button className='btn btn-light mt-1'>+</button>
                    </div>
                    <div className='col-4 text-center'>
                        <div className='h5 text-white'>Song 2</div>
                        <div className='position-relative'>
                            <img className='rounded' src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png" style={{height: 150, width: 150}}/>
                            <span className='h1 position-absolute' style={{top: 50, left: 150}}>{'\u25b6'} </span>
                        </div>
                        <button className='btn btn-light mt-1'>+</button>
                    </div>
                    <div className='col-4 text-center'>
                        <div className='h5 text-white'>Song 3</div>
                        <div className='position-relative'>
                            <img className='rounded' src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png" style={{height: 150, width: 150}}/>
                            <span className='h1 position-absolute' style={{top: 50, left: 150}}>{'\u25b6'} </span>
                        </div>
                        <button className='btn btn-light mt-1'>+</button>
                    </div>
                </div>
                <div className='row mt-5'>
                    <div className='h4 ml-3 text-white'>Community Curated</div>
                    <Link to={{
                        pathname:'/app/community',
                        state: {
                            viewComm: true
                        }
                        }} 
                        className='h5 ml-auto text-white'>See More</Link>
                </div>
                <div className='divider'></div>
                <div className='row h4 ml-3 mt-5 text-white'>Public</div>
                <div className='divider'></div>
                <div className='row h4 ml-3 mt-5 text-white'>Most Played</div>
                <div className='divider'></div>
            </div>
        )
    }
}

export default HomeScreen