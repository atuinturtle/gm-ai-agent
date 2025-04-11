import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { actions, attributes, crew_types, hunting_grounds, playbooks } from '../schema';
import { eq } from 'drizzle-orm';
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(process.env.DATABASE_URL as string, { prepare: false })
export const db = drizzle(client);

async function seed() {
    await db.insert(playbooks).values([
        { id: 1, name: 'Cutter', description: 'A dangerous and intimidating fighter' },
        { id: 2, name: 'Hound', description: 'A deadly sharpshooter and tracker' },
        { id: 3, name: 'Leech', description: 'A saboteur and technician' },
        { id: 4, name: 'Lurk', description: 'A stealthy infiltrator and burglar' },
        { id: 5, name: 'Slide', description: 'A subtle manipulator and spy' },
        { id: 6, name: 'Spider', description: 'A devious mastermind' },
        { id: 7, name: 'Whisper', description: 'An arcane adept and channeler' },
    ]).onConflictDoNothing({ target: playbooks.id });

    await db.insert(attributes).values([
        { id: 1, name: 'Insight', description: 'A physical powerhouse' },
        { id: 2, name: 'Prowess', description: 'A clever and resourceful strategist' },
        { id: 3, name: 'Resolve', description: 'A resilient and determined fighter' },
    ]).onConflictDoNothing({ target: attributes.id });

    await db.insert(actions).values([
        { id: 1, name: 'Hunt', attribute_id: 1, description: 'When you Hunt, you carefully track a target. You might follow a person or discover their location. You might arrange an ambush. You might attack with precision shooting from a distance. You could try to bring your guns to bear in a melee (but Skirmishing might be better).' },
        { id: 2, name: 'Study', attribute_id: 1, description: 'When you Study, you scrutinize details and interpret evidence. You might gather information from documents, newspapers, and books. You might do research on an esoteric topic. You might closely analyze a person to detect lies or true feelings. You could try to examine events to understand a pressing situation (but Surveying might be better).' },
        { id: 3, name: 'Survey', attribute_id: 1, description: 'When you Survey, you observe the situation and anticipate outcomes. You might spot telltale signs of trouble before it happens. You might uncover opportunities or weaknesses. You might detect a person\'s motivations or intentions (but Studying might be better). You could try to spot a good ambush point (but Hunting might be better).' },
        { id: 4, name: 'Tinker', attribute_id: 1, description: 'When you Tinker, you fiddle with devices and mechanisms. You might create a new gadget or alter an existing item. You might pick a lock or crack a safe. You might disable an alarm or trap. You might turn the sparkcraft and electroplasmic devices around the city to your advantage. You could try to use your technical expertise to control a vehicle (but Finessing might be better).' },
        { id: 5, name: 'Finesse', attribute_id: 2, description: 'When you Finesse, you employ dextrous manipulation or subtle misdirection. You might pick someone\'s pocket. You might handle the controls of a vehicle or direct a mount. You might formally duel an opponent with graceful fighting arts. You could try to employ those arts in a chaotic melee (but Skirmishing might be better). You could try to pick a lock (but Tinkering might be better).' },
        { id: 6, name: 'Prowl', attribute_id: 2, description: 'When you Prowl, you traverse skillfully and quietly. You might sneak past a guard or hide in the shadows. You might run and leap across the rooftops. You might attack someone from hiding with a back-stab or blackjack. You could try to waylay a victim in the midst of battle (but Skirmishing might be better)' },
        { id: 7, name: 'Skirmish', attribute_id: 2, description: 'When you Skirmish, you entangle a target in close combat so they can\'t easily escape. You might brawl or wrestle with them. You might hack and slash. You might seize or hold a position in battle. You could try to fight in a formal duel (but Finessing might be better).' },
        { id: 8, name: 'Wreck', attribute_id: 2, description: 'When you Wreck, you unleash savage force. You might smash down a door or wall with a sledgehammer, or use an explosive to do the same. You might employ chaos or sabotage to create a distraction or overcome an obstacle. You could try to overwhelm an enemy with sheer force in battle (but Skirmishing might be better).' },
        { id: 9, name: 'Attune', attribute_id: 3, description: 'When you Attune, you open your mind to the ghost field or channel nearby electroplasmic energy through your body. You might communicate with a ghost or understand aspects of spectrology. You could try to perceive beyond sight in order to better understand your situation (but Surveying might be better).' },
        { id: 10, name: 'Command', attribute_id: 3, description: 'When you Command, you compel swift obedience. You might intimidate or threaten to get what you want. You might lead a gang in a group action. You could try to order people around to persuade them (but Consorting might be better).' },
        { id: 11, name: 'Consort', attribute_id: 3, description: 'When you Consort, you socialize with friends and contacts. You might gain access to resources, information, people, or places. You might make a good impression or win someone over with your charm and style. You might make new friends or connect with your heritage or background. You could try to direct your friends with social pressure (but Commanding might be better).' },
        { id: 12, name: 'Sway', attribute_id: 3, description: 'When you Sway, you influence someone with guile, charm, or argument. You might lie convincingly. You might persuade someone to do what you want. You might argue a case that leaves no clear rebuttal. You could try to trick people into affection or obedience (but Consorting or Commanding might be better).' },
    ]).onConflictDoNothing({ target: actions.id });

    await db.insert(crew_types).values([
        { id: 1, name: 'Assassins', description: 'Killers for hire' },
        { id: 2, name: 'Bravos', description: 'Mercenaries and thugs' },
        { id: 3, name: 'Cult', description: 'Acolytes of a forgotten god' },
        { id: 4, name: 'Hawkers', description: 'Vice dealers' },
        { id: 5, name: 'Shadows', description: 'Thieves and spies' },
        { id: 6, name: 'Smugglers', description: 'Contraband transporters' },
    ]).onConflictDoNothing({ target: crew_types.id });

    await db.insert(hunting_grounds).values([
        { id: 1, crew_type_id: 1, name: 'Accident', description: 'A killing with no telltale signs of murder.' },
        { id: 2, crew_type_id: 1, name: 'Disappearance', description: 'The victim vanishes without a trace.' },
        { id: 3, crew_type_id: 1, name: 'Murder', description: 'An obvious killing that sends a message.' },
        { id: 4, crew_type_id: 1, name: 'Ransom', description: 'A kidnapping and demand for payment for their return.' },
        { id: 5, crew_type_id: 2, name: 'Battle', description: 'Defeat an enemy with overwhelming force.' },
        { id: 6, crew_type_id: 2, name: 'Extortion', description: 'Threaten violence unless you’re paid off.' },
        { id: 7, crew_type_id: 2, name: 'Sabotage', description: 'Hurt an opponent by destroying something.' },
        { id: 8, crew_type_id: 2, name: 'Smash & Grab', description: 'A fast and violent armed robbery.' },
        { id: 9, crew_type_id: 3, name: 'Acquisition', description: 'Procure an arcaneartifact and attune it to your god.' },
        { id: 10, crew_type_id: 3, name: 'Augury', description: 'Do what you must to attract the god’s attention and counsel.' },
        { id: 11, crew_type_id: 3, name: 'Consecration', description: 'Anoint a place for your deity.' },
        { id: 12, crew_type_id: 3, name: 'Sacrifice', description: 'Destroy what is valuable or good in honor of your god.' },
        { id: 13, crew_type_id: 4, name: 'Sale', description: 'A significant transaction with a special buyer of illicit product.' },
        { id: 14, crew_type_id: 4, name: 'Supply', description: 'A transaction to acquire new product or establish a new supplier.' },
        { id: 15, crew_type_id: 4, name: 'Show of Force', description: 'Make an example of an enemy to dominate territory.' },
        { id: 16, crew_type_id: 4, name: 'Socialize', description: 'Improve customer and/or supplier relations with a social event.' },
        { id: 17, crew_type_id: 5, name: 'Burglary', description: 'Theft by breaking and entering.' },
        { id: 18, crew_type_id: 5, name: 'Espionage', description: 'Obtain secret information by covert or clandestine means.' },
        { id: 19, crew_type_id: 5, name: 'Robbery', description: 'Theft by force or threats.' },
        { id: 20, crew_type_id: 5, name: 'Sabotage', description: 'Hurt an opponent by destroying something.' },
        { id: 21, crew_type_id: 6, name: 'Cargo type: Arcane/Weird', description: 'Spirit essences, ghosts, cult materials.' },
        { id: 22, crew_type_id: 6, name: 'Cargo type: Arms', description: 'Restricted military weapons, heavy ordnance, explosives.' },
        { id: 23, crew_type_id: 6, name: 'Cargo type: Contraband', description: 'High-tax luxuries, drugs, banned art, etc.' },
        { id: 24, crew_type_id: 6, name: 'Cargo type: Passengers', description: 'People or livestock traveling in secret.' },
    ]).onConflictDoNothing({ target: hunting_grounds.id });
    
    console.log('Seeded successfully');
}

seed();