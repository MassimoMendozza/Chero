// @ts-nocheck
import React, { useEffect, useState } from 'react';
import './fetchUrlList.css';
import { DefaultButton, Spinner, Image, MessageBarButton, MessageBar, Modal, IconButton, Text, TextField, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps, CommandButton, CommandBarButton } from 'office-ui-fabric-react';
const { ipcRenderer } = window.require("electron");




export const FetchUrlList: React.FunctionComponent = (props) => {
    const [open, setOpen] = useState(props.isOpen);
    const [gotchaPadding, setGotchaPadding] = useState('2em');
    const [spinLabel, setSpinLabel] = useState("fetching infos...");
    const [infoLabel, setInfoLabel] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [thumbValue, setThumbValue] = useState('');
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [titleValue, setTitleValue] = React.useState('');
    var fetchArray;


    const onChangeTitleValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setTitleValue(newValue || '');
        },
        [],
    );


    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    function toggleModal() {
        ipcRenderer.send('closeFetchFromUrlModal');
    }

    function fetchfromURL() {
        if (titleValue === '') {
            setInfoLabel("url cannot be empty when clicking 'fetch from url'");
            setGotchaPadding('2em');
            setShowInfoBox(true);
            console.log(showInfoBox);
        } else {
            setSpinLabel("fetching infos...");
            setIsFetching(true);
            ipcRenderer.send('fetchUrlFetch', urlValue);
        }
    }

    ipcRenderer.on('fetchUrlListStatus', function (event, arg) {
        if(arg!=='k'){
            setSpinLabel('processing urls... '+arg);
        }else{
            setIsFetching(false);
            toggleModal();
        }
    })

    function dimissInfoBox(){
        setShowInfoBox(false);
    }


    function fetchUrlClick(){
        if(titleValue===''){
            setInfoLabel("urls field is empty, check pls");
            setGotchaPadding('7em');
            setShowInfoBox(true);
            setIsFetching(false);
        }else{
            setSpinLabel("processing urls...");
            setIsFetching(true);
            var temp=titleValue.split("\n");
            var msg = ipcRenderer.send('fetchUrlListAdding',temp);
        }
    }

    return (
        <Modal isOpen={open}>
            <div className="modalWrapper2">
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
                <div className="FormWrapper2">
                    <div className="secForm2">
                        <TextField label="urls" value={titleValue} onChange={onChangeTitleValue} className="titleField2" multiline resizable={false} height={"30em"}/>
                    </div>
                </div>
                <div className="buttonsRow2">
                    <div></div><div></div>
                    <DefaultButton className="bottomButtons" text="finish" allowDisabledFocus onClick={fetchUrlClick} iconProps={{ iconName: 'accept' }} />
                </div>
            </div>

        </Modal>
    );
};