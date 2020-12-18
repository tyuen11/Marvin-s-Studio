import React from 'react'
import logo from '../../icons/marvins.png'
import { Link } from 'react-router-dom';
import CreatePlaylistModal from '../modals/CreatePlaylistModal';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import * as Icon from 'react-bootstrap-icons'
import { Toast } from 'react-bootstrap';

const GET_PLAYLIST = gql`
    query playlist($playlistID: String) {
        playlist(id: $playlistID) {
            _id
            title
        }
    }
`

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }
    state = {
        show: false,
        showDropdown: false,
        showCreateToast: false,
        showLibraryToast: false
    }

    handleShow = () => {
        this.setState({ show: true });
        console.log("sidebar modal done");
    }

    handleClose = () => {
        this.setState({ show: false });
        console.log("dosne");
    }

    toggleDropdown = () => {
        let currDropdown = this.state.showDropdown
        this.setState({ showDropdown: !currDropdown })
    }

    handleShowCreateToast = () => {
        this.setState({ showCreateToast: true })
    }

    handleHideCreateToast = () => {
        this.setState({ showCreateToast: false })
    }

    handleShowLibraryToast = () => {
        this.setState({ showLibraryToast: true })
    }

    handleHideLibraryToast = () => {
        this.setState({ showLibraryToast: false })
    }

    render() {
        let playlist;
        let loggedIn = this.props.user != null;
        return (
            <nav className='sticky-top' style={{ height: "100vh", left: 0, backgroundColor: '#1a1a1a' }}>
                <div className=" p-0 text-center " style={{ width: 200 }}>
                    <Link to='/app/home'>
                        <img src={logo} height={"80vh"} alt='' />
                    </Link>
                    <form action='/sidebar' method='post' onSubmit={() => {
                        this.props.history.push('/app/search');
                    }}>
                        <input name='searchText' className='border border-primary px-1 py-1 my-1  ' type='text' style={{ borderRadius: 50, width: "85%", marginRight: 10, lineHeight: 1 }} placeholder='Search' />
                    </form>
                    <div className='my-1 pt-1 text-center w-100 display-block' style={{ background: '#3d8af7', height: 115 }}>
                        <Link to='/app/home'>
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent btn-sidebar border-0'>
                                <Icon.House className="mb-1 mr-1" /> Home
                            </button>
                        </Link>
                        {this.props.user ? <Link to={`/app/profile/${this.props.user._id}`}>
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent btn-sidebar border-0'>
                                <Icon.Collection className="mb-1 mr-1" />Your Library
                            </button>                        </Link> :
                            <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent btn-sidebar border-0' onClick={this.handleShowLibraryToast}> <Icon.Collection className="mb-1 mr-1" />Your Library</button>
                        }
                        <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent btn-sidebar border-0'
                            onClick={() => {
                                if (loggedIn) this.handleShow()
                                else this.handleShowCreateToast()
                            }}> <Icon.PlusCircle className="mb-1 mr-1" />Create Playlist</button>
                    </div>

                    <div className='text-primary'>My Playlists</div>
                    <div className='sidebar-scroll' style={{ height: "33vh", overflowY: "scroll" }}>
                        {this.props.user != null ? this.props.user.ownedPlaylistsID.map((playlistID, index) => (
                            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: playlistID }} fetchPolicy='network-only'>
                                {({ loading, error, data }) => {
                                    if (loading) return 'Loading...';
                                    if (error) return `Error! ${error.message}`;
                                    else playlist = (data.playlist) ? data.playlist : [];
                                    return (
                                        <div key={index} className='text-left pl-3 mb-1'
                                            style={{ cursor: 'pointer' , overflowX:'hidden'}}>
                                            <Link className='text-link' to={`/app/playlist/${playlist._id}`}>{playlist.title}</Link>
                                        </div>
                                    )
                                }}
                            </Query>
                        )) : <div></div>}
                        {this.props.user != null ? this.props.user.collaborativePlaylistsID.map((playlistID, index) => (
                            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: playlistID }} fetchPolicy='network-only'>
                                {({ loading, error, data }) => {
                                    if (loading) return 'Loading...';
                                    if (error) return `Error! ${error.message}`;
                                    else playlist = (data.playlist) ? data.playlist : [];
                                    return (
                                        <div key={index} className='text-left pl-3 mb-1'
                                            style={{ cursor: 'pointer' }}>
                                            <Link className='text-link' to={`/app/playlist/${playlist._id}`}>{playlist.title}</Link>
                                        </div>
                                    )
                                }}
                            </Query>
                        )) : <div></div>}
                    </div>
                    {loggedIn ?
                        <Dropdown direction='right' isOpen={this.state.showDropdown} toggle={this.toggleDropdown}>
                            <DropdownToggle className='btn bg-transparent border-0'>
                                <div className='text-playlist'>
                                    <Icon.PersonCircle color='white' className='mr-2' />
                                    {this.props.user.username}
                                </div>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => {
                                    fetch('/logout', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'marvinsStudio/json',
                                            'Content-Type': 'marvinsStudio/json'
                                        }
                                    }).then(this.props.history.push('/login'))
                                }}>Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        :
                        <a href="/auth/google">
                            <input type="image" style={{ margin: "0.25rem", paddingBottom: ".75rem" }}
                                src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png">
                            </input>
                        </a>
                    }
                    <div className='text-white'>Marvin's Studio</div>
                </div>

                { (this.props.user != null) ?
                    <CreatePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}
                        user={this.props.user} history={this.props.history} />
                    : <div />
                }
                <Toast show={this.state.showCreateToast} onClose={this.handleHideCreateToast} style={{ top: 10, right: 20, position: 'fixed' }}>
                    <Toast.Header closeButton>Unable To Create Playlist</Toast.Header>
                    <Toast.Body className='bg-white rounded-bottom text-center'>
                        <div>Must log in to create a playlist</div>
                        <form action='/auth/google'>
                            <button action="submit" className='btn btn-secondary mt-2'>Login</button>
                        </form>
                    </Toast.Body>
                </Toast>
                <Toast show={this.state.showLibraryToast} onClose={this.handleHideLibraryToast} style={{ top: 10, right: 20, position: 'fixed' }}>
                    <Toast.Header closeButton>Unable To View Library</Toast.Header>
                    <Toast.Body className='bg-white rounded-bottom text-center'>
                        <div>Must log in to view your library</div>
                        <form action='/auth/google'>
                            <button action="submit" className='btn btn-secondary mt-2'>Login</button>
                        </form>
                    </Toast.Body>
                </Toast>
            </nav>
        )

    }
}

export default Sidebar;
export { GET_PLAYLIST };