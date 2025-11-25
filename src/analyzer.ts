import * as ts from 'typescript';

export interface SecurityFinding {
    line: number;
    message: string;
    severity: 'critical' | 'warning';
}

export function analyzeCode(code: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    const sourceFile = ts.createSourceFile(
        'temp.ts',
        code,
        ts.ScriptTarget.Latest,
        true
    );

    function visit(node: ts.Node) {
        // Check for eval()
        if (ts.isCallExpression(node)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression) && expression.text === 'eval') {
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                findings.push({
                    line: line + 1,
                    message: 'Avoid using eval(). It is a security risk.',
                    severity: 'critical',
                });
            }
        }

        // Check for hardcoded secrets (heuristic: variable names containing 'secret' or 'password' or 'token')
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
            const name = node.name.text.toLowerCase();
            if (
                (name.includes('secret') || name.includes('password') || name.includes('token') || name.includes('key')) &&
                node.initializer &&
                ts.isStringLiteral(node.initializer)
            ) {
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                findings.push({
                    line: line + 1,
                    message: `Potential hardcoded secret found in variable '${node.name.text}'.`,
                    severity: 'critical',
                });
            }
        }

        // Check for console.log (quality warning)
        if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.expression) &&
            node.expression.expression.text === 'console' &&
            ts.isIdentifier(node.expression.name) &&
            node.expression.name.text === 'log'
        ) {
            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            findings.push({
                line: line + 1,
                message: 'Avoid using console.log in production code. Use a logger instead.',
                severity: 'warning',
            });
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return findings;
}
