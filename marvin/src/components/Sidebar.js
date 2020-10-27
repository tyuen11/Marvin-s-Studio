import React from 'react'

class Sidebar extends React.Component {
    render() {
        const sidebarStyle = {
            width: 200,
            height: '100%',
            background: 'black',
            padding: 20,
            color: 'white'
        }

        return (
            <div className="Sidebar" style={sidebarStyle}>Sidebar</div>
        )
        
    }
} 

export default Sidebar