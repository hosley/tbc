package warrior

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/proto"
	"github.com/wowsims/tbc/sim/core/stats"
)

var RevengeCooldownID = core.NewCooldownID()
var RevengeActionID = core.ActionID{SpellID: 30357, CooldownID: RevengeCooldownID}

func (warrior *Warrior) registerRevengeSpell(_ *core.Simulation) {
	warrior.revengeCost = 5.0 - float64(warrior.Talents.FocusedRage)
	refundAmount := warrior.revengeCost * 0.8

	ability := core.SimpleSpell{
		SpellCast: core.SpellCast{
			Cast: core.Cast{
				ActionID:    RevengeActionID,
				Character:   &warrior.Character,
				SpellSchool: core.SpellSchoolPhysical,
				GCD:         core.GCDDefault,
				Cooldown:    time.Second * 5,
				IgnoreHaste: true,
				BaseCost: core.ResourceCost{
					Type:  stats.Rage,
					Value: warrior.revengeCost,
				},
				Cost: core.ResourceCost{
					Type:  stats.Rage,
					Value: warrior.revengeCost,
				},
			},
		},
	}

	warrior.Revenge = warrior.RegisterSpell(core.SpellConfig{
		Template: ability,
		ApplyEffects: core.ApplyEffectFuncDirectDamage(core.SpellEffect{
			ProcMask: core.ProcMaskMeleeMHSpecial,

			DamageMultiplier: 1,
			ThreatMultiplier: 1,
			FlatThreatBonus:  200,

			BaseDamage:     core.BaseDamageConfigRoll(414, 506),
			OutcomeApplier: core.OutcomeFuncMeleeSpecialHitAndCrit(warrior.critMultiplier(true)),

			OnSpellHit: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
				if !spellEffect.Landed() {
					warrior.AddRage(sim, refundAmount, core.ActionID{OtherID: proto.OtherAction_OtherActionRefund})
				}
			},
		}),
	})
}

func (warrior *Warrior) CanRevenge(sim *core.Simulation) bool {
	return warrior.StanceMatches(DefensiveStance) && warrior.revengeTriggered && warrior.CurrentRage() >= warrior.revengeCost && !warrior.IsOnCD(RevengeCooldownID, sim.CurrentTime)
}