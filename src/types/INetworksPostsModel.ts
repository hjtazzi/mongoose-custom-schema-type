import mongoose from "mongoose";

import * as types from './';

export interface INetworksPostsModel {
  _slug: string;
  networkId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postType?: types.PostsType.NETWORKS;
  viewType: types.NetworksViewsType;
  title: string;
  body: INetworksPostsBodyModel;
  published: Date;
  status: types.PostStatus;
  uLikesRef?: string[];
  seens?: number;
  shared?: number;
}

export type INetworksPostsBodyModel =
  | string
  | string[]
  | INetworksPostsVotingModel[]
  | INetworksPostsFileModel

export interface INetworksPostsVotingModel {
  title: string;
  votes: string[];
}

export interface INetworksPostsFileModel {
  _filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface INetworksPostsMethods { }

export interface TNetworksPostsModel extends mongoose.Model<INetworksPostsModel, {}, INetworksPostsMethods> {
  generateSlug(): Promise<string>;
}
