package warrior

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/proto"
	"github.com/wowsims/tbc/sim/core/stats"
)

func (warrior *Warrior) ApplyTalents() {
	warrior.registerBloodrageCD()

	warrior.AddStat(stats.Parry, core.ParryRatingPerParryChance*1*float64(warrior.Talents.Deflection))
	warrior.AddStat(stats.MeleeCrit, core.MeleeCritRatingPerCritChance*1*float64(warrior.Talents.Cruelty))
	warrior.AddStat(stats.MeleeHit, core.MeleeHitRatingPerHitChance*1*float64(warrior.Talents.Precision))
	warrior.AddStat(stats.Defense, core.DefenseRatingPerDefense*4*float64(warrior.Talents.Anticipation))
	warrior.AddStat(stats.Block, core.BlockRatingPerBlockChance*1*float64(warrior.Talents.ShieldSpecialization))
	warrior.AddStat(stats.Armor, warrior.Equip.Stats()[stats.Armor]*0.02*float64(warrior.Talents.Toughness))
	warrior.AddStat(stats.Expertise, core.ExpertisePerQuarterPercentReduction*2*float64(warrior.Talents.Defiance))
	warrior.PseudoStats.DodgeReduction += 0.01 * float64(warrior.Talents.WeaponMastery)

	if warrior.Talents.DualWieldSpecialization > 0 {
		warrior.AutoAttacks.OHEffect.BaseDamage.Calculator = core.BaseDamageFuncMeleeWeapon(core.OffHand, false, 0, 1+0.05*float64(warrior.Talents.DualWieldSpecialization), true)
	}

	// TODO: This should only be applied while berserker stance is active.
	if warrior.Talents.ImprovedBerserkerStance > 0 {
		bonus := 1 + 0.02*float64(warrior.Talents.ImprovedBerserkerStance)
		warrior.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.AttackPower,
			ModifiedStat: stats.AttackPower,
			Modifier: func(ap float64, _ float64) float64 {
				return ap * bonus
			},
		})
	}

	if warrior.Talents.ShieldMastery > 0 {
		bonus := 1 + 0.1*float64(warrior.Talents.ShieldMastery)
		warrior.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.BlockValue,
			ModifiedStat: stats.BlockValue,
			Modifier: func(bv float64, _ float64) float64 {
				return bv * bonus
			},
		})
	}

	if warrior.Talents.Vitality > 0 {
		stamBonus := 1 + 0.01*float64(warrior.Talents.Vitality)
		warrior.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Stamina,
			ModifiedStat: stats.Stamina,
			Modifier: func(stamina float64, _ float64) float64 {
				return stamina * stamBonus
			},
		})
		strBonus := 1 + 0.02*float64(warrior.Talents.Vitality)
		warrior.AddStatDependency(stats.StatDependency{
			SourceStat:   stats.Strength,
			ModifiedStat: stats.Strength,
			Modifier: func(strength float64, _ float64) float64 {
				return strength * strBonus
			},
		})
	}

	warrior.applyAngerManagement()
	warrior.applyDeepWounds()
	warrior.applyOneHandedWeaponSpecialization()
	warrior.applyTwoHandedWeaponSpecialization()
	warrior.applyWeaponSpecializations()
	warrior.applyUnbridledWrath()
	warrior.applyFlurry()
	warrior.registerDeathWishCD()
	warrior.registerSweepingStrikesCD()
}

// Unlike most other applyXXX() talent appliers, this is meant to be called from Reset().
func (warrior *Warrior) applyAngerManagement() {
	if !warrior.Talents.AngerManagement {
		return
	}

	warrior.RegisterResetEffect(func(sim *core.Simulation) {
		core.StartPeriodicAction(sim, core.PeriodicActionOptions{
			Period: time.Second * 3,
			OnAction: func(sim *core.Simulation) {
				warrior.AddRage(sim, 1, core.ActionID{SpellID: 12296})
			},
		})
	})
}

func (warrior *Warrior) procBloodFrenzy(sim *core.Simulation, effect *core.SpellEffect, dur time.Duration) {
	aura := warrior.BloodFrenzyAuras[effect.Target.Index]
	aura.Duration = dur
	aura.Activate(sim)
}

