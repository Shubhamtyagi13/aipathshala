const pdfParse = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';
import { Pinecone } from '@pinecone-database/pinecone';
import neo4j from 'neo4j-driver';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
const neo4jDriver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://127.0.0.1:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
);

export async function processAndIngestPDF(buffer: Buffer) {
    console.log('[PDF Ingestion] Parsing PDF buffer...');
    const data = await pdfParse(buffer);
    const text = data.text;
    
    // Chunk the text into roughly 3000 character segments
    const chunks = text.match(/.{1,3000}/g) || [];
    console.log(`[PDF Ingestion] Extracted ${chunks.length} chunks from PDF.`);

    for (const [index, chunk] of chunks.entries()) {
        try {
            console.log(`[PDF Ingestion] Processing Chunk ${index + 1}/${chunks.length}...`);
            await extractAndIngestChunk(chunk);
        } catch (error) {
            console.error(`[PDF Ingestion] Failed to ingest chunk ${index + 1}:`, error);
        }
    }
    
    console.log('[PDF Ingestion] PDF Processing Complete.');
}

async function extractAndIngestChunk(text: string) {
    const prompt = `
    Analyze the following textbook excerpt and extract exactly one primary educational concept from it.
    Provide the output in strict JSON format matching this schema:
    {
        "topic": "Name of the primary concept (e.g., 'Resistors in Series')",
        "prerequisites": ["Name of a prerequisite concept"],
        "goldenKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
        "keyPoints": ["Important point 1", "Important point 2"],
        "boardMarkingScheme": {
            "total": "3M",
            "breakdown": [
                { "desc": "Definition or first step", "mark": 1 },
                { "desc": "Formula or second step", "mark": 1 },
                { "desc": "Conclusion or third step", "mark": 1 }
            ]
        }
    }

    Excerpt:
    ${text}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });

    const resultText = response.text || '{}';
    const extractedData = JSON.parse(resultText);

    if (!extractedData.topic) {
         console.log('[PDF Ingestion] No clear topic found in chunk, skipping.');
         return;
    }

    // 1. Ingest Neo4j Graph Nodes
    const session = neo4jDriver.session();
    try {
        const createQuery = `
            MERGE (c:Concept {name: $topic})
            SET c.id = 'ConceptNode_' + replace($topic, ' ', '_')
            WITH c
            UNWIND $prerequisites AS prereqName
            MERGE (p:Concept {name: prereqName})
            SET p.id = 'ConceptNode_' + replace(prereqName, ' ', '_')
            MERGE (c)-[:REQUIRES]->(p)
        `;
        await session.run(createQuery, { 
            topic: extractedData.topic,
            prerequisites: extractedData.prerequisites || []
        });
        console.log(`[Neo4j] Seeded Graph Node: ${extractedData.topic}`);
    } finally {
        await session.close();
    }

    // 2. Ingest Pinecone RAG Embeddings (Padding to 1024d)
    const index = pinecone.Index({ host: 'https://aipathshala-foaljwt.svc.aped-4627-b74a.pinecone.io' });
    const id = `pdf_rag_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await index.upsert({
        records: [{
            id: id,
            values: new Array(1024).fill(0.01), // Dummy embedding since query uses pure metadata filtering
            metadata: {
                topic: extractedData.topic,
                pattern: '3M', // Defaulting extracted schema to 3 Marker format
                goldenKeywords: JSON.stringify(extractedData.goldenKeywords || []),
                keyPoints: JSON.stringify(extractedData.keyPoints || []),
                boardMarkingScheme: JSON.stringify(extractedData.boardMarkingScheme || {})
            }
        }]
    });
    console.log(`[Pinecone] Seeded Vector: ${extractedData.topic}`);
}
