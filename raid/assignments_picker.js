import { Component } from '/tbc/core/components/component.js';
import { RaidTargetPicker } from '/tbc/core/components/raid_target_picker.js';
import { Player } from '/tbc/core/player.js';
import { TypedEvent } from '/tbc/core/typed_event.js';
import { Class } from '/tbc/core/proto/common.js';
import { newRaidTarget, emptyRaidTarget } from '/tbc/core/proto_utils/utils.js';
export class AssignmentsPicker extends Component {
    constructor(parentElem, raidSimUI) {
        super(parentElem, 'assignments-picker-root');
        this.changeEmitter = new TypedEvent();
        this.raidSimUI = raidSimUI;
        this.innervatesPicker = new InnervatesPicker(this.rootElem, raidSimUI);
    }
}
;
export class InnervatesPicker extends Component {
    constructor(parentElem, raidSimUI) {
        super(parentElem, 'innervates-picker-root');
        this.changeEmitter = new TypedEvent();
        this.raidSimUI = raidSimUI;
        this.targetPickers = [];
        this.playersContainer = document.createElement('div');
        this.playersContainer.classList.add('innervate-players-container', 'settings-section');
        this.rootElem.appendChild(this.playersContainer);
        this.update(this.raidSimUI.getPlayersAndBuffBots());
        this.raidSimUI.compChangeEmitter.on(eventID => {
            this.recoverRaidTargets();
            this.update(this.raidSimUI.getPlayersAndBuffBots());
        });
    }
    update(playersAndBots) {
        this.playersContainer.innerHTML = `
			<label>Innervates</label>
		`;
        const druids = playersAndBots.filter(playerOrBot => playerOrBot?.getClass() == Class.ClassDruid);
        if (druids.length == 0) {
            this.rootElem.style.display = 'none';
        }
        else {
            this.rootElem.style.display = 'initial';
        }
        this.targetPickers = druids.map((druid, druidIndex) => {
            const row = document.createElement('div');
            row.classList.add('innervate-player');
            this.playersContainer.appendChild(row);
            const innervateSourceElem = RaidTargetPicker.makeOptionElem({
                iconUrl: druid instanceof Player ? druid.getTalentTreeIcon() : druid.settings.iconUrl,
                text: druid.getLabel(),
                color: druid.getClassColor(),
                isDropdown: false,
            });
            innervateSourceElem.classList.add('raid-target-picker-root');
            row.appendChild(innervateSourceElem);
            const arrow = document.createElement('span');
            arrow.classList.add('innervate-arrow', 'fa', 'fa-arrow-right');
            row.appendChild(arrow);
            let raidTargetPicker = null;
            if (druid instanceof Player) {
                raidTargetPicker = new RaidTargetPicker(row, druid, {
                    extraCssClasses: [
                        'innervate-target-picker',
                    ],
                    noTargetLabel: 'Unassigned',
                    compChangeEmitter: this.raidSimUI.sim.raid.compChangeEmitter,
                    getOptions: () => {
                        return this.raidSimUI.sim.raid.getPlayers().filter(player => player != null).map(player => {
                            return {
                                iconUrl: player.getTalentTreeIcon(),
                                text: player.getLabel(),
                                color: player.getClassColor(),
                                isDropdown: true,
                                value: newRaidTarget(player.getRaidIndex()),
                            };
                        });
                    },
                    changedEvent: (player) => player.specOptionsChangeEmitter,
                    getValue: (player) => player.getSpecOptions().innervateTarget || emptyRaidTarget(),
                    setValue: (eventID, player, newValue) => {
                        const newOptions = player.getSpecOptions();
                        newOptions.innervateTarget = newValue;
                        player.setSpecOptions(eventID, newOptions);
                    },
                });
            }
            else {
                raidTargetPicker = new RaidTargetPicker(row, druid, {
                    extraCssClasses: [
                        'innervate-target-picker',
                    ],
                    noTargetLabel: 'Unassigned',
                    compChangeEmitter: this.raidSimUI.sim.raid.compChangeEmitter,
                    getOptions: () => {
                        return this.raidSimUI.sim.raid.getPlayers().filter(player => player != null).map(player => {
                            return {
                                iconUrl: player.getTalentTreeIcon(),
                                text: player.getLabel(),
                                color: player.getClassColor(),
                                isDropdown: true,
                                value: newRaidTarget(player.getRaidIndex()),
                            };
                        });
                    },
                    changedEvent: (player) => player.innervateAssignmentChangeEmitter,
                    getValue: (player) => player.getInnervateAssignment(),
                    setValue: (eventID, player, newValue) => player.setInnervateAssignment(eventID, newValue),
                });
            }
            raidTargetPicker.changeEmitter.on(eventID => {
                this.targetPickers[druidIndex].targetPlayer = this.raidSimUI.sim.raid.getPlayerFromRaidTarget(raidTargetPicker.getInputValue());
            });
            return {
                playerOrBot: druid,
                targetPicker: raidTargetPicker,
                targetPlayer: this.raidSimUI.sim.raid.getPlayerFromRaidTarget(raidTargetPicker.getInputValue()),
            };
        });
    }
    // Tries to recover the current raid targets after the raid comp has changed.
    // For example, if an innervate is targeted onto a specific mage and that mage is
    // moved, we want to keep targeting the same mage.
    //
    // Note that when two characters are swapped, multiple compChange events are fired
    // and one of the characters will momentarily not be part of the raid. To address
    // this we have to wait a bit before checking.
    recoverRaidTargets() {
        const oldTargetPickers = this.targetPickers.slice();
        const oldPlayerTargets = oldTargetPickers.map(otp => otp.targetPlayer);
        // TODO: This needs to somehow reference the 'parent' eventID so that undo
        // actions undo them together.
        const eventID = TypedEvent.nextEventID();
        TypedEvent.freezeAll();
        oldTargetPickers.forEach((targetPicker, i) => {
            const oldPlayerOrBot = targetPicker.playerOrBot;
            const oldPlayerTarget = oldPlayerTargets[i];
            const newPlayersAndBots = this.raidSimUI.getPlayersAndBuffBots();
            if (!newPlayersAndBots.includes(oldPlayerOrBot))
                return;
            if (!oldPlayerTarget || !newPlayersAndBots.includes(oldPlayerTarget))
                return;
            const raidTarget = newRaidTarget(oldPlayerTarget.getRaidIndex());
            if (oldPlayerOrBot instanceof Player) {
                const newOptions = oldPlayerOrBot.getSpecOptions();
                newOptions.innervateTarget = raidTarget;
                oldPlayerOrBot.setSpecOptions(eventID, newOptions);
            }
            else {
                oldPlayerOrBot.setInnervateAssignment(eventID, raidTarget);
            }
        });
        TypedEvent.unfreezeAll();
    }
}