package core

import (
	"math"
	"time"

	"github.com/wowsims/tbc/sim/core/items"
	"github.com/wowsims/tbc/sim/core/proto"
	"github.com/wowsims/tbc/sim/core/stats"
)

// Character is a data structure to hold all the shared values that all
// class logic shares.
// All players have stats, equipment, auras, etc
type Character struct {
	ID    int
	Race  proto.Race
	Class proto.Class

	// Current gear.
	Equip items.Equipment

	// Consumables this Character will be using.
	consumes proto.Consumes

	// Stats this Character will have at the very start of each Sim iteration.
	// Includes all equipment / buffs / permanent effects but not temporary
	// effects from items / abilities.
	initialStats stats.Stats

	// Provides stat dependency management behavior.
	stats.StatDependencyManager

	// Provides aura tracking behavior.
	auraTracker

	// Provides major cooldown management behavior.
	majorCooldownManager

	// Up reference to this Character's Party.
	Party *Party

	// Whether Finalize() has been called yet for this Character.
	// All fields above this may not be altered once finalized is set.
	finalized bool

	// Current stats, including temporary effects.
	stats stats.Stats

	// pseudoStats are modifiers that aren't directly a stat
	initialPseudoStats stats.PseudoStats
	PseudoStats        stats.PseudoStats

	// Used for applying the effects of hardcast / channeled spells at a later time.
	// By definition there can be only 1 hardcast spell being cast at any moment.
	Hardcast Hardcast

	// Statistics describing the results of the sim.
	Metrics CharacterMetrics
}

func NewCharacter(player proto.Player) Character {
	character := Character{
		Race:  player.Options.Race,
		Class: player.Options.Class,
		Equip: items.ProtoToEquipment(*player.Equipment),
		PseudoStats: stats.PseudoStats{
			CastSpeedMultiplier:   1,
			SpiritRegenMultiplier: 1,
		},
		auraTracker: newAuraTracker(false),
		Metrics:     NewCharacterMetrics(),
	}

	if player.Options.Consumes != nil {
		character.consumes = *player.Options.Consumes
	}

	character.AddStats(BaseStats[BaseStatsKey{Race: character.Race, Class: character.Class}])
	character.AddStats(character.Equip.Stats())

	if player.CustomStats != nil {
		customStats := stats.Stats{}
		copy(customStats[:], player.CustomStats[:])
		character.AddStats(customStats)
	}

	// Universal stat dependencies
	character.AddStatDependency(stats.StatDependency{
		SourceStat:   stats.Agility,
		ModifiedStat: stats.Armor,
		Modifier: func(agility float64, armor float64) float64 {
			return armor + agility*2
		},
	})
	character.AddStatDependency(stats.StatDependency{
		SourceStat:   stats.Intellect,
		ModifiedStat: stats.Mana,
		Modifier: func(intellect float64, mana float64) float64 {
			// Assumes all characters have >= 20 intellect.
			// See https://wowwiki-archive.fandom.com/wiki/Base_mana.
			return mana + (20 + 15*(intellect-20))
		},
	})

	return character
}

func (character *Character) applyAllEffects(agent Agent) {
	applyRaceEffects(agent)
	character.applyItemEffects(agent)
	character.applyItemSetBonusEffects(agent)
	applyConsumeEffects(agent)
}

// Apply effects from all equipped items.
func (character *Character) applyItemEffects(agent Agent) {
	for _, eq := range character.Equip {
		applyItemEffect, ok := itemEffects[eq.ID]
		if ok {
			applyItemEffect(agent)
		}

		for _, g := range eq.Gems {
			applyGemEffect, ok := itemEffects[g.ID]
			if ok {
				applyGemEffect(agent)
			}
		}
	}
}

func (character *Character) AddStats(stat stats.Stats) {
	character.stats = character.stats.Add(stat)
}
func (character *Character) AddStat(stat stats.Stat, amount float64) {
	character.stats[stat] += amount
}
func (character *Character) GetInitialStat(stat stats.Stat) float64 {
	return character.initialStats[stat]
}
func (character *Character) GetBaseStats() stats.Stats {
	return BaseStats[BaseStatsKey{Race: character.Race, Class: character.Class}]
}
func (character *Character) GetStats() stats.Stats {
	return character.stats
}
func (character *Character) GetStat(stat stats.Stat) float64 {
	return character.stats[stat]
}
func (character *Character) BaseMana() float64 {
	return character.GetBaseStats()[stats.Mana]
}
func (character *Character) MaxMana() float64 {
	return character.GetInitialStat(stats.Mana)
}
func (character *Character) CurrentMana() float64 {
	return character.GetStat(stats.Mana)
}

// Returns whether the indicates stat is currently modified by a temporary bonus.
func (character *Character) HasTemporaryBonusForStat(stat stats.Stat) bool {
	return character.GetInitialStat(stat) != character.GetStat(stat)
}

