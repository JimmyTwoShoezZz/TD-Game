import {
    MachineGunTower,
    ShotgunTower,
    FlamethrowerTower,
    BulldozerTower,
    ArtilleryTower,
    RailGunTower,
    CorrosionTower,
    ShieldTower,
    } from './towers.js'

function formatStats(instance, extras = {}) {
    return {
    Damage: instance.damage,
    Range: Math.round(instance.range / 10) + " tiles",
    "Attack Speed": instance.attackSpeed + "s",
    "Can Attack Air": instance.canAttackAir ? "Yes" : "No",
    "Can Attack Ground": instance.canAttackGround ? "Yes" : "No",
    Health: instance.health,
    Armor: instance.armor,
    ...extras
    }
}

export const towerConfigs = {
    "Machine Gun Tower": {
        class: MachineGunTower,
        image: "images/machinegun.png",
        description: "Rapid-firing tower that targets ground units.",
        getStats: () => {
            const instance = new MachineGunTower(0, 0)
            return formatStats(instance)
        }
    },

    "Shotgun Tower": {
        class: ShotgunTower,
        image: "images/shotgun.png",
        description: "Fires a spread of projectiles at ground enemies. Low damage per shot, but hits multiple times.",
        getStats: () => {
            const instance = new ShotgunTower(0, 0)
            return formatStats(instance, {
                "Pellets per Burst": instance.pellets
            })
        }
    },

    "Flamethrower Tower": {
        class: FlamethrowerTower,
        image: "images/flamethrower.png",
        description: "Short-range cone attack that burns enemies over time. Highly effective against aliens.",
        getStats: () => {
            const instance = new FlamethrowerTower(0, 0)
            return formatStats(instance, {
                "Flame Damage": instance.damage,
                "Burn Duration": instance.burnDuration + "s",
                "Burn Damage/sec": instance.burnDamage
            })
        }
    },

    "Bulldozer Tower": {
        class: BulldozerTower,
        image: "images/bulldozer.png",
        description: "Extends a shovel to push all ground enemies in a line, dealing damage and bonus impact damage if blocked.",
        getStats: () => {
            const instance = new BulldozerTower(0, 0)
            return formatStats(instance, {
                "Push Damage": instance.damage,
                "Impact Bonus": instance.impactDamage
            })
        }
    },

    "Artillery Tower": {
        class: ArtilleryTower,
        image: "images/artillery.png",
        description: "Fires long-range explosive shells. Deals heavy damage to a single ground target with splash damage to nearby enemies.",
        getStats: () => {
            const instance = new ArtilleryTower(0, 0)
            return formatStats(instance, {
                "Direct Hit Damage": instance.damage,
                "Splash Radius": Math.round(instance.splashRadius) + " tiles",
                "Splash Falloff": "Damage scales with distance (down to 10%)",
                "Projectile Delay": (instance.projectileDelay / 1000).toFixed(1) + "s"
            })
        }
    },

    "Rail Gun Tower": {
        class: RailGunTower,
        image: "images/railgun.png",
        description: "Fires devastating armor-piercing shots at large enemies. Ignores armor and can hit air or ground targets.",
        getStats: () => {
            const instance = new RailGunTower(0, 0)
            return formatStats(instance, {
                "Charge Time": (instance.chargeupTime / 1000).toFixed(1) + "s",
                "Ignores Armor": instance.ignoresArmor ? "Yes" : "No",
                "Required Target Size": instance.requiredSize.charAt(0).toUpperCase() + instance.requiredSize.slice(1),
                "Can Move": "Yes",
                "Move Limit per Round": instance.moveLimitPerRound
            })
        }
    },

    "Corrosion Tower": {
        class: CorrosionTower,
        image: "images/corrosion.png",
        description: "Launches an acid burst that temporarily reduces mechanical armor of all enemies in the blast radius.",
        getStats: () => {
            const instance = new CorrosionTower(0, 0)
            return formatStats(instance, {
                "Direct Damage": instance.damage,
                "Splash Radius": Math.round(instance.splashRadius) + " tiles",
                "Armor Reduction": "-" + instance.armorReduction + " (mechanical only)",
                "Debuff Duration": (instance.debuffDuration / 1000) + "s"
            })
        }
    },

    "Shield Tower": {
        class: ShieldTower,
        image: "images/shield.png",
        description: "Generates a shield that makes nearby towers invulnerable and untargetable. Shield is active as long as this tower remains alive.",
        getStats: () => {
            const instance = new ShieldTower(0, 0)
            return {
                "Shield Radius": instance.range + " tiles",
                "Health": instance.health,
                "Armor": instance.armor,
                "Effect": "Makes nearby towers immune to damage and targeting"
            }
        }
    },
}