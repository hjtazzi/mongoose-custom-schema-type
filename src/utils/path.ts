import { join, dirname } from "node:path";
import { access, constants, mkdir, unlink } from "node:fs";
import { rejects } from "node:assert";

const main: string = require.main?.path ? require.main.path : dirname(dirname(__dirname));

export const mainPathJoin = (...paths: string[]): string => {
  return join(main, ...paths);
}


export const srcPathJoin = (...paths: string[]): string => {
  return join(main, '/src', ...paths);
}


export const checkMkDir = (dirPath: string) =>
  new Promise<string>((resolve, reject) => {
    const destination = dirPath.split(`${mainPathJoin()}/`)[1];

    try {
      access(dirPath, constants.F_OK, (accessErr) => {
        if (!accessErr)
          return resolve(destination);

        mkdir(dirPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr)
            return reject(mkdirErr);

          return resolve(destination);
        });
      });
    } catch (errors) { return reject(errors); }
  });


export const unlinkFile = (path: string) =>
  new Promise<boolean>((resolve, reject) => {
    unlink(path, (unlinkErr) => {
      if (unlinkErr)
        return reject(unlinkErr);

      return resolve(true);
    });
  });