// Returns if spell casting has any temporary increases active.
func (character *Character) HasTemporarySpellCastSpeedIncrease() bool {
	return character.HasTemporaryBonusForStat(stats.SpellHaste) ||
		character.PseudoStats.CastSpeedMultiplier != 1
}

// TODO: rename this better
func (character *Character) CastSpeed() float64 {
	return character.PseudoStats.CastSpeedMultiplier * (1 + (character.stats[stats.SpellHaste] / (HasteRatingPerHastePercent * 100)))
}

func (character *Character) AddRaidBuffs(raidBuffs *proto.RaidBuffs) {
}
func (character *Character) AddPartyBuffs(partyBuffs *proto.PartyBuffs) {
	if character.Race == proto.Race_RaceDraenei {
		class := character.Class
		if class == proto.Class_ClassHunter ||
			class == proto.Class_ClassPaladin ||
			class == proto.Class_ClassWarrior {
			partyBuffs.DraeneiRacialMelee = true
		} else if class == proto.Class_ClassMage ||
			class == proto.Class_ClassPriest ||
			class == proto.Class_ClassShaman {
			partyBuffs.DraeneiRacialCaster = true
		}
	}

	if character.consumes.Drums > 0 {
		partyBuffs.Drums = character.consumes.Drums
	}

	if character.Equip[items.ItemSlotMainHand].ID == ItemIDAtieshMage {
		partyBuffs.AtieshMage += 1
	}
	if character.Equip[items.ItemSlotMainHand].ID == ItemIDAtieshWarlock {
		partyBuffs.AtieshWarlock += 1
	}

	if character.Equip[items.ItemSlotNeck].ID == ItemIDBraidedEterniumChain {
		partyBuffs.BraidedEterniumChain = true
	}
	if character.Equip[items.ItemSlotNeck].ID == ItemIDChainOfTheTwilightOwl {
		partyBuffs.ChainOfTheTwilightOwl = true
	}
	if character.Equip[items.ItemSlotNeck].ID == ItemIDEyeOfTheNight {
		partyBuffs.EyeOfTheNight = true
	}
	if character.Equip[items.ItemSlotNeck].ID == ItemIDJadePendantOfBlasting {
		partyBuffs.JadePendantOfBlasting = true
	}
}

func (character *Character) Finalize() {
	if character.finalized {
		return
	}
	character.finalized = true

	// Make sure we dont accidentally set initial stats instead of stats.
	if !character.initialStats.Equals(stats.Stats{}) {
		panic("Initial stats may not be set before finalized!")
	}
	character.StatDependencyManager.Finalize()
	character.stats = character.ApplyStatDependencies(character.stats)

	// All stats added up to this point are part of the 'initial' stats.
	character.initialStats = character.stats
	character.initialPseudoStats = character.PseudoStats

	character.auraTracker.finalize()
	character.majorCooldownManager.finalize(character)
}

func (character *Character) reset(sim *Simulation) {
	character.stats = character.initialStats
	character.PseudoStats = character.initialPseudoStats

	character.auraTracker.reset(sim)

	character.majorCooldownManager.reset(sim)
}

// Advance moves time forward counting down auras, CDs, mana regen, etc
func (character *Character) advance(sim *Simulation, elapsedTime time.Duration) {
	// Advance CDs and Auras
	character.auraTracker.advance(sim)

	if character.Hardcast.Expires != 0 && character.Hardcast.Expires <= sim.CurrentTime {
		character.Hardcast.OnExpire(sim)
		character.Hardcast.Expires = 0
	}
}

// Returns the rate of mana regen per second from mp5.
func (character *Character) mp5ManaRegenPerSecond() float64 {
	return character.stats[stats.MP5] / 5.0
}

// Returns the rate of mana regen per second from spirit.
func (character *Character) spiritManaRegenPerSecond() float64 {
	return 0.001 + character.stats[stats.Spirit]*math.Sqrt(character.stats[stats.Intellect])*0.009327
}

// Returns the rate of mana regen per second, assuming this character is
// considered to be casting.
func (character *Character) manaRegenPerSecondWhileCasting() float64 {
	regenRate := character.mp5ManaRegenPerSecond()

	spiritRegenRate := character.spiritManaRegenPerSecond() * character.PseudoStats.SpiritRegenMultiplier
	if !character.PseudoStats.ForceFullSpiritRegen {
		spiritRegenRate *= character.PseudoStats.SpiritRegenRateCasting
	}
	regenRate += spiritRegenRate

	return regenRate
}

// Returns the rate of mana regen per second, assuming this character is
// considered to be not casting.
func (character *Character) manaRegenPerSecondWhileNotCasting() float64 {
	regenRate := character.mp5ManaRegenPerSecond()

	regenRate += character.spiritManaRegenPerSecond() * character.PseudoStats.SpiritRegenMultiplier

	return regenRate
}

