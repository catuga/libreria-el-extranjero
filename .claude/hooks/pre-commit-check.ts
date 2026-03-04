import * as ts from "typescript";
import * as path from "path";

async function readInput() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

function runTypeCheck(configPath: string): string | null {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    console.error(
      ts.formatDiagnostic(configFile.error, {
        getCanonicalFileName: (x) => x,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    );
    return null;
  }

  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
  };

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(configPath)
  );

  const compilerOptions = { ...parsed.options, noEmit: true, incremental: false };
  const program = ts.createProgram(parsed.fileNames, compilerOptions);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);

  if (allDiagnostics.length > 0) {
    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    return ts.formatDiagnostics(Array.from(allDiagnostics), formatHost);
  }

  return null;
}

async function main() {
  const input = await readInput();
  const command: string = input.tool_input?.command ?? "";

  // Only run on git commit
  if (!/^\s*git commit/.test(command)) {
    process.exit(0);
  }

  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const tsconfigPath = path.join(projectDir, "tsconfig.json");

  console.error("Checking TypeScript types...");
  const errors = runTypeCheck(tsconfigPath);

  if (errors) {
    console.error(errors);
    process.exit(2);
  }
}

main();
