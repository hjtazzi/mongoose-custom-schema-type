import mongoose from "mongoose";

import {
  StaticValues,
  INetworksPostsModel,
  INetworksPostsBodyModel,
  INetworksPostsVotingModel,
  INetworksPostsFileModel,
  INetworksPostsMethods,
  TNetworksPostsModel,
  PostsType,
  PostStatus
} from "../types";
import { generatorPass } from "../utils";

const Schema = mongoose.Schema;
const Types = Schema.Types;
const prefix = StaticValues.CollectionPrefix;

// Networks Posts Model Custom Schema Types
declare module 'mongoose' {
  namespace Schema {
    namespace Types {
      class NetworksPostsBody extends SchemaType { }
    }
  }
}

export class NetworksPostsBody extends mongoose.SchemaType {
  constructor(key: any, options: any) {
    super(key, options, 'NetworksPostsBody');
  }

  cast(value: any): INetworksPostsBodyModel {
    // simple post
    if (typeof value === "string") {
      const simplePost: string = value;
      return simplePost;
    }

    if (Array.isArray(value)) {
      // visual post
      const isStringArray =
        value.length > 0 &&
        value.every(val => typeof val === 'string');

      if (isStringArray) {
        const visualPost: string[] = value;
        return visualPost;
      }

      // voting post
      const isVotingArray =
        value.length > 1 &&
        value.every(val => {
          const isVotingVars = 'title' in val && 'votes' in val;

          if (isVotingVars) {
            const isVotingTitleType = typeof val.title === "string";
            const isVotingVotesType = Array.isArray(val.votes);

            if (isVotingTitleType && isVotingVotesType) {
              const isVotingVotesStringArray: boolean =
                val.votes.every((vote: any) => typeof vote === "string");

              return isVotingVotesStringArray;
            }
          }

          return false;
        });

      if (isVotingArray) {
        const votingPost: INetworksPostsVotingModel[] = value;
        return votingPost;
      }
    }

    // file post
    if (typeof value === "object") {
      const isFileVars =
        "_filename" in value &&
        "originalname" in value &&
        "mimetype" in value &&
        "size" in value &&
        "path" in value;

      const isFileVarsType =
        typeof value._filename === "string" &&
        typeof value.originalname === "string" &&
        typeof value.mimetype === "string" &&
        typeof value.size === "number" &&
        typeof value.path === "string";

      if (isFileVars && isFileVarsType) {
        const filePost: INetworksPostsFileModel = value;
        return filePost;
      }
    }

    throw new Error(`${value} \n is not a valid.`);
  }
}
mongoose.Schema.Types.NetworksPostsBody = NetworksPostsBody;

// Networks Posts Model Schema
const NetworksPostsShema = new Schema<INetworksPostsModel, TNetworksPostsModel, INetworksPostsMethods>({
  _slug: {
    type: Types.String,
    index: true,
    unique: true,
    required: true
  },
  networkId: {
    type: Types.ObjectId,
    index: true,
    required: true
  },
  userId: {
    type: Types.ObjectId,
    required: true
  },
  postType: {
    type: Types.String,
    required: false,
    default: PostsType.NETWORKS
  },
  viewType: {
    type: Types.String,
    required: true
  },
  title: {
    type: Types.String,
    required: true
  },
  body: {
    type: Types.NetworksPostsBody,
    required: true
  },
  published: {
    type: Types.Date,
    required: true
  },
  status: {
    type: Types.String,
    required: false,
    default: PostStatus.DRAFT
  },
  uLikesRef: {
    type: [Types.String],
    required: false,
    default: []
  },
  seens: {
    type: Types.Number,
    required: false,
    default: 0
  },
  shared: {
    type: Types.Number,
    required: false,
    default: 0
  }
});

// Networks Posts Model Methods
NetworksPostsShema.static(
  'generateSlug',
  function generateSlug() {
    return new Promise<string>((resolve, reject) => {
      const newSlug = generatorPass(24, false);

      this.exists({ _slug: newSlug })
        .then((existsSlug: { _id: mongoose.Types.ObjectId } | null) => {
          if (existsSlug !== null) {
            return this.generateSlug()
              .then(_newSlug => resolve(_newSlug))
              .catch(errors => reject(errors));
          }

          return resolve(newSlug);
        })
        .catch(errors => reject(errors));
    });
  }
);

export const NetworksPostsModel = mongoose.model<INetworksPostsModel, TNetworksPostsModel, INetworksPostsMethods>(`${prefix}Networks_Posts`, NetworksPostsShema);