func (character *Character) addMana(amount float64) {
	character.stats[stats.Mana] = MinFloat(character.stats[stats.Mana]+amount, character.MaxMana())
}

// Regenerates mana based on MP5 stat, spirit regen allowed while casting and the elapsed time.
func (character *Character) RegenManaCasting(sim *Simulation, elapsedTime time.Duration) {
	manaRegen := character.manaRegenPerSecondWhileCasting() * elapsedTime.Seconds()
	character.addMana(manaRegen)
	if sim.Log != nil {
		sim.Log(" Advanced [%0.1fs] Regenerated: %0.1f mana. Total: %0.1f\n", elapsedTime.Seconds(), manaRegen, character.CurrentMana())
	}
}

// Regenerates mana using mp5 and spirit. Will calculate time since last cast and then enable spirit regen if needed.
func (character *Character) RegenMana(sim *Simulation, elapsedTime time.Duration) {
	var regen float64
	if sim.CurrentTime-elapsedTime > character.PseudoStats.FiveSecondRuleRefreshTime {
		// Five second rule activated before the advance window started, so use full
		// spirit regen for the full duration.
		regen = character.manaRegenPerSecondWhileNotCasting() * elapsedTime.Seconds()
	} else if sim.CurrentTime > character.PseudoStats.FiveSecondRuleRefreshTime {
		// Five second rule activated sometime in the middle of the advance window,
		// so regen is a combination of casting and not-casting regen.
		notCastingRegenTime := sim.CurrentTime - character.PseudoStats.FiveSecondRuleRefreshTime // how many seconds of full spirit regen
		castingRegenTime := elapsedTime - notCastingRegenTime
		regen = (character.manaRegenPerSecondWhileNotCasting() * notCastingRegenTime.Seconds()) + (character.manaRegenPerSecondWhileCasting() * castingRegenTime.Seconds())
	} else {
		regen = character.manaRegenPerSecondWhileCasting() * elapsedTime.Seconds()
	}
	character.addMana(regen)

	if sim.Log != nil {
		sim.Log(" Advanced [%0.1fs] Regenerated: %0.1f mana. Total: %0.1f\n", elapsedTime.Seconds(), regen, character.CurrentMana())
	}
}

// Returns the amount of time this Character would need to wait in order to reach
// the desired amount of mana, via mana regen.
//
// Assumes that desiredMana > currentMana. Calculation assumes the Character
// will not take any actions during this period that would reset the 5-second rule.
func (character *Character) TimeUntilManaRegen(desiredMana float64) time.Duration {
	// +1 at the end is to deal with floating point math rounding errors.
	manaNeeded := desiredMana - character.CurrentMana()
	regenTime := DurationFromSeconds(manaNeeded/character.manaRegenPerSecondWhileCasting()) + 1

	// TODO: this needs to have access to the sim to see current time vs character.PseudoStats.FiveSecondRule.
	//  it is possible that we have been waiting.
	//  In practice this function is always used right after a previous cast so no big deal for now.
	if regenTime > time.Second*5 {
		regenTime = time.Second * 5
		manaNeeded -= character.manaRegenPerSecondWhileCasting() * 5
		// now we move into spirit based regen.
		regenTime += DurationFromSeconds(manaNeeded / character.manaRegenPerSecondWhileNotCasting())
	}

	return regenTime
}

func (character *Character) HasTrinketEquipped(itemID int32) bool {
	return character.Equip[items.ItemSlotTrinket1].ID == itemID ||
		character.Equip[items.ItemSlotTrinket2].ID == itemID
}

func (character *Character) HasMetaGemEquipped(gemID int32) bool {
	for _, gem := range character.Equip[items.ItemSlotHead].Gems {
		if gem.ID == gemID {
			return true
		}
	}
	return false
}

func (character *Character) GetMetricsProto(numIterations int32) *proto.PlayerMetrics {
	metrics := character.Metrics.ToProto(numIterations)
	metrics.Auras = character.auraTracker.GetMetricsProto()
	return metrics
}

type BaseStatsKey struct {
	Race  proto.Race
	Class proto.Class
}

var BaseStats = map[BaseStatsKey]stats.Stats{}

// To calculate base stats, get a naked level 70 of the race/class you want, ideally without any talents to mess up base stats.
//  Basic stats are as-shown (str/agi/stm/int/spirit)

// Base Spell Crit is calculated by
//   1. Take as-shown value (troll shaman have 3.5%)
//   2. Calculate the bonus from int (for troll shaman that would be 104/78.1=1.331% crit)
//   3. Subtract as-shown from int bouns (3.5-1.331=2.169)
//   4. 2.169*22.08 (rating per crit percent) = 47.89 crit rating.

// Base mana can be looked up here: https://wowwiki-archive.fandom.com/wiki/Base_mana

// I assume a similar processes can be applied for other stats.