This document serves as a central location for all of my ideas for this game.
Once things are implemented, I may remove them from here.


**UI / UX**
Message Log accessible in settings or own its own. shows the history of messages received during the current game level.
deleting towers: I think that in easy difficulty you get a full refund, in normal you get 50% and in hard you get no refund
Right-justified: Message Log Button | Options Button
Wave preview only visible between waves
In the options panel I want one choice to be an index. It will have categories like: towers, enemy units. Then it lists them all and when you click on one it will show a detailed description
Boss enemies should have their own category, but they won’t appear until encountered
I want a planet section that has a description of each planet and then lists the things that make it unique, like rivers, mountains, rocks, buildings, weather. Basically the things that can affect gameplay
Credits Section Layout:
Game Developer – (Your name or alias)
Art Assets – (List sources like Kenney.nl, OpenGameArt, etc.)
Sound Effects & Music – (Freesound.org, OpenGameArt, etc., with attribution if needed)
Special Thanks – (If you use tutorials, community help, or inspiration from somewhere)

**Game Mechanics**
On easy and normal difficulty, I want the player to have no time limit between rounds, they choose when to start each round. On hard, I want them to have a set time, but not sure what it is yet

**Tool Tips**

**Info Panel**
    Tower Name (Displayed at the top)
    Tower Image/Icon (Visual representation of the tower)
    Tower Health
    Base Armor + Upgraded Armor Bonus
    Attack Speed (if applicable)
    Attack Damage (if applicable)
    Individual Upgrade Buttons (Grayed out if unaffordable)
    Shield Tower Protection Indicator (if applicable)
    Enemy Debuff Indicator (if applicable)

**Maps / Levels**
    Grassy Fields Planet:
    Desert Planet:
    Swamp Planet:
    Frozen Planet:
    Twilight Planet:
    Space Platform:
    I want visual changes as well as gameplay changes! The gravity and storm ideas are great! Also, depending on the planet, the enemies would either be human or alien or both
    random path generation? random map generation all together? preset pieces that fit together?
    heavy-type enemies can attack terrain blockers if they are on top of a path tile.
    I think the terrain blocks will have a certain amount of health. I also like the idea of enemies building bridges over water. The bridges are quick to build but have low health
    In general I want each map to only have one path. Occasionally there will be shortcuts or branches, but for now I want to keep it simple
    No diagonals and no dead ends sounds good, 2-wide paths
    Oh another constraint for now is that I don’t want paths to ever come within 2 grid sizes of any border
    I also want a minimum of one grid space between any path so they don’t get too cramped
    Refined Map & Terrain Rules
Enemy Pathways (Lanes)

Towers cannot be built on enemy pathways.
Enemy pathways are predefined per map and do not change.
Some maps may have multiple lanes that enemies can use.
Tower Placement

Towers can only be placed on designated buildable terrain.
Some towers have restricted placement (e.g., the Resource Extractor must be placed on mineral deposits).
Some maps may have limited buildable space to increase challenge.
Obstacles & Static Terrain

Some maps include natural obstacles (e.g., rocks, buildings) that block tower placement.
Some obstacles may be destructible for a cost, opening up new build locations.
Elevated areas may exist but will not provide any special bonuses for now.
Movement Rules

Ground enemies follow fixed paths and do not deviate.
Air enemies fly directly toward their destination, ignoring obstacles and terrain.
    

**Towers / Abilities**
    I want basic towers to be available from the start, and there should be an unlock mechanic for the more advanced towers. This way, between levels, you can get better defenses and then conquer certain planets more easily
    I want a flame thrower. It will be strong against alien units, weak against armor, have a short range, but deals a constant amount of damage per second in a cone area.
    Burn Duration – Causes enemies to take lingering fire damage even after leaving the attack zone.
    Napalm Fuel – Creates a burning patch on the ground that deals damage over time.
