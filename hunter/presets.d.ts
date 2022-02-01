import { Consumes } from '/tbc/core/proto/common.js';
import { EquipmentSpec } from '/tbc/core/proto/common.js';
import { Hunter_Rotation as HunterRotation, Hunter_Options as HunterOptions } from '/tbc/core/proto/hunter.js';
export declare const BeastMasteryTalents: {
    name: string;
    data: string;
};
export declare const MarksmanTalents: {
    name: string;
    data: string;
};
export declare const SurvivalTalents: {
    name: string;
    data: string;
};
export declare const DefaultRotation: HunterRotation;
export declare const DefaultOptions: HunterOptions;
export declare const DefaultConsumes: Consumes;
export declare const P1_BM_PRESET: {
    name: string;
    tooltip: string;
    gear: EquipmentSpec;
};