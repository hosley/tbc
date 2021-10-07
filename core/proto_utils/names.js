import { ItemSlot } from '/tbc/core/proto/common.js';
import { Race } from '/tbc/core/proto/common.js';
import { Stat } from '/tbc/core/proto/common.js';
export const raceNames = {
    [Race.RaceUnknown]: 'None',
    [Race.RaceBloodElf]: 'Blood Elf',
    [Race.RaceDraenei]: 'Draenei',
    [Race.RaceDwarf]: 'Dwarf',
    [Race.RaceGnome]: 'Gnome',
    [Race.RaceHuman]: 'Human',
    [Race.RaceNightElf]: 'Night Elf',
    [Race.RaceOrc]: 'Orc',
    [Race.RaceTauren]: 'Tauren',
    [Race.RaceTroll10]: 'Troll (+10% Haste)',
    [Race.RaceTroll30]: 'Troll (+30% Haste)',
    [Race.RaceUndead]: 'Undead',
};
export const statNames = {
    [Stat.StatStrength]: 'Strength',
    [Stat.StatAgility]: 'Agility',
    [Stat.StatStamina]: 'Stamina',
    [Stat.StatIntellect]: 'Intellect',
    [Stat.StatSpirit]: 'Spirit',
    [Stat.StatSpellPower]: 'Spell Dmg',
    [Stat.StatHealingPower]: 'Healing Power',
    [Stat.StatArcaneSpellPower]: 'Arcane Dmg',
    [Stat.StatFireSpellPower]: 'Fire Dmg',
    [Stat.StatFrostSpellPower]: 'Frost Dmg',
    [Stat.StatHolySpellPower]: 'Holy Dmg',
    [Stat.StatNatureSpellPower]: 'Nature Dmg',
    [Stat.StatShadowSpellPower]: 'Shadow Dmg',
    [Stat.StatMP5]: 'MP5',
    [Stat.StatSpellHit]: 'Spell Hit',
    [Stat.StatSpellCrit]: 'Spell Crit',
    [Stat.StatSpellHaste]: 'Spell Haste',
    [Stat.StatSpellPenetration]: 'Spell Pen',
    [Stat.StatAttackPower]: 'Attack Power',
    [Stat.StatMeleeHit]: 'Hit',
    [Stat.StatMeleeCrit]: 'Crit',
    [Stat.StatMeleeHaste]: 'Haste',
    [Stat.StatArmorPenetration]: 'Armor Pen',
    [Stat.StatExpertise]: 'Expertise',
    [Stat.StatMana]: 'Mana',
    [Stat.StatEnergy]: 'Energy',
    [Stat.StatRage]: 'Rage',
    [Stat.StatArmor]: 'Armor',
};
export const slotNames = {
    [ItemSlot.ItemSlotHead]: 'Head',
    [ItemSlot.ItemSlotNeck]: 'Neck',
    [ItemSlot.ItemSlotShoulder]: 'Shoulders',
    [ItemSlot.ItemSlotBack]: 'Back',
    [ItemSlot.ItemSlotChest]: 'Chest',
    [ItemSlot.ItemSlotWrist]: 'Wrist',
    [ItemSlot.ItemSlotHands]: 'Hands',
    [ItemSlot.ItemSlotWaist]: 'Waist',
    [ItemSlot.ItemSlotLegs]: 'Legs',
    [ItemSlot.ItemSlotFeet]: 'Feet',
    [ItemSlot.ItemSlotFinger1]: 'Finger 1',
    [ItemSlot.ItemSlotFinger2]: 'Finger 2',
    [ItemSlot.ItemSlotTrinket1]: 'Trinket 1',
    [ItemSlot.ItemSlotTrinket2]: 'Trinket 2',
    [ItemSlot.ItemSlotMainHand]: 'Main Hand',
    [ItemSlot.ItemSlotOffHand]: 'Off Hand',
    [ItemSlot.ItemSlotRanged]: 'Ranged',
};
export const enchantDescriptions = new Map();
enchantDescriptions.set(29191, '+22 Spell Damage and 14 Spell Hit Rating');