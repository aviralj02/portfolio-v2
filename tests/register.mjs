import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Teaches Node's ESM resolver the two things the app's source assumes and a
 * bare `node --test` does not: the `@/*` alias from tsconfig.json, and a
 * bundler's habit of finding `./thing` at `./thing.ts`. With those in place
 * the tests import modules by exactly the specifier the app uses, so a test
 * can never pass against a file the build does not load.
 *
 * Node 24 strips the types itself, so nothing has to be compiled first.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSIONS = [".ts", ".mts", ".js", ".mjs", ".cjs", ".json"];

const isFile = (path) => existsSync(path) && statSync(path).isFile();

const locate = (path) => {
  if (isFile(path)) return path;

  for (const extension of EXTENSIONS) {
    if (isFile(`${path}${extension}`)) return `${path}${extension}`;
  }

  for (const extension of EXTENSIONS) {
    if (isFile(resolve(path, `index${extension}`)))
      return resolve(path, `index${extension}`);
  }

  return null;
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate = null;

    if (specifier.startsWith("@/")) {
      candidate = resolve(root, specifier.slice(2));
    } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      candidate = resolve(dirname(fileURLToPath(context.parentURL)), specifier);
    }

    const found = candidate && locate(candidate);
    if (found) {
      return {
        url: pathToFileURL(found).href,
        shortCircuit: true,
        /* Named explicitly: without a `type` field in package.json Node would
           otherwise try CommonJS first and warn on every module it reparses. */
        format: found.endsWith(".ts") ? "module-typescript" : undefined,
      };
    }

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      /* Packages that publish no `exports` map for a subpath — `next/server`
         among them — resolve only because a bundler adds the extension. */
      if (specifier.startsWith(".") || specifier.startsWith("node:")) throw error;

      return nextResolve(`${specifier}.js`, context);
    }
  },
});
