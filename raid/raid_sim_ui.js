import { Sim } from '/tbc/core/sim.js';
import { SimUI } from '/tbc/core/sim_ui.js';
import { TypedEvent } from '/tbc/core/typed_event.js';
import { Blessings } from '/tbc/core/proto/ui.js';
import { Class } from '/tbc/core/proto/common.js';
import { Encounter as EncounterProto } from '/tbc/core/proto/common.js';
import { TristateEffect } from '/tbc/core/proto/common.js';
import { playerToSpec } from '/tbc/core/proto_utils/utils.js';
import { DetailedResults } from '/tbc/core/components/detailed_results.js';
import { EncounterPicker } from '/tbc/core/components/encounter_picker.js';
import { LogRunner } from '/tbc/core/components/log_runner.js';
import { SavedDataManager } from '/tbc/core/components/saved_data_manager.js';
import { addRaidSimAction } from '/tbc/core/components/raid_sim_action.js';
import { AssignmentsPicker } from './assignments_picker.js';
import { BlessingsPicker } from './blessings_picker.js';
import { RaidPicker } from './raid_picker.js';
import { implementedSpecs } from './presets.js';
export class RaidSimUI extends SimUI {
    constructor(parentElem, config) {
        super(parentElem, new Sim(), {
            title: 'TBC Raid Sim',
            knownIssues: config.knownIssues,
        });
        this.raidSimResultsManager = null;
        this.raidPicker = null;
        this.blessingsPicker = null;
        // Emits when the raid comp changes. Includes changes to buff bots.
        this.compChangeEmitter = new TypedEvent();
        this.referenceChangeEmitter = new TypedEvent();
        this.rootElem.classList.add('raid-sim-ui');
        this.config = config;
        this.sim.raid.compChangeEmitter.on(eventID => this.compChangeEmitter.emit(eventID));
        this.sim.raid.setModifyRaidProto(raidProto => this.modifyRaidProto(raidProto));
        this.sim.encounter.setModifyEncounterProto(encounterProto => this.modifyEncounterProto(encounterProto));
        this.addSidebarComponents();
        this.addTopbarComponents();
        this.addRaidTab();
        this.addSettingsTab();
        this.addDetailedResultsTab();
        this.addLogTab();
    }
    addSidebarComponents() {
        this.raidSimResultsManager = addRaidSimAction(this);
        this.raidSimResultsManager.referenceChangeEmitter.on(eventID => this.referenceChangeEmitter.emit(eventID));
    }
    addTopbarComponents() {
        //Array.from(document.getElementsByClassName('share-link')).forEach(element => {
        //	tippy(element, {
        //		'content': 'Shareable link',
        //		'allowHTML': true,
        //	});
        //	element.addEventListener('click', event => {
        //		const jsonStr = JSON.stringify(this.sim.toJson());
        //    const val = pako.deflate(jsonStr, { to: 'string' });
        //    const encoded = btoa(String.fromCharCode(...val));
        //		
        //    const linkUrl = new URL(window.location.href);
        //    linkUrl.hash = encoded;
        //    if (navigator.clipboard == undefined) {
        //      alert(linkUrl.toString());
        //    } else {
        //      navigator.clipboard.writeText(linkUrl.toString());
        //      alert('Current settings copied to clipboard!');
        //    }
        //	});
        //});
    }
    addRaidTab() {
        this.addTab('Raid', 'raid-tab', `
			<div class="raid-picker">
			</div>
			<div class="saved-raids-div">
				<div class="saved-raids-manager">
				</div>
			</div>
		`);
        this.raidPicker = new RaidPicker(this.rootElem.getElementsByClassName('raid-picker')[0], this);
    }
    addSettingsTab() {
        this.addTab('Settings', 'raid-settings-tab', `
			<div class="raid-settings-sections">
				<div class="raid-settings-section-container">
					<section class="settings-section raid-encounter-section">
						<label>Encounter</label>
					</section>
				</div>
				<div class="blessings-section-container">
					<section class="settings-section blessings-section">
						<label>Blessings</label>
					</section>
				</div>
				<div class="assignments-section-container">
				</div>
			</div>
			<div class="settings-bottom-bar">
				<div class="saved-encounter-manager">
				</div>
			</div>
		`);
        const encounterSectionElem = this.rootElem.getElementsByClassName('raid-encounter-section')[0];
        new EncounterPicker(encounterSectionElem, this.sim.encounter, {
            showTargetArmor: true,
            showNumTargets: true,
        });
        const savedEncounterManager = new SavedDataManager(this.rootElem.getElementsByClassName('saved-encounter-manager')[0], this.sim.encounter, {
            label: 'Encounter',
            storageKey: this.getSavedEncounterStorageKey(),
            getData: (encounter) => encounter.toProto(),
            setData: (eventID, encounter, newEncounter) => encounter.fromProto(eventID, newEncounter),
            changeEmitters: [this.sim.encounter.changeEmitter],
            equals: (a, b) => EncounterProto.equals(a, b),
            toJson: (a) => EncounterProto.toJson(a),
            fromJson: (obj) => EncounterProto.fromJson(obj),
        });
        this.sim.waitForInit().then(() => {
            savedEncounterManager.loadUserData();
        });
        this.blessingsPicker = new BlessingsPicker(this.rootElem.getElementsByClassName('blessings-section')[0], this);
        const assignmentsPicker = new AssignmentsPicker(this.rootElem.getElementsByClassName('assignments-section-container')[0], this);
    }
    addDetailedResultsTab() {
        this.addTab('Detailed Results', 'detailed-results-tab', `
			<div class="detailed-results">
			</div>
		`);
        const detailedResults = new DetailedResults(this.rootElem.getElementsByClassName('detailed-results')[0], this, this.raidSimResultsManager);
    }
    addLogTab() {
        this.addTab('Log', 'log-tab', `
			<div class="log-runner">
			</div>
		`);
        const logRunner = new LogRunner(this.rootElem.getElementsByClassName('log-runner')[0], this);
    }
    modifyRaidProto(raidProto) {
        // Invoke all the buff bot callbacks.
        this.getBuffBots().forEach(buffBot => {
            const partyProto = raidProto.parties[buffBot.getPartyIndex()];
            if (!partyProto) {
                throw new Error('No party proto for party index: ' + buffBot.getPartyIndex());
            }
            buffBot.settings.modifyRaidProto(buffBot, raidProto, partyProto);
        });
        // Apply blessings.
        const numPaladins = this.getClassCount(Class.ClassPaladin);
        const blessingsAssignments = this.blessingsPicker.getAssignments();
        implementedSpecs.forEach(spec => {
            const playerProtos = raidProto.parties
                .map(party => party.players.filter(player => player.class != Class.ClassUnknown && playerToSpec(player) == spec))
                .flat();
            blessingsAssignments.paladins.forEach((paladin, i) => {
                if (i >= numPaladins) {
                    return;
                }
                if (paladin.blessings[spec] == Blessings.BlessingOfKings) {
                    playerProtos.forEach(playerProto => playerProto.buffs.blessingOfKings = true);
                }
                else if (paladin.blessings[spec] == Blessings.BlessingOfMight) {
                    playerProtos.forEach(playerProto => playerProto.buffs.blessingOfMight = TristateEffect.TristateEffectImproved);
                }
                else if (paladin.blessings[spec] == Blessings.BlessingOfWisdom) {
                    playerProtos.forEach(playerProto => playerProto.buffs.blessingOfWisdom = TristateEffect.TristateEffectImproved);
                }
            });
        });
    }
    modifyEncounterProto(encounterProto) {
        // Invoke all the buff bot callbacks.
        this.getBuffBots().forEach(buffBot => {
            buffBot.settings.modifyEncounterProto(buffBot, encounterProto);
        });
    }
    getCurrentData() {
        if (this.raidSimResultsManager) {
            return this.raidSimResultsManager.getCurrentData();
        }
        else {
            return null;
        }
    }
    getReferenceData() {
        if (this.raidSimResultsManager) {
            return this.raidSimResultsManager.getReferenceData();
        }
        else {
            return null;
        }
    }
    getClassCount(playerClass) {
        return this.sim.raid.getClassCount(playerClass)
            + this.getBuffBots()
                .filter(buffBot => buffBot.getClass() == playerClass).length;
    }
    getBuffBots() {
        return this.raidPicker.getBuffBots();
    }
    getPlayersAndBuffBots() {
        const players = this.sim.raid.getPlayers();
        const buffBots = this.getBuffBots();
        const playersAndBuffBots = players.slice();
        buffBots.forEach(buffBot => {
            playersAndBuffBots[buffBot.getRaidIndex()] = buffBot;
        });
        return playersAndBuffBots;
    }
    // Returns the actual key to use for local storage, based on the given key part and the site context.
    getStorageKey(keyPart) {
        return '__raid__' + keyPart;
    }
}