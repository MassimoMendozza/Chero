// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Clock from 'react-live-clock';
import './WatchView.css';
import { Slider, Dropdown, DropdownMenuItemType, Stack, Text, Link, FontWeights, createTheme, Nav, INavLink, INavStyles, INavLinkGroup, loadTheme, IIconProps, Button } from 'office-ui-fabric-react';
const { ipcRenderer } = window.require("electron");

const options: IDropdownOption[] = [
    { key: 'happy', text: 'happy' },
    { key: 'carsadrot', text: 'sad' },
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
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);  
    const [selectedMoods, setSelectedMoods] = React.useState<string[]>([]);


    /*useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);*/

    const onChangeMood = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        if (item) {
          setSelectedMoods(
            item.selected ? [...selectedKeys, item.key as string] : selectedKeys.filter(key => key !== item.key),
          );
        }
      };
    function openRandomPlayer(){
        setIsJustRandomOpen(false);
        setIsPlayerOpen(true);
        ipcRenderer.send('openRandomPlayer');
    }

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
                    <div className="player">
                    
                    </div>}
                </div>
                <div className="divider">
                </div>
                <div className="sideWrapper">
                    <div className="sideFeel">
                        <Text className="sideTitle" variant="xLarge" >how do u feel now?</Text>
                        <br />
                        <Dropdown
                            className="sideMood"
                            placeholder="Select options"
                            label="moods"
                            onChange={onChangeMood}
                            multiSelect
                            options={options}
                        />
                        <Text className="sideTitle1" variant="mediumPlus" >how much re u looking for</Text>

                        <Text className="sideLabel1" variant="medium" >beauty</Text>
                        <Slider className="sideBeauty" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel2" variant="medium" >amateurness</Text>
                        <Slider className="sideAma" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel3" variant="medium" >tumblerness</Text>
                        <Slider className="sideTum" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel4" variant="medium" >wetness/cum</Text>
                        <Slider className="sideWet" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel5" variant="medium" >vagina</Text>
                        <Slider className="sideVag" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel6" variant="medium" >penis</Text>
                        <Slider className="sidePen" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel7" variant="medium" >ass</Text>
                        <Slider className="sideAss" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel8" variant="medium" >feet</Text>
                        <Slider className="sideFeet" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel9" variant="medium" >legs</Text>
                        <Slider className="sideLegs" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel10" variant="medium" >arms</Text>
                        <Slider className="sideArms" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel11" variant="medium" >muscles</Text>
                        <Slider className="sideMus" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                        <Text className="sideLabel12" variant="medium" >tits</Text>
                        <Slider className="sideTits" min={-100} max={100} step={1} defaultValue={0} showValue originFromZero />

                    </div>
                </div>
            </div>
        </div>
    )
};