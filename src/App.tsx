// @ts-nocheck
import React from 'react';
import { Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps } from 'office-ui-fabric-react';
import './App.css';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import ViewWrapper from'./views/ViewWrapper';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
const { ipcRenderer } = window.require("electron");

//theme
let myTheme = createTheme({
  palette: {
    themePrimary: '#d40000',
    themeLighterAlt: '#fdf3f3',
    themeLighter: '#f8d0d0',
    themeLight: '#f2a9a9',
    themeTertiary: '#e55c5c',
    themeSecondary: '#d91a1a',
    themeDarkAlt: '#be0000',
    themeDark: '#a10000',
    themeDarker: '#770000',
    neutralLighterAlt: '#430a0a',
    neutralLighter: '#4b0e0e',
    neutralLight: '#571515',
    neutralQuaternaryAlt: '#5f1a1a',
    neutralQuaternary: '#651f1f',
    neutralTertiaryAlt: '#7f3535',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#eee',
    black: '#f8f8f8',
    white: '#3b0606',
  }
});
let navTheme = createTheme({
  palette: {
    themePrimary: '#d40000',
    themeLighterAlt: '#fdf3f3',
    themeLighter: '#f8d0d0',
    themeLight: '#f2a9a9',
    themeTertiary: '#e55c5c',
    themeSecondary: '#d91a1a',
    themeDarkAlt: '#be0000',
    themeDark: '#a10000',
    themeDarker: '#770000',
    neutralLighterAlt: '#430a0a',
    neutralLighter: '#4b0e0e',
    neutralLight: '#571515',
    neutralQuaternaryAlt: '#5f1a1a',
    neutralQuaternary: '#651f1f',
    neutralTertiaryAlt: '#7f3535',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#3b0606',
  }
});
let navStyles = {
  root: {
    //width: 200,
    //height: '100vh',
    boxSizing: 'border-box',
    overflowY: 'hidden',
  },
};

let navLinkGroups = [
  {
    links: [
      {
        name: 'watch',
        icon: 'play',
        key: 'key1'
      },
      {
        name: 'list',
        icon: 'list',
        key: 'key2',
      },
      {
        name: 'feelings',
        icon: 'reminderperson',
        key: 'key3',
      },
    ],
  },
];


class App extends React.Component {



  constructor(props) {
    super(props);
    initializeIcons();
    loadTheme(myTheme);
    this.state = {
      navSelectedKey: "key1"
    };
  }
  // @ts-nocheck
  _onLinkClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
    if (item && item.name === 'watch') {
      this.setState({ navSelectedKey: "key1" });
    } else if (item && item.name === 'list') {
      this.setState({ navSelectedKey: "key2" });
    } else if (item && item.name === 'feelings') {
      this.setState({ navSelectedKey: "key3" });

    }
  }
  render() {
    return (
      <div className="App">
        <div className="titlebar">
          <div className="titlebarwrapper" >
          <div className="windowname">chero</div>
          <div className="close"><FontIcon iconName="ChromeClose"/></div>
          <div className="min"><FontIcon iconName="ChromeMinimize"/></div>
          <div className="max"><FontIcon iconName="checkbox"/></div>
          </div>
            
            
        </div>
        <div
          className="one">
          <Nav
            onLinkClick={this._onLinkClick.bind(this)}
            selectedKey={this.state.navSelectedKey}
            ariaLabel="Nav basic example"
            styles={navStyles}
            groups={navLinkGroups}
          />
        </div>
        <ViewWrapper navkey={this.state.navSelectedKey}/>
      </div>
    );
  }


}


export default App;
