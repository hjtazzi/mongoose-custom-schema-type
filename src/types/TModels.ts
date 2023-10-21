import mongoose from "mongoose";
import * as models from '../models';

import { INetworksPostsModel } from "./INetworksPostsModel";

export type TModels =
  | INetworksPostsModel


export type TMongooseModels =
  | typeof models.NetworksPostsModel


export type TModelsDocument<T extends TModels> =
  | mongoose.Document<unknown, {}, T> & Omit<T & { _id: mongoose.Types.ObjectId; }, never>


export * from './INetworksPostsModel';