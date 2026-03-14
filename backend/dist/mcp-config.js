"use strict";
/**
 * AI Pathshala MCP Configuration
 *
 * Model Context Protocol (MCP) prompt instructions to enforce
 * strict compliance for the intelligence pipeline when initializing
 * any session with student metadata.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpConfig = void 0;
exports.mcpConfig = {
    mcpServers: {
        "aipathshala-context": {
            command: "npx",
            args: ["-y", "@aipathshala/mcp-server"],
            env: {
                "NEO4J_URI": "bolt://localhost:7687", // Dynamic injection at runtime
                "PINECONE_API_KEY": "${PINECONE_API_KEY}"
            }
        }
    },
    systemPrompts: {
        // Enforced prompt mapping over 7-Layer Metadata Graph
        warmStart: `
You are the AI Pathshala Metadata Engine evaluator.
You must absolutely conform to the following schema restrictions:
1. Curriculum: Always match against NCERT bounds only.
2. Concept Graph (Neo4j): Limit prerequisite links to max depth = 2.
3. Pedagogy: Obey "Tapasya Mode" logic, responding concisely with zero supportive phrasing.
4. Answer template matching must output EXACT board marking schema scores.
IMPORTANT: You MUST ONLY output structured JSON. DO NOT use conversational filler.
`
    }
};
