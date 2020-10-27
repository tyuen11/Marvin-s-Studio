//import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar.js'
import Player from './components/Player'

function App() {
  const msStyle={
    height:'100%',
    width: '100%',
    position: 'absolute',
    display: 'flex'
  }
  return (
    <div className='MarvinsStudio' style={msStyle}>
      <Sidebar/>
      <Player/>
    </div>
  );
}

export default App;