func (warrior *Warrior) applyTwoHandedWeaponSpecialization() {
	if warrior.Talents.TwoHandedWeaponSpecialization == 0 {
		return
	}
	if warrior.Equip[proto.ItemSlot_ItemSlotMainHand].HandType != proto.HandType_HandTypeTwoHand {
		return
	}

	warrior.PseudoStats.PhysicalDamageDealtMultiplier *= 1 + 0.01*float64(warrior.Talents.TwoHandedWeaponSpecialization)
}

func (warrior *Warrior) applyOneHandedWeaponSpecialization() {
	if warrior.Talents.OneHandedWeaponSpecialization == 0 {
		return
	}
	if warrior.Equip[proto.ItemSlot_ItemSlotMainHand].HandType == proto.HandType_HandTypeTwoHand {
		return
	}

	warrior.PseudoStats.PhysicalDamageDealtMultiplier *= 1 + 0.02*float64(warrior.Talents.OneHandedWeaponSpecialization)
}

func (warrior *Warrior) applyWeaponSpecializations() {
	maceSpecMask := core.ProcMaskEmpty
	swordSpecMask := core.ProcMaskEmpty
	if weapon := warrior.Equip[proto.ItemSlot_ItemSlotMainHand]; weapon.ID != 0 {
		if weapon.WeaponType == proto.WeaponType_WeaponTypeAxe || weapon.WeaponType == proto.WeaponType_WeaponTypePolearm {
			warrior.PseudoStats.BonusMHCritRating += 1 * core.MeleeCritRatingPerCritChance * float64(warrior.Talents.PoleaxeSpecialization)
		} else if weapon.WeaponType == proto.WeaponType_WeaponTypeMace {
			maceSpecMask |= core.ProcMaskMeleeMH
		} else if weapon.WeaponType == proto.WeaponType_WeaponTypeSword {
			swordSpecMask |= core.ProcMaskMeleeMH
		}
	}
	if weapon := warrior.Equip[proto.ItemSlot_ItemSlotOffHand]; weapon.ID != 0 {
		if weapon.WeaponType == proto.WeaponType_WeaponTypeAxe || weapon.WeaponType == proto.WeaponType_WeaponTypePolearm {
			warrior.PseudoStats.BonusOHCritRating += 1 * core.MeleeCritRatingPerCritChance * float64(warrior.Talents.PoleaxeSpecialization)
		} else if weapon.WeaponType == proto.WeaponType_WeaponTypeMace {
			maceSpecMask |= core.ProcMaskMeleeOH
		} else if weapon.WeaponType == proto.WeaponType_WeaponTypeSword {
			swordSpecMask |= core.ProcMaskMeleeOH
		}
	}

	if warrior.Talents.MaceSpecialization > 0 && maceSpecMask != core.ProcMaskEmpty {
		ppmm := warrior.AutoAttacks.NewPPMManager(1.5)

		warrior.RegisterAura(core.Aura{
			Label:    "Mace Specialization",
			Duration: core.NeverExpires,
			OnReset: func(aura *core.Aura, sim *core.Simulation) {
				aura.Activate(sim)
			},
			OnSpellHit: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if !spellEffect.Landed() {
					return
				}

				if !spellEffect.ProcMask.Matches(maceSpecMask) {
					return
				}

				if !ppmm.Proc(sim, spellEffect.IsMH(), false, "Mace Specialization") {
					return
				}

				warrior.AddRage(sim, 7, core.ActionID{SpellID: 12704})
			},
		})
	}

	if warrior.Talents.SwordSpecialization > 0 && swordSpecMask != core.ProcMaskEmpty {
		var swordSpecializationSpell *core.Spell
		icd := core.Cooldown{
			Timer:    warrior.NewTimer(),
			Duration: time.Millisecond * 500,
		}
		procChance := 0.01 * float64(warrior.Talents.SwordSpecialization)

		warrior.RegisterAura(core.Aura{
			Label:    "Sword Specialization",
			Duration: core.NeverExpires,
			OnInit: func(aura *core.Aura, sim *core.Simulation) {
				swordSpecializationSpell = warrior.GetOrRegisterSpell(core.SpellConfig{
					ActionID:    core.ActionID{SpellID: 12815},
					SpellSchool: core.SpellSchoolPhysical,
					SpellExtras: core.SpellExtrasMeleeMetrics,

					ApplyEffects: core.ApplyEffectFuncDirectDamage(warrior.AutoAttacks.MHEffect),
				})
			},
			OnReset: func(aura *core.Aura, sim *core.Simulation) {
				aura.Activate(sim)
			},
			OnSpellHit: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if !spellEffect.Landed() {
					return
				}

				if !spellEffect.ProcMask.Matches(swordSpecMask) {
					return
				}

				if !icd.IsReady(sim) {
					return
				}

				if sim.RandomFloat("Sword Specialization") > procChance {
					return
				}
				icd.Use(sim)

				swordSpecializationSpell.Cast(sim, spellEffect.Target)
			},
		})
	}
}

