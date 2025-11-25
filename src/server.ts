import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { analyzeCode } from './analyzer.js';

const server = new Server(
    {
        name: 'ast-sast-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'security_review',
                description: 'Analyze code for security vulnerabilities and quality issues using AST analysis.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            description: 'The source code to analyze.',
                        },
                    },
                    required: ['code'],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'security_review') {
        const { code } = z
            .object({
                code: z.string(),
            })
            .parse(request.params.arguments);

        const findings = analyzeCode(code);

        if (findings.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: '✅ No security or quality issues found.',
                    },
                ],
            };
        }

        const report = findings
            .map(
                (f) =>
                    `[${f.severity.toUpperCase()}] Line ${f.line}: ${f.message}`
            )
            .join('\n');

        return {
            content: [
                {
                    type: 'text',
                    text: `⚠️ Issues found:\n\n${report}`,
                },
            ],
        };
    }

    throw new Error('Tool not found');
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('AST SAST MCP Server running on stdio');
}

run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
