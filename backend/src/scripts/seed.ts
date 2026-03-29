import neo4j from 'neo4j-driver';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import path from 'path';

// Load the environment variables strictly from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const neo4jDriver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://127.0.0.1:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'demo1234')
);

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || ''
});

async function seedNeo4j() {
    console.log('\n[Seed] Connecting to local Neo4j...');
    const session = neo4jDriver.session();
    try {
        const createQuery = `
            MERGE (c:Concept {name: 'Spherical Mirrors'})
            SET c.id = 'ConceptNode_Spherical_Mirrors'
            
            MERGE (p:Concept {name: 'Reflection of Light'})
            SET p.id = 'ConceptNode_Reflection'
            
            MERGE (c)-[:REQUIRES]->(p)
            RETURN c.id AS id
        `;
        await session.run(createQuery);
        console.log('[Neo4j] Successfully seeded "Spherical Mirrors" and its prerequisites into graph.');
    } catch (err) {
        console.error('[Neo4j] Failed to seed concepts. Verify your desktop DB is running:', err);
    } finally {
        await session.close();
    }
}

async function seedPinecone() {
    console.log('\n[Seed] Connecting to Pinecone Index...');
    try {
        const index = pinecone.Index({ host: 'https://aipathshala-foaljwt.svc.aped-4627-b74a.pinecone.io' });
        
        await index.upsert({
            records: [{
                id: 'template_spherical_mirrors_3M',
                values: new Array(1024).fill(0.01),
                metadata: {
                    topic: 'Spherical Mirrors',
                    pattern: '3M',
                    goldenKeywords: JSON.stringify(['Pole', 'Center of Curvature', 'Principal Axis']),
                    keyPoints: JSON.stringify([
                        'A spherical mirror is a mirror which has the shape of a piece cut out of a spherical surface.',
                        'Concave mirrors curve inward and converge light rays (Real Focus).',
                        'Convex mirrors bulge outward and diverge light rays (Virtual Focus).'
                    ]),
                    boardMarkingScheme: JSON.stringify({
                        total: '3M',
                        breakdown: [
                            { desc: 'Definition of Spherical Mirror', mark: 1 },
                            { desc: 'Concave mirror focal properties', mark: 1 },
                            { desc: 'Convex mirror focal properties', mark: 1 }
                        ]
                    })
                }
            }]
        });
        console.log('[Pinecone] Successfully seeded "Spherical Mirrors 3M" golden structured template.');
    } catch (err) {
        console.error('[Pinecone] Failed to upsert RAG data. Check API keys and Host URL.', err);
    }
}

async function runSeeder() {
    console.log('=== AI Pathshala Full-Fledged Database Seeder ===');
    await seedNeo4j();
    await seedPinecone();
    
    await neo4jDriver.close();
    console.log('\n[Seed] completed! You may now retry the frontend scan.');
    process.exit(0);
}

runSeeder();