func (warrior *Warrior) applyUnbridledWrath() {
	if warrior.Talents.UnbridledWrath == 0 {
		return
	}

	ppmm := warrior.AutoAttacks.NewPPMManager(3 * float64(warrior.Talents.UnbridledWrath))

	warrior.RegisterAura(core.Aura{
		Label:    "Unbridled Wrath",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHit: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spellEffect.Damage == 0 {
				return
			}

			if !spellEffect.ProcMask.Matches(core.ProcMaskMeleeWhiteHit) {
				return
			}

			if !ppmm.Proc(sim, spellEffect.IsMH(), false, "Unbrided Wrath") {
				return
			}

			warrior.AddRage(sim, 1, core.ActionID{SpellID: 13002})
		},
	})
}

func (warrior *Warrior) applyFlurry() {
	if warrior.Talents.Flurry == 0 {
		return
	}

	bonus := 1 + 0.05*float64(warrior.Talents.Flurry)
	inverseBonus := 1 / bonus

	procAura := warrior.RegisterAura(core.Aura{
		Label:     "Flurry Proc",
		ActionID:  core.ActionID{SpellID: 12974},
		Duration:  core.NeverExpires,
		MaxStacks: 3,
		OnGain: func(aura *core.Aura, sim *core.Simulation) {
			warrior.MultiplyMeleeSpeed(sim, bonus)
		},
		OnExpire: func(aura *core.Aura, sim *core.Simulation) {
			warrior.MultiplyMeleeSpeed(sim, inverseBonus)
		},
	})

	warrior.RegisterAura(core.Aura{
		Label:    "Flurry",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHit: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if !spellEffect.ProcMask.Matches(core.ProcMaskMelee) {
				return
			}

			if spellEffect.Outcome.Matches(core.OutcomeCrit) {
				procAura.Activate(sim)
				procAura.SetStacks(sim, 3)
				return
			}

			// Remove a stack.
			if procAura.IsActive() && spellEffect.ProcMask.Matches(core.ProcMaskMeleeWhiteHit) {
				procAura.RemoveStack(sim)
			}
		},
	})
}

func (warrior *Warrior) registerDeathWishCD() {
	if !warrior.Talents.DeathWish {
		return
	}

	actionID := core.ActionID{SpellID: 12292}
	const hasteBonus = 1.2
	const inverseHasteBonus = 1 / 1.2

	deathWishAura := warrior.RegisterAura(core.Aura{
		Label:    "Death Wish",
		ActionID: actionID,
		Duration: time.Second * 30,
		OnGain: func(aura *core.Aura, sim *core.Simulation) {
			warrior.PseudoStats.PhysicalDamageDealtMultiplier *= 1.2
			warrior.PseudoStats.DamageTakenMultiplier *= 1.05
		},
		OnExpire: func(aura *core.Aura, sim *core.Simulation) {
			warrior.PseudoStats.PhysicalDamageDealtMultiplier /= 1.2
			warrior.PseudoStats.DamageTakenMultiplier /= 1.05
		},
	})

	cost := 10.0
	deathWishSpell := warrior.RegisterSpell(core.SpellConfig{
		ActionID: actionID,

		ResourceType: stats.Rage,
		BaseCost:     cost,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				Cost: cost,
				GCD:  core.GCDDefault,
			},
			IgnoreHaste: true,
			CD: core.Cooldown{
				Timer:    warrior.NewTimer(),
				Duration: time.Minute * 3,
			},
		},

		ApplyEffects: func(sim *core.Simulation, _ *core.Target, spell *core.Spell) {
			deathWishAura.Activate(sim)
		},
	})

	warrior.AddMajorCooldown(core.MajorCooldown{
		Spell: deathWishSpell,
		Type:  core.CooldownTypeDPS,
		CanActivate: func(sim *core.Simulation, character *core.Character) bool {
			return warrior.CurrentRage() >= cost
		},
		ShouldActivate: func(sim *core.Simulation, character *core.Character) bool {
			return true
		},
	})
}