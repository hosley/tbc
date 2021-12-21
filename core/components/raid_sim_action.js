import { Encounter as EncounterProto } from '/tbc/core/proto/common.js';
import { Raid as RaidProto } from '/tbc/core/proto/api.js';
import { TypedEvent } from '/tbc/core/typed_event.js';
export function addRaidSimAction(simUI) {
    simUI.addAction('DPS', 'dps-action', async () => {
        simUI.setResultsPending();
        try {
            const result = await simUI.sim.runRaidSim(TypedEvent.nextEventID());
        }
        catch (e) {
            simUI.hideAllResults();
            alert(e);
        }
    });
    const resultsManager = new RaidSimResultsManager(simUI);
    simUI.sim.simResultEmitter.on((eventID, simResult) => {
        resultsManager.setSimResult(eventID, simResult);
    });
    return resultsManager;
}
export class RaidSimResultsManager {
    constructor(simUI) {
        this.currentChangeEmitter = new TypedEvent();
        this.referenceChangeEmitter = new TypedEvent();
        this.currentData = null;
        this.referenceData = null;
        this.simUI = simUI;
    }
    setSimResult(eventID, simResult) {
        this.currentData = {
            simResult: simResult,
            settings: this.simUI.sim.toJson(),
            raidProto: RaidProto.clone(simResult.request.raid || RaidProto.create()),
            encounterProto: EncounterProto.clone(simResult.request.encounter || EncounterProto.create()),
        };
        this.currentChangeEmitter.emit(eventID);
        const dpsMetrics = simResult.raidMetrics.dps;
        this.simUI.setResultsContent(`
      <div class="results-sim">
				<div class="results-sim-dps">
					<span class="results-sim-dps-avg">${dpsMetrics.avg.toFixed(2)}</span>
					<span class="results-sim-dps-stdev">${dpsMetrics.stdev.toFixed(2)}</span>
				</div>
				<div class="results-sim-reference">
					<span class="results-sim-set-reference fa fa-bookmark"></span>
					<div class="results-sim-reference-bar">
						<span class="results-sim-reference-diff"></span>
						<span class="results-sim-reference-text"> vs. reference</span>
						<span class="results-sim-reference-swap fa fa-retweet"></span>
						<span class="results-sim-reference-delete fa fa-times"></span>
					</div>
				</div>
      </div>
    `);
        const simReferenceElem = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference')[0];
        const simReferenceDiffElem = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference-diff')[0];
        const simReferenceSetButton = this.simUI.resultsContentElem.getElementsByClassName('results-sim-set-reference')[0];
        simReferenceSetButton.addEventListener('click', event => {
            this.referenceData = this.currentData;
            this.updateReference(TypedEvent.nextEventID());
        });
        tippy(simReferenceSetButton, {
            'content': 'Use as reference',
            'allowHTML': true,
        });
        const simReferenceSwapButton = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference-swap')[0];
        simReferenceSwapButton.addEventListener('click', event => {
            if (this.currentData && this.referenceData) {
                const eventID = TypedEvent.nextEventID();
                TypedEvent.freezeAll();
                const tmpData = this.currentData;
                this.currentData = this.referenceData;
                this.referenceData = tmpData;
                this.simUI.sim.raid.fromProto(eventID, this.currentData.raidProto);
                this.simUI.sim.encounter.fromProto(eventID, this.currentData.encounterProto);
                this.setSimResult(eventID, this.currentData.simResult);
                this.updateReference(eventID);
                TypedEvent.unfreezeAll();
            }
        });
        tippy(simReferenceSwapButton, {
            'content': 'Swap reference with current',
            'allowHTML': true,
        });
        const simReferenceDeleteButton = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference-delete')[0];
        simReferenceDeleteButton.addEventListener('click', event => {
            this.referenceData = null;
            this.updateReference(TypedEvent.nextEventID());
        });
        tippy(simReferenceDeleteButton, {
            'content': 'Remove reference',
            'allowHTML': true,
        });
        this.updateReference(eventID);
    }
    updateReference(eventID) {
        this.referenceChangeEmitter.emit(eventID);
        const simReferenceElem = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference')[0];
        const simReferenceDiffElem = this.simUI.resultsContentElem.getElementsByClassName('results-sim-reference-diff')[0];
        if (!this.referenceData || !this.currentData) {
            simReferenceElem.classList.remove('has-reference');
            return;
        }
        simReferenceElem.classList.add('has-reference');
        const currentDpsMetrics = this.currentData.simResult.raidMetrics.dps;
        const referenceDpsMetrics = this.referenceData.simResult.raidMetrics.dps;
        const delta = currentDpsMetrics.avg - referenceDpsMetrics.avg;
        const deltaStr = delta.toFixed(2);
        if (delta >= 0) {
            simReferenceDiffElem.textContent = '+' + deltaStr;
            simReferenceDiffElem.classList.remove('negative');
            simReferenceDiffElem.classList.add('positive');
        }
        else {
            simReferenceDiffElem.textContent = '' + deltaStr;
            simReferenceDiffElem.classList.remove('positive');
            simReferenceDiffElem.classList.add('negative');
        }
    }
    getCurrentData() {
        if (this.currentData == null) {
            return null;
        }
        // Defensive copy.
        return {
            simResult: this.currentData.simResult,
            settings: JSON.parse(JSON.stringify(this.currentData.settings)),
            raidProto: this.currentData.raidProto,
            encounterProto: this.currentData.encounterProto,
        };
    }
    getReferenceData() {
        if (this.referenceData == null) {
            return null;
        }
        // Defensive copy.
        return {
            simResult: this.referenceData.simResult,
            settings: JSON.parse(JSON.stringify(this.referenceData.settings)),
            raidProto: this.referenceData.raidProto,
            encounterProto: this.referenceData.encounterProto,
        };
    }
}