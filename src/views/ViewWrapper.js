import React from 'react';
import {WatchView} from './WatchView.tsx';
import ListView from './ListView';
import { Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps } from 'office-ui-fabric-react';

class ViewWrapper extends React.Component {
    static getDerivedStateFromProps(props, state) {
          return {
            navSelectedKey: props.navkey
          };}
        


    constructor(props) {
        super(props);
        this.state = {
            navSelectedKey: props.navkey
        };
    }
    render() {
        if (!this.state.navSelectedKey) {
            return (<div>
                error
            </div>
            );
        }else if (this.state.navSelectedKey === 'key1') {
            return (
                <WatchView />
            );
        }else if (this.state.navSelectedKey === 'key2') {
            return (<div>
                <ListView />
            </div>
            );
        }else if (this.state.navSelectedKey === 'key3') {
            return (<div>
                3
            </div>
            );
        }
    }


}


export default ViewWrapper;
