package rogue

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
)

var ExposeArmorActionID = core.ActionID{SpellID: 26866, Tag: 5}
var ExposeArmorEnergyCost = 25.0

func (rogue *Rogue) registerExposeArmorSpell(sim *core.Simulation) {
	refundAmount := 0.4 * float64(rogue.Talents.QuickRecovery)

	rogue.ExposeArmorAura = core.ExposeArmorAura(sim.GetPrimaryTarget(), rogue.Talents.ImprovedExposeArmor)
	ability := rogue.newAbility(ExposeArmorActionID, ExposeArmorEnergyCost, SpellFlagFinisher, core.ProcMaskMeleeMHSpecial)

	rogue.ExposeArmor = rogue.RegisterSpell(core.SpellConfig{
		Template: ability,
		ModifyCast: func(sim *core.Simulation, target *core.Target, instance *core.SimpleSpell) {
			if rogue.ComboPoints() != 5 {
				panic("Expose Armor requires 5 combo points!")
			}
			instance.Effect.Target = target
			instance.ActionID.Tag = rogue.ComboPoints()
			if rogue.deathmantle4pcProc {
				instance.Cost.Value = 0
				rogue.deathmantle4pcProc = false
			}
		},
		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask:         core.ProcMaskMeleeMHSpecial,
			ThreatMultiplier: 1,
			OutcomeApplier:   core.OutcomeFuncMeleeSpecialHit(),
			OnSpellHit: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if spellEffect.Landed() {
					rogue.ExposeArmorAura.Activate(sim)
					rogue.ApplyFinisher(sim, spell.ActionID)
					if sim.GetRemainingDuration() <= time.Second*30 {
						rogue.doneEA = true
					}
				} else {
					if refundAmount > 0 {
						rogue.AddEnergy(sim, spell.MostRecentCost*refundAmount, core.ActionID{SpellID: 31245})
					}
				}
			},
		}),
	})
}

func (rogue *Rogue) MaintainingExpose(target *core.Target) bool {
	return !rogue.doneEA && (rogue.Talents.ImprovedExposeArmor == 2 || !target.HasActiveAura(core.SunderArmorAuraLabel))
}