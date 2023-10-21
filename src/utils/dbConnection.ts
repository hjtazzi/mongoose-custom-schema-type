import { readFile } from 'node:fs';
import mongoose from 'mongoose';

import { TAppConfig } from "../types";
import { mainPathJoin } from "./index";

export class DbConnection {
  private readonly configFile: string = mainPathJoin("app-config.json");
  private config: TAppConfig = {
    authUsername: "",
    authPassword: "",
    databaseName: "",
    connectionString: "",
    privateKey: "",
    publicKey: ""
  };

  constructor(configFile?: string) {
    if (configFile)
      this.configFile = configFile;
  }

  private readConfig(callback: (error: NodeJS.ErrnoException | null, data: TAppConfig) => void) {
    readFile(this.configFile, (err, data: Buffer) => {
      if (err)
        return callback(err, this.config);

      const confData: TAppConfig = JSON.parse(data.toString());
      return callback(null, confData);
    });
  }

  public connect(callback: (error: any, result?: typeof mongoose, config?: TAppConfig) => void) {
    this.readConfig((err, data) => {
      if (err)
        return callback(err);

      this.config = data;
      mongoose.connect(
        this.config.connectionString,
        {
          user: this.config.authUsername,
          pass: this.config.authPassword,
          dbName: this.config.databaseName
        }
      )
        .then(result => {
          return callback(undefined, result, this.config);
        })
        .catch(err => {
          return callback(err);
        });

    });
  }
}
