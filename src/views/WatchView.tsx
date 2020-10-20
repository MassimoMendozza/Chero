// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Clock from 'react-live-clock';
import './WatchView.css';
import { useBoolean } from '@uifabric/react-hooks';
import {TeachingBubble, Slider, Dropdown, DropdownMenuItemType, Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps, Button, ActionButton } from 'office-ui-fabric-react';
import { PornListComponent } from './components/PornListComponent';
const { ipcRenderer } = window.require("electron");

const options: IDropdownOption[] = [
    { key: 'happy', text: 'happy' },
    { key: 'sad', text: 'sad' },
    { key: 'naughty', text: 'naughty' },
    { key: 'romantic', text: 'romantic' },
    { key: 'rough', text: 'rough' },
    { key: 'spicy', text: 'spicy' },
    { key: 'relaxed', text: 'relaxed' },
    { key: 'weird', text: 'weird' },
    { key: 'mad', text: 'mad' },
    { key: 'lonely', text: 'lonely' },
    { key: 'tired', text: 'tired' },
    { key: 'restless', text: 'restless' },
    { key: 'numb', text: 'numb' },
    { key: 'mari', text: '420/69' },
    { key: 'melancholy', text: 'melancholy' },
    { key: 'lazy', text: 'lazy' },
    { key: 'irritated', text: 'irritated' },
];


