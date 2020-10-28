//import logo from './logo.svg';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.js'
import Player from './components/Player'
import PlaylistScreen from './components/playlist_screen/PlaylistScreen'

function App() {
  const msStyle={
    height:'100%',
    width: '100%',
    position: 'fixed',
    display: 'flex'
  }
  return (
    <div className='MarvinsStudio' style={msStyle}>
      <Sidebar/>
      <Player/>
      <PlaylistScreen/>
    </div>
  );
}

export default App;
