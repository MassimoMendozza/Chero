import React from 'react';
import './WatchView.css';
import { Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps } from 'office-ui-fabric-react';
const { ipcRenderer } = window.require("electron");


class WatchView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            navSelectedKey: props.navkey
        };
        
    //this.pornList=ipcRenderer.sendSync('getPornList', '');
    console.log('bRoview');
    console.log(this.pornList);
    }
    render() {
        return(
            <div className="View">
            <Text className="Title" variant="xxLarge" >feeling excited?</Text>
        </div>
        )
    }
}





export default WatchView;
