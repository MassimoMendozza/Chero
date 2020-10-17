
import * as React from 'react';
import {TagPicker,  Fabric, mergeStyles, IBasePicker, ITag, Modal, IconButton, Text, TextField, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps } from 'office-ui-fabric-react';


    const _testTags: ITag[] = [
      'black',
      'blue',
      'brown',
      'cyan',
      'green',
      'magenta',
      'mauve',
      'orange',
      'pink',
      'purple',
      'red',
      'rose',
      'violet',
      'white',
      'yellow'
    ].map(item => ({ key: item, name: item, isNewItem: false }));
    
    const newItem = mergeStyles({ color: '#f00', background: '#ddf', padding: '10px' });
    const existingItem = mergeStyles({ color: '#222', padding: '10px' });
    
    class TagPicker2 extends React.Component<{}, {}> {
       picker = React.createRef<IBasePicker<ITag>>();
    
       render() {
        return(
            <TagPicker
                  onResolveSuggestions={this.onResolveSuggestions}
                  componentRef={this.picker}
                  onRenderSuggestionsItem={this.onRenderSuggestionsItem}
                  onItemSelected={this.onItemSelected}
                />
        );
      }
    
       onRenderSuggestionsItem = (props: any, itemProps: any): JSX.Element => {
        console.log({props, itemProps})
        return <div className={props.isNewItem ? newItem : existingItem} key={props.key}>
          {props.name}
          </div>;
      };
    
       onResolveSuggestions = (filterText: string, tagList: ITag[]): ITag[] => {
         console.log({filterText, tagList});
        
        const existingMatches = filterText
          ? _testTags
              .filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
              .filter(tag => !this.listContainsDocument(tag, tagList))
          : [];
        return existingMatches.concat({ key: filterText, name: filterText, isNewItem: true });
      };
    
       onItemSelected = (item: ITag): ITag | null => {
        if(item && item.isNewItem) {
          alert("New item added, make any necessary backend calls.");
        }
        return item;
      };
    
       listContainsDocument(tag: ITag, tagList?: ITag[]) {
        if (!tagList || !tagList.length || tagList.length === 0) {
          return false;
        }
        return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
      }
    }
    

    export default TagPicker2;
