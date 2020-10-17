import React from 'react';
import './ListView.css';
import './components/PornListComponent';
import { Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps } from 'office-ui-fabric-react';
import {PornListComponent} from './components/PornListComponent';
const { ipcRenderer } = window.require("electron");


class ListView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            listVisible: true
            
        };
        
    ;
    }
    
    
    render() {ipcRenderer.on('updatePornList', function(event, arg){
        this.setState({listVisible: false});
        this.setState({listVisible: true});

    }.bind(this));
        return(
            <div className="View">
            <Text className="Title" variant="xxLarge" >your favourites</Text>
            {(this.state.listVisible === true)&&<PornListComponent className="List"></PornListComponent>}
        </div>
        )
    }
}





export default ListView;
