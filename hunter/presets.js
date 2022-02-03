import { Consumes } from '/tbc/core/proto/common.js';
import { EquipmentSpec } from '/tbc/core/proto/common.js';
import { ItemSpec } from '/tbc/core/proto/common.js';
import { Potions } from '/tbc/core/proto/common.js';
import { Hunter_Rotation as HunterRotation, Hunter_Options as HunterOptions, Hunter_Options_Ammo as Ammo, Hunter_Options_QuiverBonus as QuiverBonus, Hunter_Options_PetType as PetType, } from '/tbc/core/proto/hunter.js';
import * as Enchants from '/tbc/core/constants/enchants.js';
import * as Gems from '/tbc/core/proto_utils/gems.js';
import * as Tooltips from '/tbc/core/constants/tooltips.js';
// Preset options for this spec.
// Eventually we will import these values for the raid sim too, so its good to
// keep them in a separate file.
// Default talents. Uses the wowhead calculator format, make the talents on
// https://tbc.wowhead.com/talent-calc and copy the numbers in the url.
export const BeastMasteryTalents = {
    name: 'BM',
    data: '502030015150121531051-0505201205',
};
export const MarksmanTalents = {
    name: 'Marksman',
    data: '51200200502-0551201205013253135',
};
export const SurvivalTalents = {
    name: 'Survival',
    data: '502-0550201205-333200022003223005103',
};
export const DefaultRotation = HunterRotation.create({
    useMultiShot: true,
    meleeWeave: false,
    viperStartManaPercent: 0.2,
    viperStopManaPercent: 0.4,
});
export const DefaultOptions = HunterOptions.create({
    quiverBonus: QuiverBonus.Speed15,
    ammo: Ammo.AdamantiteStinger,
    petType: PetType.Ravager,
    latencyMs: 30,
});
export const DefaultConsumes = Consumes.create({
    defaultPotion: Potions.HastePotion,
    flaskOfRelentlessAssault: true,
});
export const P1_BM_PRESET = {
    name: 'P1 BM Preset',
    tooltip: Tooltips.BASIC_BIS_DISCLAIMER,
    gear: EquipmentSpec.create({
        items: [
            ItemSpec.create({
                id: 28275,
                enchant: Enchants.GLYPH_OF_FEROCITY,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.RELENTLESS_EARTHSTORM_DIAMOND,
                ],
            }),
            ItemSpec.create({
                id: 29381, // Choker of Vile Intent
            }),
            ItemSpec.create({
                id: 27801,
                enchant: Enchants.GREATER_INSCRIPTION_OF_VENGEANCE,
                gems: [
                    Gems.WICKED_NOBLE_TOPAZ,
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 24259,
                enchant: Enchants.CLOAK_GREATER_AGILITY,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 28228,
                enchant: Enchants.CHEST_EXCEPTIONAL_STATS,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.SHIFTING_NIGHTSEYE,
                ],
            }),
            ItemSpec.create({
                id: 29246,
                enchant: Enchants.WRIST_ASSAULT,
            }),
            ItemSpec.create({
                id: 27474,
                enchant: Enchants.GLOVES_MAJOR_AGILITY,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 28828,
                gems: [
                    Gems.SHIFTING_NIGHTSEYE,
                    Gems.WICKED_NOBLE_TOPAZ,
                ],
            }),
            ItemSpec.create({
                id: 30739,
                enchant: Enchants.NETHERCOBRA_LEG_ARMOR,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 28545,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.GLINTING_NOBLE_TOPAZ,
                ],
                enchant: Enchants.FEET_CATS_SWIFTNESS,
            }),
            ItemSpec.create({
                id: 28757, // Ring of a Thousand Marks
            }),
            ItemSpec.create({
                id: 28791, // Ring of the Recalcitrant
            }),
            ItemSpec.create({
                id: 28830, // Dragonspine Trophy
            }),
            ItemSpec.create({
                id: 29383, // Bloodlust Brooch
            }),
            ItemSpec.create({
                id: 28435,
                enchant: Enchants.WEAPON_2H_MAJOR_AGILITY,
            }),
            ItemSpec.create({
                id: 28772,
                enchant: Enchants.STABILIZED_ETERNIUM_SCOPE,
            }),
        ],
    }),
};
export const P2_BM_PRESET = {
    name: 'P2 BM Preset',
    tooltip: Tooltips.BASIC_BIS_DISCLAIMER,
    gear: EquipmentSpec.create({
        items: [
            ItemSpec.create({
                id: 30141,
                enchant: Enchants.GLYPH_OF_FEROCITY,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.RELENTLESS_EARTHSTORM_DIAMOND,
                ],
            }),
            ItemSpec.create({
                id: 30017, // Telonicus's Pendant of Mayhem
            }),
            ItemSpec.create({
                id: 30143,
                enchant: Enchants.GREATER_INSCRIPTION_OF_VENGEANCE,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 29994,
                enchant: Enchants.CLOAK_GREATER_AGILITY,
            }),
            ItemSpec.create({
                id: 30139,
                enchant: Enchants.CHEST_EXCEPTIONAL_STATS,
                gems: [
                    Gems.SHIFTING_NIGHTSEYE,
                    Gems.WICKED_NOBLE_TOPAZ,
                    Gems.WICKED_NOBLE_TOPAZ,
                ],
            }),
            ItemSpec.create({
                id: 29966,
                enchant: Enchants.WRIST_ASSAULT,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 30140,
                enchant: Enchants.GLOVES_MAJOR_AGILITY,
            }),
            ItemSpec.create({
                id: 30040,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                ],
            }),
            ItemSpec.create({
                id: 29995,
                enchant: Enchants.NETHERCOBRA_LEG_ARMOR,
            }),
            ItemSpec.create({
                id: 30104,
                gems: [
                    Gems.SHIFTING_NIGHTSEYE,
                    Gems.DELICATE_LIVING_RUBY,
                ],
                enchant: Enchants.FEET_CATS_SWIFTNESS,
            }),
            ItemSpec.create({
                id: 29997, // Band of the Ranger-General
            }),
            ItemSpec.create({
                id: 28791, // Ring of the Recalcitrant
            }),
            ItemSpec.create({
                id: 28830, // Dragonspine Trophy
            }),
            ItemSpec.create({
                id: 29383, // Bloodlust Brooch
            }),
            ItemSpec.create({
                id: 29993,
                gems: [
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                    Gems.DELICATE_LIVING_RUBY,
                ],
                enchant: Enchants.WEAPON_2H_MAJOR_AGILITY,
            }),
            ItemSpec.create({
                id: 30105,
                enchant: Enchants.STABILIZED_ETERNIUM_SCOPE,
            }),
        ],
    }),
};
export const P3_BM_PRESET = {
    name: 'P3 BM Preset',
    tooltip: Tooltips.BASIC_BIS_DISCLAIMER,
    gear: EquipmentSpec.create({
        items: [
            ItemSpec.create({
                id: 32235,
                enchant: Enchants.GLYPH_OF_FEROCITY,
                gems: [
                    Gems.RELENTLESS_EARTHSTORM_DIAMOND,
                    Gems.DELICATE_CRIMSON_SPINEL,
                ],
            }),
            ItemSpec.create({
                id: 32591, // Choker of Serrated Blades
            }),
            ItemSpec.create({
                id: 31006,
                enchant: Enchants.GREATER_INSCRIPTION_OF_VENGEANCE,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                    Gems.DELICATE_CRIMSON_SPINEL,
                ],
            }),
            ItemSpec.create({
                id: 32323,
                enchant: Enchants.CLOAK_GREATER_AGILITY,
            }),
            ItemSpec.create({
                id: 31004,
                enchant: Enchants.CHEST_EXCEPTIONAL_STATS,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                    Gems.JAGGED_SEASPRAY_EMERALD,
                    Gems.JAGGED_SEASPRAY_EMERALD,
                ],
            }),
            ItemSpec.create({
                id: 32324,
                enchant: Enchants.WRIST_ASSAULT,
                gems: [
                    Gems.WICKED_PYRESTONE,
                ],
            }),
            ItemSpec.create({
                id: 31001,
                enchant: Enchants.GLOVES_MAJOR_AGILITY,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                ],
            }),
            ItemSpec.create({
                id: 30879,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                    Gems.DELICATE_CRIMSON_SPINEL,
                ],
            }),
            ItemSpec.create({
                id: 31005,
                enchant: Enchants.NETHERCOBRA_LEG_ARMOR,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                ],
            }),
            ItemSpec.create({
                id: 32366,
                gems: [
                    Gems.DELICATE_CRIMSON_SPINEL,
                    Gems.WICKED_PYRESTONE,
                ],
                enchant: Enchants.FEET_CATS_SWIFTNESS,
            }),
            ItemSpec.create({
                id: 29997, // Band of the Ranger-General
            }),
            ItemSpec.create({
                id: 29301, // Band of the Eternal Champion
            }),
            ItemSpec.create({
                id: 28830, // Dragonspine Trophy
            }),
            ItemSpec.create({
                id: 32505, // Madness of the Betrayer
            }),
            ItemSpec.create({
                id: 30901,
                enchant: Enchants.WEAPON_GREATER_AGILITY,
            }),
            ItemSpec.create({
                id: 30881,
                enchant: Enchants.WEAPON_GREATER_AGILITY,
            }),
            ItemSpec.create({
                id: 30906,
                enchant: Enchants.STABILIZED_ETERNIUM_SCOPE,
            }),
        ],
    }),
};