// @ts-nocheck
import React, { useEffect, useState } from 'react';
import './addPorn.css';
import { DefaultButton, Spinner, Image, MessageBarButton, MessageBar, Modal, IconButton, Text, TextField, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps, CommandButton, CommandBarButton } from 'office-ui-fabric-react';
const { ipcRenderer } = window.require("electron");




export const AddPorn: React.FunctionComponent = (props) => {
    const [open, setOpen] = useState(props.isOpen);
    const [gotchaPadding, setGotchaPadding] = useState('2em');
    const [spinLabel, setSpinLabel] = useState("fetching infos...");
    const [infoLabel, setInfoLabel] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [thumbValue, setThumbValue] = useState('');
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [urlValue, setUrlValue] = React.useState('');
    const [titleValue, setTitleValue] = React.useState('');
    const [actorsValue, setActorsValue] = React.useState('');
    const [tagsValue, setTagsValue] = React.useState('');
    var fetchArray;

    const onChangeUrlValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUrlValue(newValue || '');
        },
        [],
    );

    const onChangeTitleValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setTitleValue(newValue || '');
        },
        [],
    );

    const onChangeActorsValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setActorsValue(newValue || '');
        },
        [],
    );

    const onChangeTagsValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setTagsValue(newValue || '');
        },
        [],
    );


    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    function toggleModal() {
        ipcRenderer.send('closeAddPornModal');
    }

    function fetchfromURL() {
        if (urlValue === '') {
            setInfoLabel("url cannot be empty when clicking 'fetch from url'");
            setGotchaPadding('2em');
            setShowInfoBox(true);
            console.log(showInfoBox);
        } else {
            setSpinLabel("fetching infos...");
            setIsFetching(true);
            ipcRenderer.send('addPornFetch', urlValue);
        }
    }

    ipcRenderer.on('addPornFetched', function (event, arg) {
        setTitleValue(arg.title);
        setActorsValue(arg.pornstars);
        setTagsValue(arg.tags);
        setThumbValue(arg.thumbnail_url);
        console.log(arg);
        setIsFetching(false);
    })

    function dimissInfoBox(){
        setShowInfoBox(false);
    }


    function addPornClick(){
        setSpinLabel("enriching your collection...");
        setIsFetching(true);
        if((titleValue==='')||(tagsValue==='')||(actorsValue==='')||(urlValue=='')||(thumbValue==='')){
            setInfoLabel("one or more field are empty, check pls");
            setGotchaPadding('7em');
            setShowInfoBox(true);
        }else{
            var msg = ipcRenderer.sendSync('addPornAdding', [titleValue, actorsValue, tagsValue, thumbValue]);
            if(msg === 'ok'){
                setIsFetching(false);
                toggleModal();
                ipcRenderer.send('updatePornList', '');
            }else{
                setInfoLabel(msg);
                setIsFetching(false);
                setShowInfoBox(true);
            }
        }
    }

    return (
        <Modal isOpen={open}>
            <div className="modalWrapper">
                {(isFetching === true) && <div className="fetching">
                    <div className="fetchingWrapper">
                        <Spinner label= {spinLabel}/>
                        </div>
                    </div>}
                {(showInfoBox === true) && <MessageBar className="messageBar" isMultiline={true}>
                    {infoLabel}
                    <Link style={{ marginLeft: gotchaPadding }} onClick={dimissInfoBox}>
                        gotcha
                        </Link>
                </MessageBar>}
                <IconButton
                    className="closeButton"
                    iconProps={{ iconName: 'cancel' }}
                    ariaLabel="Close popup modal"
                    onClick={toggleModal}
                />
                <Text className="title" variant="xLarge" >enrich your collection</Text>
                <div className="FormWrapper">
                    <div className="secForm">
                        <TextField label="title" value={titleValue} onChange={onChangeTitleValue} className="titleField" />
                        <TextField label="tags" value={tagsValue} onChange={onChangeTagsValue} className="titleField" />
                        <TextField label="actors" value={actorsValue} onChange={onChangeActorsValue} className="titleField" />
                        <TextField label="url" value={urlValue} onChange={onChangeUrlValue} className="titleField" />
                    </div>
                </div>
                <div className="thumb">
                    <div className="thumbWrapper">
                        <Text style={{ fontWeight: '500' }}>thumbnail</Text>
                        <div style={{paddingTop:'0.5em'}}>
                            {(thumbValue === '') && <div style={{
                                width: '11em',
                                height: '6.85em',
                                backgroundColor: '#2b0606'
                            }}>
                                </div>}
                        {(thumbValue !== '') && <Image
                            src={thumbValue}
                            alt="Example with no image fit value and only width is specified."
                            width={'11em'}
                        />}
                        <CommandButton text="pick an image..." allowDisabledFocus iconProps={{ iconName: 'fileimage' }} />
                        </div>
                        
                    </div>

                </div>
                <div className="buttonsRow">
                    <CommandButton className="bottomButtons" text="fetch from url" onClick={fetchfromURL} allowDisabledFocus iconProps={{ iconName: 'download' }} />
                    <div></div>
                    <DefaultButton className="bottomButtons" text="finish" allowDisabledFocus onClick={addPornClick} iconProps={{ iconName: 'accept' }} />
                </div>
            </div>

        </Modal>
    );
};