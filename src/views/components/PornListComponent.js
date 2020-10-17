import * as React from 'react';
import { getRTL } from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { List } from 'office-ui-fabric-react/lib/List';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
import { useConst } from '@uifabric/react-hooks';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import '../ListView.css';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { DefaultButton, IContextualMenuProps, IIconProps, Stack, IStackStyles } from 'office-ui-fabric-react';
import {AddPorn} from '../addPorn/addPorn';


const { ipcRenderer } = window.require("electron");


const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            color: 'white',
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            selectors: {
                '&:hover': { background: palette.neutralLight, color: 'black' },
            },
        },
    ],
    itemImage: {
        flexShrink: 0,
    },
    itemContent: {
        marginLeft: 10,
        overflow: 'hidden',
        flexGrow: 1,
        selectors: {
            '&:hover': { color: 'black' },
        }
    },
    itemName: [
        fonts.xLarge,
        {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            selectors: {
                '&:hover': { color: 'black' },
            }
        },
    ],
    itemIndex: {
        fontSize: fonts.small.fontSize,
        color: palette.neutralTertiary,
        marginBottom: 10,
    },
    chevron: {
        alignSelf: 'center',
        marginLeft: 10,
        color: palette.neutralTertiary,
        fontSize: fonts.large.fontSize,
        flexShrink: 0,
        selectors: {
            '&:hover': { color: 'black' },
        }
    },
});

const onRenderCell = (item: IExampleItem, index: number | undefined): JSX.Element => {

    return (
        <div className={classNames.itemCell} data-is-focusable={true}>
            <Image className={classNames.itemImage} src={item.thumbnail} width={50} height={50} imageFit={ImageFit.cover} />
            <div className={classNames.itemContent}>
                <div className={classNames.itemName}>{item.title}</div>
                {/*   <div className={classNames.itemIndex}>{`Item ${index}`}</div>*/}
                <div><FontIcon iconName="people" /> {item.actorsString}</div>
                <div><FontIcon iconName="tag" /> {item.tagsString}</div>
            </div>
            <Icon className={classNames.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
        </div>
    );
};

export const PornListComponent: React.FunctionComponent = () => {
    const [originalItems, setOriginalItems] = React.useState(()=>arrayFromDB());
    const [items, setItems] = React.useState(originalItems);
    const [openModal, setOpenModal] = React.useState(false);
    const [isListVisible, setIsListVisible] = React.useState(true);
    ipcRenderer.on('closeAddPornModal', function (event, arg) {
        setOpenModal(false);
    })

    function arrayFromDB(){
        var a=ipcRenderer.sendSync('getPornList', '');
        var r = []; var i=0;
        while(i<a.length){
            r=[...r, a[i]];
            i++;
        }
        return r;
    }
    const resultCountText =
        items.length === originalItems.length ? '' : ` (${items.length} of ${originalItems.length} shown)`;

    const onFilterChanged = (_: any, text: string): void => {
        setItems(originalItems.filter(item => item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0));
    };
    const showModal=()=>{
        setOpenModal(true);
        console.log('òp');
    }

    return (
        <FocusZone
            // style={{padding: '1em'}}
            className="Form" direction={FocusZoneDirection.vertical}>
            <AddPorn isOpen={openModal}></AddPorn>
            <div className="FormWrapper">
                <SearchBox className="searchStyle" placeholder="search" onChange={(_, newValue) => onFilterChanged(_, newValue)}></SearchBox>
                <DefaultButton className='newButton' text="add" allowDisabledFocus iconProps={{iconName: 'add'}} onClick={showModal} />
                {(isListVisible === true) && <List className="ListStyle" style={{ paddingTop: '1em' }} items={items} onRenderCell={onRenderCell}></List>}
            </div>
        </FocusZone>
    );
};
