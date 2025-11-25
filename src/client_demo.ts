import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['build/server.js'],
    });

    const client = new Client(
        {
            name: 'ast-sast-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    await client.connect(transport);

    console.log('Connected to MCP Server');

    // List tools
    const tools = await client.listTools();
    console.log('Available Tools:', tools.tools.map((t) => t.name));

    // Test Case 1: Safe Code
    console.log('\n--- Testing Safe Code ---');
    const safeCode = `
    function add(a: number, b: number) {
      return a + b;
    }
  `;
    const resultSafe: any = await client.callTool({
        name: 'security_review',
        arguments: { code: safeCode },
    });

    // The result content is an array of content objects
    if (resultSafe.content && resultSafe.content[0].type === 'text') {
        console.log('Result:', resultSafe.content[0].text);
    } else {
        console.log('Result:', JSON.stringify(resultSafe));
    }


    // Test Case 2: Unsafe Code
    console.log('\n--- Testing Unsafe Code ---');
    const unsafeCode = `
    function hack() {
      const mySecret = "super_secret_password_123";
      eval("console.log('hacked')");
      console.log(mySecret);
    }
  `;
    const resultUnsafe: any = await client.callTool({
        name: 'security_review',
        arguments: { code: unsafeCode },
    });

    if (resultUnsafe.content && resultUnsafe.content[0].type === 'text') {
        console.log('Result:', resultUnsafe.content[0].text);
    } else {
        console.log('Result:', JSON.stringify(resultUnsafe));
    }

    await client.close();
}

main().catch(console.error);
