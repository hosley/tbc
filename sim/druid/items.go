package druid

import (
	"time"

	"github.com/wowsims/tbc/sim/core"
	"github.com/wowsims/tbc/sim/core/stats"
)

func init() {
	core.AddItemEffect(30664, ApplyLivingRootoftheWildheart)
	core.AddItemEffect(32486, ApplyAshtongueTalisman)
	core.AddItemEffect(32257, ApplyIdolOfTheWhiteStag)
	core.AddItemEffect(33509, ApplyIdolOfTerror)
	core.AddItemEffect(33510, ApplyIdolOfTheUnseenMoon)

	core.AddItemSet(&ItemSetMalorneRegalia)
	core.AddItemSet(&ItemSetMalorneHarness)
	core.AddItemSet(&ItemSetNordrassilRegalia)
	core.AddItemSet(&ItemSetNordrassilHarness)
	core.AddItemSet(&ItemSetThunderheartRegalia)
	core.AddItemSet(&ItemSetThunderheartHarness)
}

var ItemSetMalorneRegalia = core.ItemSet{
	Name: "Malorne Regalia",
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			druid := agent.(DruidAgent).GetDruid()
			druid.RegisterAura(core.Aura{
				Label:    "Malorne Regalia 2pc",
				Duration: core.NeverExpires,
				OnReset: func(aura *core.Aura, sim *core.Simulation) {
					aura.Activate(sim)
				},
				OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
					if spellEffect.ProcMask.Matches(core.ProcMaskMeleeOrRanged) {
						return
					}
					if !spellEffect.Landed() {
						return
					}
					if sim.RandomFloat("malorne 2p") > 0.05 {
						return
					}
					spell.Unit.AddMana(sim, 120, core.ActionID{SpellID: 37295}, false)
				},
			})
		},
		4: func(agent core.Agent) {
			// Currently this is handled in druid.go (reducing CD of innervate)
		},
	},
}

var ItemSetMalorneHarness = core.ItemSet{
	Name: "Malorne Harness",
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			druid := agent.(DruidAgent).GetDruid()

			procChance := 0.04

			druid.RegisterAura(core.Aura{
				Label:    "Malorne 4pc",
				Duration: core.NeverExpires,
				OnReset: func(aura *core.Aura, sim *core.Simulation) {
					aura.Activate(sim)
				},
				OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
					if spellEffect.Landed() && spellEffect.ProcMask.Matches(core.ProcMaskMelee) {
						if sim.RandomFloat("Malorne 2pc") < procChance {
							if druid.Form.Matches(Bear) {
								druid.AddRage(sim, 10, core.ActionID{SpellID: 37306})
							} else if druid.Form.Matches(Cat) {
								druid.AddEnergy(sim, 20, core.ActionID{SpellID: 37311})
							}
						}
					}
				},
			})
		},
		4: func(agent core.Agent) {
			druid := agent.(DruidAgent).GetDruid()
			if druid.Form.Matches(Bear) {
				druid.AddStat(stats.Armor, 1400)
			} else if druid.Form.Matches(Cat) {
				druid.AddStat(stats.Strength, 30)
			}
		},
	},
}

var ItemSetNordrassilRegalia = core.ItemSet{
	Name: "Nordrassil Regalia",
	Bonuses: map[int32]core.ApplyEffect{
		4: func(agent core.Agent) {
			// Implemented in starfire.go.
		},
	},
}

var ItemSetNordrassilHarness = core.ItemSet{
	Name: "Nordrassil Harness",
	Bonuses: map[int32]core.ApplyEffect{
		4: func(agent core.Agent) {
			// Implemented in lacerate.go.
		},
	},
}

var ItemSetThunderheartRegalia = core.ItemSet{
	Name: "Thunderheart Regalia",
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			// handled in moonfire.go in template construction
		},
		4: func(agent core.Agent) {
			// handled in starfire.go in template construction
		},
	},
}

var ItemSetThunderheartHarness = core.ItemSet{
	Name: "Thunderheart Harness",
	Bonuses: map[int32]core.ApplyEffect{
		2: func(agent core.Agent) {
			// Implemented in mangle.go.
		},
		4: func(agent core.Agent) {
			// Implemented in swipe.go.
		},
	},
}