Proximity Mine Tower
    Oooh I want two kinds, one that detonates on impact dealing damage, and one that fires aoe EMP pulses
    I think each tower should have a set amount of mines per round, and the tower can be upgraded to increase that amount
    They should only be replenished between rounds
    Yes. I would like the explosive mines to have an upgrade for blast radius, damage, and an ability to seek out enemies within a certain range
    Larger pulse radius and longer duration for sure
    I think that battleships should be resistant to emp mines with diminishing returns, that way if enough pulses hit them it will affect them
    I think the scout drones should have a limited time cloak ability that makes them immune to emp mines
    I think it should activate when it gets close to a mine, and only be usable once per unit with a certain duration
    I want the proximity mine tower to be built first, and then the player chooses whether it’s an explosive or emp version. Once that choice is made, it can’t be changed for that specific tower
Shield Tower
    I want the shield to be invulnerable, but the tower has a certain amount of health. The tower can be upgraded to increase the shield radius and how much health the tower has
    Once destroyed it does not come back
    I want enemy units to prioritize that tower based on proximity, if they are in range, they attack it, if not, they attack other towers that are vilnerable
Machine Gun Tower
    Let’s add a machine gun tower. It attacks single target, quickly, and low damage
    3 upgrades, fire rate, damage, and armor piercing rounds (reduce armor effectiveness)
    ground only
Shotgun Tower
    Let’s add a shotgun tower. Shoots lots of projectiles at once in the general direction of enemies, but has a short time between shots that it can’t fire
    Reduce cool down time, increase damage, increase bullet spread
    ground only
Artillery Tower
    I want to add an artillery tower that can only attack ground units
    It should start with a long range and deal splash damage. It’s upgrades will include increased aoe radius and increased damage
    It should have a long cool down time between firing
    I also want the artillery tower to be moveable between rpunds
    I’m thinking the artillery tower will be mounted on a 4 wheel base
    I think they should have a limit per round but I don’t know what it is, perhaps there would be an upgrade to increase the distance
Rail Gun Tower
    I want to add a rail gun tower that only attacks the larger units. It is single target, does A LOT of damage, and has a very long cool down time
    It ignores enemy armor values
    It will have an upgrade for faster cool down time
    I want the rail gun tower to take up two squares on the placement grid, but it is one of the towers that can move between rounds
    I think for now it will be free to move.
    and for the rail gun tower, it will be on a trailer pulled by a semi-like cab
    I think they should have a limit per round but I don’t know what it is, perhaps there would be an upgrade to increase the distance
Unnamed Tower
    I want to add a tower that is single target and slows the enemy’s movement speed
