import { RaidBuffs } from '/tbc/core/proto/common.js';
import { PartyBuffs } from '/tbc/core/proto/common.js';
import { IndividualBuffs } from '/tbc/core/proto/common.js';
import { Encounter } from '/tbc/core/proto/common.js';
import { Item } from '/tbc/core/proto/common.js';
import { GearListRequest } from '/tbc/core/proto/api.js';
import { EquippedItem } from '/tbc/core/proto_utils/equipped_item.js';
import { Gear } from '/tbc/core/proto_utils/gear.js';
import { getEligibleItemSlots } from '/tbc/core/proto_utils/utils.js';
import { getEligibleEnchantSlots } from '/tbc/core/proto_utils/utils.js';
import { gemEligibleForSocket } from '/tbc/core/proto_utils/utils.js';
import { gemMatchesSocket } from '/tbc/core/proto_utils/utils.js';
import { TypedEvent } from './typed_event.js';
import { WorkerPool } from './worker_pool.js';
// Core Sim module which deals only with api types, no UI-related stuff.
export class Sim extends WorkerPool {
    constructor(config) {
        super(3);
        this.phaseChangeEmitter = new TypedEvent();
        this.raidBuffsChangeEmitter = new TypedEvent();
        this.partyBuffsChangeEmitter = new TypedEvent();
        this.individualBuffsChangeEmitter = new TypedEvent();
        this.encounterChangeEmitter = new TypedEvent();
        this.numTargetsChangeEmitter = new TypedEvent();
        // Emits when any of the above emitters emit.
        this.changeEmitter = new TypedEvent();
        // Database
        this._items = {};
        this._enchants = {};
        this._gems = {};
        this.gearListEmitter = new TypedEvent();
        this._init = false;
        this._phase = config.defaults.phase;
        this._raidBuffs = config.defaults.raidBuffs;
        this._partyBuffs = config.defaults.partyBuffs;
        this._individualBuffs = config.defaults.individualBuffs;
        this._encounter = config.defaults.encounter;
        this._numTargets = 1;
        [
            this.raidBuffsChangeEmitter,
            this.partyBuffsChangeEmitter,
            this.individualBuffsChangeEmitter,
            this.encounterChangeEmitter,
            this.numTargetsChangeEmitter,
            this.phaseChangeEmitter,
        ].forEach(emitter => emitter.on(() => this.changeEmitter.emit()));
    }
    async init(spec) {
        if (this._init)
            return;
        this._init = true;
        const result = await this.getGearList(GearListRequest.create({
            spec: spec,
        }));
        result.items.forEach(item => this._items[item.id] = item);
        result.enchants.forEach(enchant => this._enchants[enchant.id] = enchant);
        result.gems.forEach(gem => this._gems[gem.id] = gem);
        this.gearListEmitter.emit();
    }
    getItems(slot) {
        let items = Object.values(this._items);
        if (slot != undefined) {
            items = items.filter(item => getEligibleItemSlots(item).includes(slot));
        }
        return items;
    }
    getEnchants(slot) {
        let enchants = Object.values(this._enchants);
        if (slot != undefined) {
            enchants = enchants.filter(enchant => getEligibleEnchantSlots(enchant).includes(slot));
        }
        return enchants;
    }
    getGems(socketColor) {
        let gems = Object.values(this._gems);
        if (socketColor) {
            gems = gems.filter(gem => gemEligibleForSocket(gem, socketColor));
        }
        return gems;
    }
    getMatchingGems(socketColor) {
        return Object.values(this._gems).filter(gem => gemMatchesSocket(gem, socketColor));
    }
    getPhase() {
        return this._phase;
    }
    setPhase(newPhase) {
        if (newPhase != this._phase) {
            this._phase = newPhase;
            this.phaseChangeEmitter.emit();
        }
    }
    getRaidBuffs() {
        // Make a defensive copy
        return RaidBuffs.clone(this._raidBuffs);
    }
    setRaidBuffs(newRaidBuffs) {
        if (RaidBuffs.equals(this._raidBuffs, newRaidBuffs))
            return;
        // Make a defensive copy
        this._raidBuffs = RaidBuffs.clone(newRaidBuffs);
        this.raidBuffsChangeEmitter.emit();
    }
    getPartyBuffs() {
        // Make a defensive copy
        return PartyBuffs.clone(this._partyBuffs);
    }
    setPartyBuffs(newPartyBuffs) {
        if (PartyBuffs.equals(this._partyBuffs, newPartyBuffs))
            return;
        // Make a defensive copy
        this._partyBuffs = PartyBuffs.clone(newPartyBuffs);
        this.partyBuffsChangeEmitter.emit();
    }
    getIndividualBuffs() {
        // Make a defensive copy
        return IndividualBuffs.clone(this._individualBuffs);
    }
    setIndividualBuffs(newIndividualBuffs) {
        if (IndividualBuffs.equals(this._individualBuffs, newIndividualBuffs))
            return;
        // Make a defensive copy
        this._individualBuffs = IndividualBuffs.clone(newIndividualBuffs);
        this.individualBuffsChangeEmitter.emit();
    }
    getEncounter() {
        // Make a defensive copy
        return Encounter.clone(this._encounter);
    }
    setEncounter(newEncounter) {
        if (Encounter.equals(this._encounter, newEncounter))
            return;
        // Make a defensive copy
        this._encounter = Encounter.clone(newEncounter);
        this.encounterChangeEmitter.emit();
    }
    getNumTargets() {
        return this._numTargets;
    }
    setNumTargets(newNumTargets) {
        if (newNumTargets == this._numTargets)
            return;
        this._numTargets = newNumTargets;
        this.numTargetsChangeEmitter.emit();
    }
    lookupItemSpec(itemSpec) {
        const item = this._items[itemSpec.id];
        if (!item)
            return null;
        const enchant = this._enchants[itemSpec.enchant] || null;
        const gems = itemSpec.gems.map(gemId => this._gems[gemId] || null);
        return new EquippedItem(item, enchant, gems);
    }
    lookupEquipmentSpec(equipSpec) {
        // EquipmentSpec is supposed to be indexed by slot, but here we assume
        // it isn't just in case.
        const gearMap = {};
        equipSpec.items.forEach(itemSpec => {
            const item = this.lookupItemSpec(itemSpec);
            if (!item)
                return;
            const itemSlots = getEligibleItemSlots(item.item);
            const assignedSlot = itemSlots.find(slot => !gearMap[slot]);
            if (assignedSlot == null)
                throw new Error('No slots left to equip ' + Item.toJsonString(item.item));
            gearMap[assignedSlot] = item;
        });
        return new Gear(gearMap);
    }
    // Returns JSON representing all the current values.
    toJson() {
        return {
            'raidBuffs': RaidBuffs.toJson(this._raidBuffs),
            'partyBuffs': PartyBuffs.toJson(this._partyBuffs),
            'individualBuffs': IndividualBuffs.toJson(this._individualBuffs),
            'encounter': Encounter.toJson(this._encounter),
            'numTargets': this._numTargets,
        };
    }
    // Set all the current values, assumes obj is the same type returned by toJson().
    fromJson(obj) {
        try {
            this.setRaidBuffs(RaidBuffs.fromJson(obj['raidBuffs']));
        }
        catch (e) {
            console.warn('Failed to parse raid buffs: ' + e);
        }
        try {
            this.setPartyBuffs(PartyBuffs.fromJson(obj['partyBuffs']));
        }
        catch (e) {
            console.warn('Failed to parse party buffs: ' + e);
        }
        try {
            this.setIndividualBuffs(IndividualBuffs.fromJson(obj['individualBuffs']));
        }
        catch (e) {
            console.warn('Failed to parse individual buffs: ' + e);
        }
        try {
            this.setEncounter(Encounter.fromJson(obj['encounter']));
        }
        catch (e) {
            console.warn('Failed to parse encounter: ' + e);
        }
        const parsedNumTargets = parseInt(obj['numTargets']);
        if (!isNaN(parsedNumTargets) && parsedNumTargets != 0) {
            this.setNumTargets(parsedNumTargets);
        }
    }
}