func ApplyLivingRootoftheWildheart(agent core.Agent) {
	druid := agent.(DruidAgent).GetDruid()

	var procAura *core.Aura
	if druid.Form.Matches(Moonkin) {
		procAura = druid.NewTemporaryStatsAura("Living Root Moonkin Proc", core.ActionID{SpellID: 37343}, stats.Stats{stats.SpellPower: 209}, time.Second*15)
	} else if druid.Form.Matches(Bear) {
		procAura = druid.NewTemporaryStatsAura("Living Root Bear Proc", core.ActionID{SpellID: 37340}, stats.Stats{stats.Armor: 4070}, time.Second*15)
	} else if druid.Form.Matches(Cat) {
		procAura = druid.NewTemporaryStatsAura("Living Root Cat Proc", core.ActionID{SpellID: 37341}, stats.Stats{stats.Strength: 64}, time.Second*15)
	} else {
		return
	}

	druid.RegisterAura(core.Aura{
		Label:    "Living Root of the Wildheart",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnCastComplete: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell) {
			if druid.Form.Matches(Moonkin) && sim.RandomFloat("Living Root of the Wildheart") < 0.03 {
				procAura.Activate(sim)
			}
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if !spellEffect.ProcMask.Matches(core.ProcMaskMelee) {
				return
			}
			if sim.RandomFloat("Living Root of the Wildheart") > 0.03 {
				return
			}

			procAura.Activate(sim)
		},
	})
}

func ApplyAshtongueTalisman(agent core.Agent) {
	druid := agent.(DruidAgent).GetDruid()

	// Not in the game yet so cant test; this logic assumes that:
	// - does not affect the starfire which procs it
	// - can proc off of any completed cast, not just hits
	actionID := core.ActionID{ItemID: 32486}

	var procAura *core.Aura
	if druid.Form.Matches(Moonkin) {
		procAura = druid.NewTemporaryStatsAura("Ashtongue Talisman Proc", actionID, stats.Stats{stats.SpellPower: 150}, time.Second*8)
	} else if druid.Form.Matches(Bear | Cat) {
		procAura = druid.NewTemporaryStatsAura("Ashtongue Talisman Proc", actionID, stats.Stats{stats.Strength: 140}, time.Second*8)
	} else {
		return
	}

	druid.RegisterAura(core.Aura{
		Label:    "Ashtongue Talisman",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spell == druid.Starfire8 || spell == druid.Starfire6 {
				if sim.RandomFloat("Ashtongue Talisman") < 0.25 {
					procAura.Activate(sim)
				}
			} else if druid.Mangle != nil && spell == druid.Mangle {
				if sim.RandomFloat("Ashtongue Talisman") < 0.4 {
					procAura.Activate(sim)
				}
			}
		},
	})
}

func ApplyIdolOfTheWhiteStag(agent core.Agent) {
	druid := agent.(DruidAgent).GetDruid()

	actionID := core.ActionID{ItemID: 32257}
	procAura := druid.NewTemporaryStatsAura("Idol of the White Stag Proc", actionID, stats.Stats{stats.AttackPower: 94}, time.Second*20)

	druid.RegisterAura(core.Aura{
		Label:    "Idol of the White Stag",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spell == druid.Mangle && druid.Mangle != nil {
				procAura.Activate(sim)
			}
		},
	})
}

func ApplyIdolOfTerror(agent core.Agent) {
	druid := agent.(DruidAgent).GetDruid()

	actionID := core.ActionID{ItemID: 33509}
	procAura := druid.NewTemporaryStatsAura("Idol of Terror Proc", actionID, stats.Stats{stats.Agility: 65}, time.Second*10)

	procChance := 0.85
	icd := core.Cooldown{
		Timer:    druid.NewTimer(),
		Duration: time.Second * 10,
	}

	druid.RegisterAura(core.Aura{
		Label:    "Idol of Terror",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spell != druid.Mangle || druid.Mangle == nil {
				return
			}
			if !icd.IsReady(sim) {
				return
			}
			if sim.RandomFloat("Idol of Terror") > procChance {
				return
			}

			icd.Use(sim)
			procAura.Activate(sim)
		},
	})
}

func ApplyIdolOfTheUnseenMoon(agent core.Agent) {
	druid := agent.(DruidAgent).GetDruid()

	actionID := core.ActionID{ItemID: 33510}
	procAura := druid.NewTemporaryStatsAura("Idol of the Unseen Moon Proc", actionID, stats.Stats{stats.SpellPower: 140}, time.Second*10)

	druid.RegisterAura(core.Aura{
		Label:    "Idol of the Unseen Moon",
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
		},
		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect) {
			if spell == druid.Moonfire {
				if sim.RandomFloat("Idol of the Unseen Moon") > 0.5 {
					return
				}
				procAura.Activate(sim)
			}
		},
	})
}