Revised Magnet Tower – Creates temporary attraction points on enemies
Core Functionality:
Fires a magnet projectile that attaches to a metal-based enemy (vehicles, robots, mechs).
Nearby metal enemies are pulled toward the magnetized target, slowing their movement and potentially clustering them together.
Biological enemies are unaffected.
The effect lasts for a set duration before the magnet deactivates.
Upgrade Paths:
Stronger Magnetic Pull – Increases how strongly nearby enemies are pulled toward the magnetized unit.
Longer Duration – The magnet effect lasts longer before wearing off.
Magnetic Overload – When the effect ends, the magnet explodes in an EMP burst, temporarily disabling vehicles and robotic enemies.
Chain Reaction – After the first magnet expires, it jumps to another nearby enemy, keeping the effect going longer.
Counters & Weaknesses:
Biological enemies (like aliens and infantry) are completely unaffected.
Boss enemies may have resistance, reducing the pull effect.
If there are no metal-based enemies nearby, the ability is wasted.
Strategy & Role:
Great for disrupting enemy formations, forcing metal-based units to cluster together.
Synergizes with AoE towers (Shotgun, Artillery, EMP Mines) by grouping enemies for maximum splash damage.
Can be used offensively to pull enemies into kill zones or defensively to delay key units.
Corrosion Tower Mechanics (Finalized):
Effect: First hit permanently reduces enemy armor in an AoE explosion (no stacking).
Damage Type: Low direct damage, mainly focused on weakening armor.
Range: Medium, radial blast centered on impact.
Targeting: Prioritizes high-armor enemies.
Stacking: Does NOT stack—each enemy can only be affected once.
Visual Effect: A quick burst of corrosive material rather than a lasting cloud.
Synergy: Softens up tanky alien units so other towers deal more damage.
Upgrades:
Stronger Acid Formula – Increases the amount of armor removed.
Final Anti-Air Missile Tower Design:
Function: Fires guided missiles at air units with a decent attack speed and medium damage.
Strong Against: All air units.
Weak Against: Cannot target ground units.
Range: Long.
Attack Type: Single-target homing missiles with no splash damage.
Upgrades:
Multi-Target Tracking – Allows the tower to lock onto two air units at once, firing at both.
Faster Targeting Systems – Reduces the time between missile launches, increasing attack speed.
Resource Extractor Tower (Late-Game Tower)
Overview:
A late-game tower that generates Minerals and Power Crystals.
Can only be placed on designated mineral deposit tiles, which will appear in later levels.
The ratio of Minerals to Power Crystals is determined by the specific deposit it is placed on.
Only generates resources during active rounds, not between them.
Extraction speed is affected by difficulty settings (slower on higher difficulties).
Functionality:
Once placed, the tower will automatically extract resources based on a cooldown interval.
Resources are added to the player's total when the cooldown finishes.
Does not attack or interact with enemies in any way.
The player cannot control or influence which resource is extracted.
The tower is not moveable once placed.
Upgrades:
Faster Extraction Cycles – Reduces the cooldown interval between extractions, increasing overall resource generation rate.
Reinforced Structure – Increases the tower’s health, making it harder for enemies to destroy.
Balance Considerations:
Provides a strong economic advantage, but requires sacrificing a tower slot.
Its placement is limited to mineral-rich tiles, making positioning strategic.
Vulnerable to enemy attacks, particularly during boss waves when towers can be destroyed.
I want an energy crystal tower. It doesn’t have an active attack, but it buffs other  towers damage, attack speed, and cooldowns for abilities. It would be a late game tower, expensive to unlock

    If the tower has the ability to move, like the artillery or rail gun, I want a button that puts the player into movement mode
    The move button is only available between rounds
    Also for towers that can move I want the panel to show how many spaces it can move between rounds
    I want to refine the shotgun tower, but before we do that, I want to make the shotgun tower and flamethrower tower mutually exclusive. At the beginning of each level the player has to choose if they want to outfit the tower with the flamethrower or shotgun. The map description will tell them whether to expect more aliens or more humans so they can choose accordingly since the shotgun tower is better against humans and the flamethrower is better against aliens
    Sounds good! The Artillery and Rail Gun Towers will now be a mutually exclusive choice at the start of each level.

The Artillery Tower will remain a splash damage, long-range option.
The Rail Gun Tower will stay as a single-target, high-damage, armor-piercing option.
The decision will be based on enemy composition hints in the map description—favoring Artillery for groups of lighter units and Rail Gun for heavy, armored enemies.
Also, the rail gun and artillery should be combined in the same way we combined the shotgun and flamethrower
I’d like to set a game constraint so that it’s only possible to build towers between rounds, not during the waves

