
import { resolve, join } from "path";

const CWD = process.cwd()

export function resolvePath(...path: string[]): string {
  return resolve(CWD, join(...path))
}

export function run(task: () => Promise<void>) {
  task()
    .then(() => process.exit(0))
    .catch((error: any) => {
      console.error(`\n  \x1b[31m✖\x1b[0m ${ error.message }\n`)
      console.error(error)
      process.exit(1)
    })
}

