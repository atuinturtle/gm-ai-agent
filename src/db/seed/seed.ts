import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { actions, attributes, playbooks } from '../schema';
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

    const insight = await db.select().from(attributes).where(eq(attributes.name, 'Insight')).limit(1);
    const prowess = await db.select().from(attributes).where(eq(attributes.name, 'Prowess')).limit(1);
    const resolve = await db.select().from(attributes).where(eq(attributes.name, 'Resolve')).limit(1);

    await db.insert(actions).values([
        { id: 1, name: 'Hunt', attribute_id: insight[0]?.id, description: 'When you Hunt, you carefully track a target. You might follow a person or discover their location. You might arrange an ambush. You might attack with precision shooting from a distance. You could try to bring your guns to bear in a melee (but Skirmishing might be better).' },
        { id: 2, name: 'Study', attribute_id: insight[0]?.id, description: 'When you Study, you scrutinize details and interpret evidence. You might gather information from documents, newspapers, and books. You might do research on an esoteric topic. You might closely analyze a person to detect lies or true feelings. You could try to examine events to understand a pressing situation (but Surveying might be better).' },
        { id: 3, name: 'Survey', attribute_id: insight[0]?.id, description: 'When you Survey, you observe the situation and anticipate outcomes. You might spot telltale signs of trouble before it happens. You might uncover opportunities or weaknesses. You might detect a person\'s motivations or intentions (but Studying might be better). You could try to spot a good ambush point (but Hunting might be better).' },
        { id: 4, name: 'Tinker', attribute_id: insight[0]?.id, description: 'When you Tinker, you fiddle with devices and mechanisms. You might create a new gadget or alter an existing item. You might pick a lock or crack a safe. You might disable an alarm or trap. You might turn the sparkcraft and electroplasmic devices around the city to your advantage. You could try to use your technical expertise to control a vehicle (but Finessing might be better).' },
        { id: 5, name: 'Finesse', attribute_id: prowess[0]?.id, description: 'When you Finesse, you employ dextrous manipulation or subtle misdirection. You might pick someone\'s pocket. You might handle the controls of a vehicle or direct a mount. You might formally duel an opponent with graceful fighting arts. You could try to employ those arts in a chaotic melee (but Skirmishing might be better). You could try to pick a lock (but Tinkering might be better).' },
        { id: 6, name: 'Prowl', attribute_id: prowess[0]?.id, description: 'When you Prowl, you traverse skillfully and quietly. You might sneak past a guard or hide in the shadows. You might run and leap across the rooftops. You might attack someone from hiding with a back-stab or blackjack. You could try to waylay a victim in the midst of battle (but Skirmishing might be better)' },
        { id: 7, name: 'Skirmish', attribute_id: prowess[0]?.id, description: 'When you Skirmish, you entangle a target in close combat so they can\'t easily escape. You might brawl or wrestle with them. You might hack and slash. You might seize or hold a position in battle. You could try to fight in a formal duel (but Finessing might be better).' },
        { id: 8, name: 'Wreck', attribute_id: prowess[0]?.id, description: 'When you Wreck, you unleash savage force. You might smash down a door or wall with a sledgehammer, or use an explosive to do the same. You might employ chaos or sabotage to create a distraction or overcome an obstacle. You could try to overwhelm an enemy with sheer force in battle (but Skirmishing might be better).' },
        { id: 9, name: 'Attune', attribute_id: resolve[0]?.id, description: 'When you Attune, you open your mind to the ghost field or channel nearby electroplasmic energy through your body. You might communicate with a ghost or understand aspects of spectrology. You could try to perceive beyond sight in order to better understand your situation (but Surveying might be better).' },
        { id: 10, name: 'Command', attribute_id: resolve[0]?.id, description: 'When you Command, you compel swift obedience. You might intimidate or threaten to get what you want. You might lead a gang in a group action. You could try to order people around to persuade them (but Consorting might be better).' },
        { id: 11, name: 'Consort', attribute_id: resolve[0]?.id, description: 'When you Consort, you socialize with friends and contacts. You might gain access to resources, information, people, or places. You might make a good impression or win someone over with your charm and style. You might make new friends or connect with your heritage or background. You could try to direct your friends with social pressure (but Commanding might be better).' },
        { id: 12, name: 'Sway', attribute_id: resolve[0]?.id, description: 'When you Sway, you influence someone with guile, charm, or argument. You might lie convincingly. You might persuade someone to do what you want. You might argue a case that leaves no clear rebuttal. You could try to trick people into affection or obedience (but Consorting or Commanding might be better).' },
    ]).onConflictDoNothing({ target: actions.id });

    console.log('Seeded successfully');
}

seed();