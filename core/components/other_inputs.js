import { EnumPicker } from '/tbc/core/components/enum_picker.js';
import { Potions } from '/tbc/core/proto/common.js';
export function makePhaseSelector(parent, sim) {
    return new EnumPicker(parent, sim, {
        values: [
            { name: 'Phase 1', value: 1 },
            { name: 'Phase 2', value: 2 },
            { name: 'Phase 3', value: 3 },
            { name: 'Phase 4', value: 4 },
            { name: 'Phase 5', value: 5 },
        ],
        changedEvent: (sim) => sim.phaseChangeEmitter,
        getValue: (sim) => sim.getPhase(),
        setValue: (sim, newValue) => {
            sim.setPhase(newValue);
        },
    });
}
export const StartingPotion = {
    type: 'enum',
    cssClass: 'starting-potion-picker',
    getModObject: (simUI) => simUI.player,
    config: {
        label: 'Starting Potion',
        labelTooltip: 'If set, this potion will be used instead of the default potion for the first few uses.',
        values: [
            { name: 'None', value: Potions.UnknownPotion },
            { name: 'Destruction', value: Potions.DestructionPotion },
            { name: 'Super Mana', value: Potions.SuperManaPotion },
        ],
        changedEvent: (player) => player.consumesChangeEmitter,
        getValue: (player) => player.getConsumes().startingPotion,
        setValue: (player, newValue) => {
            const newConsumes = player.getConsumes();
            newConsumes.startingPotion = newValue;
            player.setConsumes(newConsumes);
        },
    },
};
export const NumStartingPotions = {
    type: 'number',
    cssClass: 'num-starting-potions-picker',
    getModObject: (simUI) => simUI.player,
    config: {
        label: '# to use',
        labelTooltip: 'The number of starting potions to use before going back to the default potion.',
        changedEvent: (player) => player.consumesChangeEmitter,
        getValue: (player) => player.getConsumes().numStartingPotions,
        setValue: (player, newValue) => {
            const newConsumes = player.getConsumes();
            newConsumes.numStartingPotions = newValue;
            player.setConsumes(newConsumes);
        },
        enableWhen: (player) => player.getConsumes().startingPotion != Potions.UnknownPotion,
    },
};
export const ShadowPriestDPS = {
    type: 'number',
    cssClass: 'shadow-priest-dps-picker',
    getModObject: (simUI) => simUI.player,
    config: {
        label: 'Shadow Priest DPS',
        changedEvent: (player) => player.buffsChangeEmitter,
        getValue: (player) => player.getBuffs().shadowPriestDps,
        setValue: (player, newValue) => {
            const buffs = player.getBuffs();
            buffs.shadowPriestDps = newValue;
            player.setBuffs(buffs);
        },
    },
};
export const ISBUptime = {
    type: 'number',
    cssClass: 'isb-uptime-picker',
    getModObject: (simUI) => simUI.encounter.primaryTarget,
    config: {
        label: 'ISB Uptime %',
        changedEvent: (target) => target.debuffsChangeEmitter,
        getValue: (target) => Math.round(target.getDebuffs().isbUptime * 100),
        setValue: (target, newValue) => {
            const newDebuffs = target.getDebuffs();
            newDebuffs.isbUptime = newValue / 100;
            target.setDebuffs(newDebuffs);
        },
    },
};