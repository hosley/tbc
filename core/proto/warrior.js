import { WireType } from '/tbc/protobuf-ts/index.js';
import { UnknownFieldHandler } from '/tbc/protobuf-ts/index.js';
import { reflectionMergePartial } from '/tbc/protobuf-ts/index.js';
import { MESSAGE_TYPE } from '/tbc/protobuf-ts/index.js';
import { MessageType } from '/tbc/protobuf-ts/index.js';
// @generated message type with reflection information, may provide speed optimized methods
class WarriorTalents$Type extends MessageType {
    constructor() {
        super("proto.WarriorTalents", [
            { no: 1, name: "improved_heroic_strike", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "improved_rend", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "improved_charge", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "improved_thunder_clap", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "improved_overpower", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "anger_management", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 7, name: "deep_wounds", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "two_handed_weapon_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "impale", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 10, name: "poleaxe_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "death_wish", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 12, name: "mace_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 13, name: "sword_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "improved_disciplines", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 15, name: "blood_frenzy", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 16, name: "mortal_strike", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 17, name: "improved_mortal_strike", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 18, name: "endless_rage", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 19, name: "booming_voice", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 20, name: "cruelty", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 21, name: "unbridled_wrath", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 22, name: "improved_cleave", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 23, name: "commanding_presence", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 24, name: "dual_wield_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 25, name: "improved_execute", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 26, name: "improved_slam", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 27, name: "sweeping_strikes", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 28, name: "weapon_mastery", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 29, name: "improved_berserker_rage", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 30, name: "flurry", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 31, name: "precision", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 32, name: "bloodthirst", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 33, name: "improved_whirlwind", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 34, name: "improved_berserker_stance", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 35, name: "rampage", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 36, name: "improved_bloodrage", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 37, name: "tactical_mastery", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 38, name: "defiance", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 39, name: "improved_sunder_armor", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 40, name: "one_handed_weapon_specialization", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 41, name: "shield_slam", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 42, name: "focused_rage", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 43, name: "vitality", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 44, name: "devastate", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = { improvedHeroicStrike: 0, improvedRend: 0, improvedCharge: 0, improvedThunderClap: 0, improvedOverpower: 0, angerManagement: false, deepWounds: 0, twoHandedWeaponSpecialization: 0, impale: 0, poleaxeSpecialization: 0, deathWish: false, maceSpecialization: 0, swordSpecialization: 0, improvedDisciplines: 0, bloodFrenzy: 0, mortalStrike: false, improvedMortalStrike: 0, endlessRage: false, boomingVoice: 0, cruelty: 0, unbridledWrath: 0, improvedCleave: 0, commandingPresence: 0, dualWieldSpecialization: 0, improvedExecute: 0, improvedSlam: 0, sweepingStrikes: false, weaponMastery: 0, improvedBerserkerRage: 0, flurry: 0, precision: 0, bloodthirst: false, improvedWhirlwind: 0, improvedBerserkerStance: 0, rampage: false, improvedBloodrage: 0, tacticalMastery: 0, defiance: 0, improvedSunderArmor: 0, oneHandedWeaponSpecialization: 0, shieldSlam: false, focusedRage: 0, vitality: 0, devastate: false };
        Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 improved_heroic_strike */ 1:
                    message.improvedHeroicStrike = reader.int32();
                    break;
                case /* int32 improved_rend */ 2:
                    message.improvedRend = reader.int32();
                    break;
                case /* int32 improved_charge */ 3:
                    message.improvedCharge = reader.int32();
                    break;
                case /* int32 improved_thunder_clap */ 4:
                    message.improvedThunderClap = reader.int32();
                    break;
                case /* int32 improved_overpower */ 5:
                    message.improvedOverpower = reader.int32();
                    break;
                case /* bool anger_management */ 6:
                    message.angerManagement = reader.bool();
                    break;
                case /* int32 deep_wounds */ 7:
                    message.deepWounds = reader.int32();
                    break;
                case /* int32 two_handed_weapon_specialization */ 8:
                    message.twoHandedWeaponSpecialization = reader.int32();
                    break;
                case /* int32 impale */ 9:
                    message.impale = reader.int32();
                    break;
                case /* int32 poleaxe_specialization */ 10:
                    message.poleaxeSpecialization = reader.int32();
                    break;
                case /* bool death_wish */ 11:
                    message.deathWish = reader.bool();
                    break;
                case /* int32 mace_specialization */ 12:
                    message.maceSpecialization = reader.int32();
                    break;
                case /* int32 sword_specialization */ 13:
                    message.swordSpecialization = reader.int32();
                    break;
                case /* int32 improved_disciplines */ 14:
                    message.improvedDisciplines = reader.int32();
                    break;
                case /* int32 blood_frenzy */ 15:
                    message.bloodFrenzy = reader.int32();
                    break;
                case /* bool mortal_strike */ 16:
                    message.mortalStrike = reader.bool();
                    break;
                case /* int32 improved_mortal_strike */ 17:
                    message.improvedMortalStrike = reader.int32();
                    break;
                case /* bool endless_rage */ 18:
                    message.endlessRage = reader.bool();
                    break;
                case /* int32 booming_voice */ 19:
                    message.boomingVoice = reader.int32();
                    break;
                case /* int32 cruelty */ 20:
                    message.cruelty = reader.int32();
                    break;
                case /* int32 unbridled_wrath */ 21:
                    message.unbridledWrath = reader.int32();
                    break;
                case /* int32 improved_cleave */ 22:
                    message.improvedCleave = reader.int32();
                    break;
                case /* int32 commanding_presence */ 23:
                    message.commandingPresence = reader.int32();
                    break;
                case /* int32 dual_wield_specialization */ 24:
                    message.dualWieldSpecialization = reader.int32();
                    break;
                case /* int32 improved_execute */ 25:
                    message.improvedExecute = reader.int32();
                    break;
                case /* int32 improved_slam */ 26:
                    message.improvedSlam = reader.int32();
                    break;
                case /* bool sweeping_strikes */ 27:
                    message.sweepingStrikes = reader.bool();
                    break;
                case /* int32 weapon_mastery */ 28:
                    message.weaponMastery = reader.int32();
                    break;
                case /* int32 improved_berserker_rage */ 29:
                    message.improvedBerserkerRage = reader.int32();
                    break;
                case /* int32 flurry */ 30:
                    message.flurry = reader.int32();
                    break;
                case /* int32 precision */ 31:
                    message.precision = reader.int32();
                    break;
                case /* bool bloodthirst */ 32:
                    message.bloodthirst = reader.bool();
                    break;
                case /* int32 improved_whirlwind */ 33:
                    message.improvedWhirlwind = reader.int32();
                    break;
                case /* int32 improved_berserker_stance */ 34:
                    message.improvedBerserkerStance = reader.int32();
                    break;
                case /* bool rampage */ 35:
                    message.rampage = reader.bool();
                    break;
                case /* int32 improved_bloodrage */ 36:
                    message.improvedBloodrage = reader.int32();
                    break;
                case /* int32 tactical_mastery */ 37:
                    message.tacticalMastery = reader.int32();
                    break;
                case /* int32 defiance */ 38:
                    message.defiance = reader.int32();
                    break;
                case /* int32 improved_sunder_armor */ 39:
                    message.improvedSunderArmor = reader.int32();
                    break;
                case /* int32 one_handed_weapon_specialization */ 40:
                    message.oneHandedWeaponSpecialization = reader.int32();
                    break;
                case /* bool shield_slam */ 41:
                    message.shieldSlam = reader.bool();
                    break;
                case /* int32 focused_rage */ 42:
                    message.focusedRage = reader.int32();
                    break;
                case /* int32 vitality */ 43:
                    message.vitality = reader.int32();
                    break;
                case /* bool devastate */ 44:
                    message.devastate = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 improved_heroic_strike = 1; */
        if (message.improvedHeroicStrike !== 0)
            writer.tag(1, WireType.Varint).int32(message.improvedHeroicStrike);
        /* int32 improved_rend = 2; */
        if (message.improvedRend !== 0)
            writer.tag(2, WireType.Varint).int32(message.improvedRend);
        /* int32 improved_charge = 3; */
        if (message.improvedCharge !== 0)
            writer.tag(3, WireType.Varint).int32(message.improvedCharge);
        /* int32 improved_thunder_clap = 4; */
        if (message.improvedThunderClap !== 0)
            writer.tag(4, WireType.Varint).int32(message.improvedThunderClap);
        /* int32 improved_overpower = 5; */
        if (message.improvedOverpower !== 0)
            writer.tag(5, WireType.Varint).int32(message.improvedOverpower);
        /* bool anger_management = 6; */
        if (message.angerManagement !== false)
            writer.tag(6, WireType.Varint).bool(message.angerManagement);
        /* int32 deep_wounds = 7; */
        if (message.deepWounds !== 0)
            writer.tag(7, WireType.Varint).int32(message.deepWounds);
        /* int32 two_handed_weapon_specialization = 8; */
        if (message.twoHandedWeaponSpecialization !== 0)
            writer.tag(8, WireType.Varint).int32(message.twoHandedWeaponSpecialization);
        /* int32 impale = 9; */
        if (message.impale !== 0)
            writer.tag(9, WireType.Varint).int32(message.impale);
        /* int32 poleaxe_specialization = 10; */
        if (message.poleaxeSpecialization !== 0)
            writer.tag(10, WireType.Varint).int32(message.poleaxeSpecialization);
        /* bool death_wish = 11; */
        if (message.deathWish !== false)
            writer.tag(11, WireType.Varint).bool(message.deathWish);
        /* int32 mace_specialization = 12; */
        if (message.maceSpecialization !== 0)
            writer.tag(12, WireType.Varint).int32(message.maceSpecialization);
        /* int32 sword_specialization = 13; */
        if (message.swordSpecialization !== 0)
            writer.tag(13, WireType.Varint).int32(message.swordSpecialization);
        /* int32 improved_disciplines = 14; */
        if (message.improvedDisciplines !== 0)
            writer.tag(14, WireType.Varint).int32(message.improvedDisciplines);
        /* int32 blood_frenzy = 15; */
        if (message.bloodFrenzy !== 0)
            writer.tag(15, WireType.Varint).int32(message.bloodFrenzy);
        /* bool mortal_strike = 16; */
        if (message.mortalStrike !== false)
            writer.tag(16, WireType.Varint).bool(message.mortalStrike);
        /* int32 improved_mortal_strike = 17; */
        if (message.improvedMortalStrike !== 0)
            writer.tag(17, WireType.Varint).int32(message.improvedMortalStrike);
        /* bool endless_rage = 18; */
        if (message.endlessRage !== false)
            writer.tag(18, WireType.Varint).bool(message.endlessRage);
        /* int32 booming_voice = 19; */
        if (message.boomingVoice !== 0)
            writer.tag(19, WireType.Varint).int32(message.boomingVoice);
        /* int32 cruelty = 20; */
        if (message.cruelty !== 0)
            writer.tag(20, WireType.Varint).int32(message.cruelty);
        /* int32 unbridled_wrath = 21; */
        if (message.unbridledWrath !== 0)
            writer.tag(21, WireType.Varint).int32(message.unbridledWrath);
        /* int32 improved_cleave = 22; */
        if (message.improvedCleave !== 0)
            writer.tag(22, WireType.Varint).int32(message.improvedCleave);
        /* int32 commanding_presence = 23; */
        if (message.commandingPresence !== 0)
            writer.tag(23, WireType.Varint).int32(message.commandingPresence);
        /* int32 dual_wield_specialization = 24; */
        if (message.dualWieldSpecialization !== 0)
            writer.tag(24, WireType.Varint).int32(message.dualWieldSpecialization);
        /* int32 improved_execute = 25; */
        if (message.improvedExecute !== 0)
            writer.tag(25, WireType.Varint).int32(message.improvedExecute);
        /* int32 improved_slam = 26; */
        if (message.improvedSlam !== 0)
            writer.tag(26, WireType.Varint).int32(message.improvedSlam);
        /* bool sweeping_strikes = 27; */
        if (message.sweepingStrikes !== false)
            writer.tag(27, WireType.Varint).bool(message.sweepingStrikes);
        /* int32 weapon_mastery = 28; */
        if (message.weaponMastery !== 0)
            writer.tag(28, WireType.Varint).int32(message.weaponMastery);
        /* int32 improved_berserker_rage = 29; */
        if (message.improvedBerserkerRage !== 0)
            writer.tag(29, WireType.Varint).int32(message.improvedBerserkerRage);
        /* int32 flurry = 30; */
        if (message.flurry !== 0)
            writer.tag(30, WireType.Varint).int32(message.flurry);
        /* int32 precision = 31; */
        if (message.precision !== 0)
            writer.tag(31, WireType.Varint).int32(message.precision);
        /* bool bloodthirst = 32; */
        if (message.bloodthirst !== false)
            writer.tag(32, WireType.Varint).bool(message.bloodthirst);
        /* int32 improved_whirlwind = 33; */
        if (message.improvedWhirlwind !== 0)
            writer.tag(33, WireType.Varint).int32(message.improvedWhirlwind);
        /* int32 improved_berserker_stance = 34; */
        if (message.improvedBerserkerStance !== 0)
            writer.tag(34, WireType.Varint).int32(message.improvedBerserkerStance);
        /* bool rampage = 35; */
        if (message.rampage !== false)
            writer.tag(35, WireType.Varint).bool(message.rampage);
        /* int32 improved_bloodrage = 36; */
        if (message.improvedBloodrage !== 0)
            writer.tag(36, WireType.Varint).int32(message.improvedBloodrage);
        /* int32 tactical_mastery = 37; */
        if (message.tacticalMastery !== 0)
            writer.tag(37, WireType.Varint).int32(message.tacticalMastery);
        /* int32 defiance = 38; */
        if (message.defiance !== 0)
            writer.tag(38, WireType.Varint).int32(message.defiance);
        /* int32 improved_sunder_armor = 39; */
        if (message.improvedSunderArmor !== 0)
            writer.tag(39, WireType.Varint).int32(message.improvedSunderArmor);
        /* int32 one_handed_weapon_specialization = 40; */
        if (message.oneHandedWeaponSpecialization !== 0)
            writer.tag(40, WireType.Varint).int32(message.oneHandedWeaponSpecialization);
        /* bool shield_slam = 41; */
        if (message.shieldSlam !== false)
            writer.tag(41, WireType.Varint).bool(message.shieldSlam);
        /* int32 focused_rage = 42; */
        if (message.focusedRage !== 0)
            writer.tag(42, WireType.Varint).int32(message.focusedRage);
        /* int32 vitality = 43; */
        if (message.vitality !== 0)
            writer.tag(43, WireType.Varint).int32(message.vitality);
        /* bool devastate = 44; */
        if (message.devastate !== false)
            writer.tag(44, WireType.Varint).bool(message.devastate);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.WarriorTalents
 */
export const WarriorTalents = new WarriorTalents$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Warrior$Type extends MessageType {
    constructor() {
        super("proto.Warrior", [
            { no: 1, name: "rotation", kind: "message", T: () => Warrior_Rotation },
            { no: 2, name: "talents", kind: "message", T: () => WarriorTalents },
            { no: 3, name: "options", kind: "message", T: () => Warrior_Options }
        ]);
    }
    create(value) {
        const message = {};
        Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* proto.Warrior.Rotation rotation */ 1:
                    message.rotation = Warrior_Rotation.internalBinaryRead(reader, reader.uint32(), options, message.rotation);
                    break;
                case /* proto.WarriorTalents talents */ 2:
                    message.talents = WarriorTalents.internalBinaryRead(reader, reader.uint32(), options, message.talents);
                    break;
                case /* proto.Warrior.Options options */ 3:
                    message.options = Warrior_Options.internalBinaryRead(reader, reader.uint32(), options, message.options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* proto.Warrior.Rotation rotation = 1; */
        if (message.rotation)
            Warrior_Rotation.internalBinaryWrite(message.rotation, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* proto.WarriorTalents talents = 2; */
        if (message.talents)
            WarriorTalents.internalBinaryWrite(message.talents, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* proto.Warrior.Options options = 3; */
        if (message.options)
            Warrior_Options.internalBinaryWrite(message.options, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.Warrior
 */
export const Warrior = new Warrior$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Warrior_Rotation$Type extends MessageType {
    constructor() {
        super("proto.Warrior.Rotation", []);
    }
    create(value) {
        const message = {};
        Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        return target ?? this.create();
    }
    internalBinaryWrite(message, writer, options) {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.Warrior.Rotation
 */
export const Warrior_Rotation = new Warrior_Rotation$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Warrior_Options$Type extends MessageType {
    constructor() {
        super("proto.Warrior.Options", []);
    }
    create(value) {
        const message = {};
        Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        return target ?? this.create();
    }
    internalBinaryWrite(message, writer, options) {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.Warrior.Options
 */
export const Warrior_Options = new Warrior_Options$Type();