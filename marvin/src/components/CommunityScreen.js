import React from 'react'

class CommunityScreen extends React.Component {

    state = {
        viewComm: true
    }

    changeCurrView = (val) => {
        this.setState({ viewComm: val });
    }

    render() {
        let commStyle = (this.state.viewComm) ? "underline #2C4871" : 'underline transparent';
        let pubStyle = (this.state.viewComm) ? "underline transparent" : "underline #2C4871";
        return (
            <div className='container p-2'>
                <div className='h1 text-white my-4 ml-2'>Community Playlists</div>
                <div className='row mb-3 pl-3'>
                    <div className='h4 col-3 text-white' 
                        style={{ textDecoration: commStyle, cursor: "pointer"}} 
                        onClick={() => this.changeCurrView(true)}
                    >
                        Community Curated
                    </div>
                    <div className='h4 col-4 text-white'
                        style={{ textDecoration: pubStyle, cursor: "pointer"}}
                        onClick={() => this.changeCurrView(false)}
                    >
                        Public
                    </div>
                </div>
                <div className='divider'></div>
            </div>
        )
    }
}

export default CommunityScreen