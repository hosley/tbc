package rogue

import (
	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/proto"
)

var ShivActionID = core.ActionID{SpellID: 5938}

func (rogue *Rogue) registerShivSpell(_ *core.Simulation) {
	rogue.shivEnergyCost = 20
	if rogue.GetOHWeapon() != nil {
		rogue.shivEnergyCost = 20 + 10*rogue.GetOHWeapon().SwingSpeed
	}

	ability := rogue.newAbility(ShivActionID, rogue.shivEnergyCost, SpellFlagBuilder|core.SpellExtrasCannotBeDodged, core.ProcMaskMeleeOHSpecial)

	rogue.Shiv = rogue.RegisterSpell(core.SpellConfig{
		Template:   ability,
		ModifyCast: core.ModifyCastAssignTarget,
		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask:         core.ProcMaskMeleeOHSpecial,
			DamageMultiplier: 1 + core.TernaryFloat64(rogue.Talents.SurpriseAttacks, 0.1, 0),
			ThreatMultiplier: 1,
			BaseDamage:       core.BaseDamageConfigMeleeWeapon(core.OffHand, true, 0, 1+0.1*float64(rogue.Talents.DualWieldSpecialization), true),
			OutcomeApplier:   core.OutcomeFuncMeleeSpecialHitAndCrit(rogue.critMultiplier(false, true)),
			OnSpellHit: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if spellEffect.Landed() {
					rogue.AddComboPoints(sim, 1, ShivActionID)

					switch rogue.Consumes.OffHandImbue {
					case proto.WeaponImbue_WeaponImbueRogueDeadlyPoison:
						rogue.DeadlyPoison.Cast(sim, spellEffect.Target)
					case proto.WeaponImbue_WeaponImbueRogueInstantPoison:
						rogue.procInstantPoison(sim, spellEffect)
					}
				}
			},
		}),
	})
}