export const WatchView: React.FunctionComponent = (props) => {
    const [isJustRandomOpen, setIsJustRandomOpen] = useState(true);
    const [embedSrc, setEmbedSrc] = useState('');
    const [watchedPorn, setWatchedPorn] = useState();
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [came, setCame] = useState(false);
    const [selectedMoods, setSelectedMoods] = React.useState<string[]>([]);
    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);

    const [beaValue, setBeaValue] = React.useState(0);
    const [amaValue, setAmaValue] = React.useState(0);
    const [tumValue, setTumValue] = React.useState(0);
    const [wetValue, setWetValue] = React.useState(0);
    const [vagValue, setVagValue] = React.useState(0);
    const [penValue, setPenValue] = React.useState(0);
    const [assValue, setAssValue] = React.useState(0);
    const [feeValue, setFeeValue] = React.useState(0);
    const [legValue, setLegValue] = React.useState(0);
    const [armValue, setArmValue] = React.useState(0);
    const [musValue, setMusValue] = React.useState(0);
    const [titValue, setTitValue] = React.useState(0);

    const beaOnChange = (value: number) => setBeaValue((value+100)/200);
    const amaOnChange = (value: number) => setAmaValue((value+100)/200);
    const tumOnChange = (value: number) => setTumValue((value+100)/200);
    const wetOnChange = (value: number) => setWetValue((value+100)/200);
    const vagOnChange = (value: number) => setVagValue((value+100)/200);
    const penOnChange = (value: number) => setPenValue((value+100)/200);
    const assOnChange = (value: number) => setAssValue((value+100)/200);
    const feeOnChange = (value: number) => setFeeValue((value+100)/200);
    const legOnChange = (value: number) => setLegValue((value+100)/200);
    const armOnChange = (value: number) => setArmValue((value+100)/200);
    const musOnChange = (value: number) => setMusValue((value+100)/200);
    const titOnChange = (value: number) => setTitValue((value+100)/200);
    

    /*useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);*/

    const onChangeMood = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
            setSelectedMoods(
                item.selected ? [...selectedMoods, item.key as string] : selectedMoods.filter(key => key !== item.key),
            );
        }
    };
    function openRandomPlayer() {
        if (selectedMoods.length === 0) {
            if(!teachingBubbleVisible){
                toggleTeachingBubbleVisible();
            }
        } else {
            ipcRenderer.send('openRandomPlayer');
            setIsJustRandomOpen(false);
            setIsPlayerOpen(true);
        }

    }
    function getMoodArray(){
        var moodArray=[];
        for(var i=0; i<options.length; i++){
            moodArray[options[i].key.toString()]=0;
        }
        for(var i=0; i<selectedMoods.length; i++){
            moodArray[selectedMoods[i]]=1;
        }
        return moodArray;
    }
    function getValuesArray(){
        var valueArray=[];
        valueArray['bea']=beaValue;
        valueArray['ama']=amaValue;
        valueArray['tum']=tumValue;
        valueArray['wet']=wetValue;
        valueArray['vag']=vagValue;
        valueArray['pen']=penValue;
        valueArray['ass']=assValue;
        valueArray['fee']=feeValue;
        valueArray['leg']=legValue;
        valueArray['arm']=armValue;
        valueArray['mus']=musValue;
        valueArray['tit']=titValue;
        return valueArray;
    }
    function wrongClick(){
        console.log('wrclicked');
        ipcRenderer.send('wrongClick', [watchedPorn.hashID,getMoodArray(), getValuesArray()]);
    }
    function orgasmClick(){
        ipcRenderer.send('orgasmClick', [watchedPorn.hashID,getMoodArray(), getValuesArray()]);
    }
    ipcRenderer.on('came', function (event, arg) {
        setIsPlayerOpen(false);
        setCame(true);
    });
    ipcRenderer.on('pornToWatch', function (event, arg) {
        console.log(arg);
        setWatchedPorn(arg);
        var temp = arg.url.split('?');
        console.log(arg.url);
        for(var i=0; i<temp.length; i++){
            if(temp[i].toString().includes('viewkey')){
                console.log('fratm');
                console.log(temp[i]);
                setEmbedSrc('http://www.pornhub.com/embed/'+temp[i].slice(8));
            }
        }
        console.log('yobro');

        console.log(embedSrc);
    });
    const examplePrimaryButtonProps: IButtonProps = {
      children: 'gotcha',
      onClick: toggleTeachingBubbleVisible,
    };
    return (
        <div className="View2">
            <Text className="Title" variant="xxLarge" >feeling excited?</Text>
            <div className="Clock" >
                <Clock format={'HH:mm'} ticking={true} />
            </div>
            <div className="centerWrapper">
                <div className="leftWrapper">
                    {(isJustRandomOpen === true) && <div className="justRandom">
                        <Text className="justRandomText" variant="xLarge" >you have no sufficient history to make predicitons<br />tell us how u feel and we'll randomly propose you material to like or not </Text>
                        <br /><br />
                        <Button onClick={openRandomPlayer}>Start</Button>
                    </div>}
                    {(isPlayerOpen === true) &&
                        <div>
                            <iframe className="player" src={embedSrc} frameborder="0" scrolling="no"></iframe>
                            <div className="teatherButton">
                            <ActionButton onClick={wrongClick} iconProps={{iconName: 'dislike'}} title="Emoji" ariaLabel="Emoji" text="kinda wrong"/>
                            <ActionButton onClick={orgasmClick} className="cameButton" iconProps={{iconName: 'glimmer'}} title="Emoji" ariaLabel="Emoji" text="got the orgasm!"/>
                            </div>
                        </div>}

                    {(isJustRandomOpen === true) && <div className="justRandom">
                        <Text className="justRandomText" variant="xLarge" >you have no sufficient history to make predicitons<br />tell us how u feel and we'll randomly propose you material to like or not </Text>
                        <br /><br />
                        <Button onClick={openRandomPlayer}>Start</Button>
                    </div>}
                    {(came === true) && <div className="justRandom">
                        <Text className="justRandomText" variant="xLarge" >you came</Text>
                    </div>}
                </div>
                <div className="divider">
                </div>
                <div className="sideWrapper">
                    <div className="sideFeel">
                        <Text className="sideTitle" variant="xLarge" >how do u feel now?</Text>
                        <br />
                        {teachingBubbleVisible && (
                            <TeachingBubble
                                target="#sideMood"
                                primaryButtonProps={examplePrimaryButtonProps}
                                hasSmallHeadline={true}
                                onDismiss={toggleTeachingBubbleVisible}
                                headline="choose at least one mood"
                                closeButtonAriaLabel="Close"
                            >
                                it helps us with future predictions!
                            </TeachingBubble>
                        )}
                        <Dropdown
                        id="sideMood"
                            className="sideMood"
                            placeholder="Select options"
                            label="moods"
                            onChange={onChangeMood}
                            multiSelect
                            options={options}
                        />
                        <Text className="sideTitle1" variant="mediumPlus" >how much re u looking for</Text>

                        <Text className="sideLabel1" variant="medium" >beauty</Text>
                        <Slider className="sideBeauty" min={-100} max={100} step={1} defaultValue={0} onChange={beaOnChange} showValue originFromZero />

                        <Text className="sideLabel2" variant="medium" >amateurness</Text>
                        <Slider className="sideAma" min={-100} max={100} step={1} defaultValue={0} onChange={amaOnChange} showValue originFromZero />

                        <Text className="sideLabel3" variant="medium" >tumblerness</Text>
                        <Slider className="sideTum" min={-100} max={100} step={1} defaultValue={0} onChange={tumOnChange} showValue originFromZero />

                        <Text className="sideLabel4" variant="medium" >wetness/cum</Text>
                        <Slider className="sideWet" min={-100} max={100} step={1} defaultValue={0} onChange={wetOnChange} showValue originFromZero />

                        <Text className="sideLabel5" variant="medium" >vagina</Text>
                        <Slider className="sideVag" min={-100} max={100} step={1} defaultValue={0} onChange={vagOnChange} showValue originFromZero />

                        <Text className="sideLabel6" variant="medium" >penis</Text>
                        <Slider className="sidePen" min={-100} max={100} step={1} defaultValue={0} onChange={penOnChange} showValue originFromZero />

                        <Text className="sideLabel7" variant="medium" >ass</Text>
                        <Slider className="sideAss" min={-100} max={100} step={1} defaultValue={0} onChange={assOnChange} showValue originFromZero />

                        <Text className="sideLabel8" variant="medium" >feet</Text>
                        <Slider className="sideFeet" min={-100} max={100} step={1} defaultValue={0} onChange={feeOnChange} showValue originFromZero />

                        <Text className="sideLabel9" variant="medium" >legs</Text>
                        <Slider className="sideLegs" min={-100} max={100} step={1} defaultValue={0} onChange={legOnChange} showValue originFromZero />

                        <Text className="sideLabel10" variant="medium" >arms</Text>
                        <Slider className="sideArms" min={-100} max={100} step={1} defaultValue={0} onChange={armOnChange} showValue originFromZero />

                        <Text className="sideLabel11" variant="medium" >muscles</Text>
                        <Slider className="sideMus" min={-100} max={100} step={1} defaultValue={0} onChange={musOnChange} showValue originFromZero />

                        <Text className="sideLabel12" variant="medium" >tits</Text>
                        <Slider className="sideTits" min={-100} max={100} step={1} defaultValue={0} onChange={titOnChange} showValue originFromZero />

                    </div>
                </div>
            </div>
        </div>
    )
};