**Enemies / Abilities**
Human Ground Units
1. Infantry (Basic Soldiers)
Role: Standard foot soldiers that attack in numbers.
Behavior: Moves in squads, takes cover when under fire.
Abilities:
Can spread out to reduce AoE damage.
May fire small arms at defenses, though ineffective.
Strengths: Numerous, cheap, and can flood defenses.
Weaknesses: Low health, weak against AoE attacks.
2. Medic (Support Unit)
Role: Keeps Infantry and other units alive longer.
Behavior: Stays behind frontlines, healing nearby allies.
Abilities:
Heals nearby ground units over time.
Can deploy a temporary healing drone to assist injured allies.
Strengths: Extends survivability of other units.
Weaknesses: Low health, doesn’t attack, weak to snipers or focused fire.
3. Scout Vehicle (Fast Recon Unit)
Role: Quick-moving vehicle that disrupts defenses.
Behavior: Rushes ahead of main forces to distract or disable towers.
Abilities:
Can jam nearby towers, reducing their fire rate or accuracy.
Moves too fast for slow-firing towers to hit easily.
Strengths: Speed, ability to disrupt static defenses.
Weaknesses: Low armor, weak to rapid-fire or tracking weapons.
4. Tank (Heavily Armored Assault Vehicle)
Role: High-health unit meant to absorb damage.
Behavior: Moves steadily, leading the charge for other units.
Abilities:
Deploys a temporary smoke screen to reduce tower accuracy.
Resistant to explosions and small arms fire.
Strengths: High durability, can shield other units.
Weaknesses: Slow movement, vulnerable to armor-piercing or energy weapons.

Human Air Units
1. Scout Drone (Fast Recon Unit)
Role: Quick-moving drone that gathers intel and disrupts defenses.
Behavior: Flies ahead of other units, avoiding most attacks.
Abilities:
Can briefly jam targeting systems of nearby towers.
Extremely fast, making it difficult to hit with slow-firing weapons.
Strengths: High speed, hard to target, disrupts enemy defenses.
Weaknesses: Very low health, vulnerable to anti-air tracking weapons.
2. Light Fighter Jet (Air Superiority Unit)
Role: Agile aircraft designed to clear the skies.
Behavior: Patrols the battlefield, escorting bombers and battleships.
Abilities:
Shoots down hostile aerial threats (if applicable).
Can deploy flares to temporarily evade attacks.
Strengths: Fast, agile, effective at protecting other air units.
Weaknesses: Light armor, ineffective against ground-based defenses.
3. Medium Bomber (Ground Attack Unit)
Role: Delivers payloads against static defenses.
Behavior: Moves in a straight line, dropping bombs at set intervals.
Abilities:
I want the medium bombers to have a flare ability that temporarily blinds towers
Drops explosive ordinance that can disable certain towers temporarily.
Strengths: Deals heavy damage, can temporarily disrupt enemy defenses.
Weaknesses: Medium speed, vulnerable to anti-air defenses.
4. Heavy Battleship (Flying Fortress)
Role: Slow but heavily armored aerial warship.
Behavior: Moves steadily across the battlefield, supporting ground forces.
Abilities:
Can fire artillery strikes on key targets.
Deploys defensive shields to protect nearby air units.
Strengths: High durability, provides powerful support to other units.
Weaknesses: Extremely slow, massive target, weak to concentrated anti-air fire.

**Bosses / Abilities**
    Every so often, maybe like every ten rounds, is a boss round
    I was thinking that during boss rounds, the player’s towers are no longer invincible and the enemy units can attack them, potentially destroying them for good
    I think certain enemies should prioritize certain types of towers, unless the player has not placed them
    Main story boss appears at the end of each planet scripted to make the player lose, until the final level on the Space Platform defending Earth

**Currencies**
    +Minerals:
        Earned from killing enemies and completing levels quickly.
        Can be mined from Mineral Deposits with a Mining Tower.
        Used to build and repair Towers as well as upgrades.
    +Power Crystals:
        Earned from killing enemies and completing levels quickly. (Slower rate than minerals)
        Can be mined from Mineral Deposits with a Mining Tower. (Slower rate than minerals)
    +Tower Research Points:
        Earned from completing waves/levels.
        Used to research new tower types and upgrade tower abilities.

**Global Upgrades / Abilities**
    I want to add a general upgrade feature that increases the armor of every tower that is placed
    Oh two separate upgrades, one that protects against bullets/explosives, and one that protects against biological attacks from the alien enemies
    The armor upgrades will be global, other tower upgrades will be individual
    I think all towers will start with 1 Armor and each global upgrade will add +1 Armor
    Oh wait, I meant all towers will have at least 1 base armor. The more advanced towers will have different amounts to help balance their strength of damage or abilities