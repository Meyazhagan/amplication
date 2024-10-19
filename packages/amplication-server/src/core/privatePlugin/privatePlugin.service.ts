import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePrivatePluginArgs } from "./dto/CreatePrivatePluginArgs";
import { FindManyPrivatePluginArgs } from "./dto/FindManyPrivatePluginArgs";
import { PrivatePlugin } from "./dto/PrivatePlugin";
import { UpdatePrivatePluginArgs } from "./dto/UpdatePrivatePluginArgs";
import { DeletePrivatePluginArgs } from "./dto/DeletePrivatePluginArgs";
import { User } from "../../models";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationError } from "../../errors/AmplicationError";
import {
  CODE_GENERATOR_NAME_TO_ENUM,
  ResourceService,
} from "../resource/resource.service";
import { CreatePrivatePluginVersionArgs } from "./dto/CreatePrivatePluginVersionArgs";
import { PrivatePluginVersion } from "./dto/PrivatePluginVersion";
import { UpdatePrivatePluginVersionArgs } from "./dto/UpdatePrivatePluginVersionArgs";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";

const DEFAULT_PRIVATE_PLUGIN_VERSION: Omit<PrivatePluginVersion, "version"> = {
  deprecated: false,
  enabled: true,
  settings: null,
  configurations: null,
};

@Injectable()
export class PrivatePluginService extends BlockTypeService<
  PrivatePlugin,
  FindManyPrivatePluginArgs,
  CreatePrivatePluginArgs,
  UpdatePrivatePluginArgs,
  DeletePrivatePluginArgs
> {
  blockType = EnumBlockType.PrivatePlugin;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger,
    protected readonly billingService: BillingService,
    protected readonly resourceService: ResourceService
  ) {
    super(blockService, logger);
  }

  //return all private plugins in the resource's project
  //disabled plugins can be used for setup - but should not be used in build time
  async availablePrivatePluginsForResource(
    args: FindManyPrivatePluginArgs
  ): Promise<PrivatePlugin[]> {
    const resource = await this.resourceService.resource({
      where: {
        id: args.where?.resource.id,
      },
    });

    if (!resource) {
      return [];
    }

    return await this.findMany({
      ...args,
      where: {
        ...args.where,
        resource: {
          deletedAt: null,
          archived: {
            not: true,
          },
          projectId: resource.projectId,
        },
        codeGenerator: {
          equals:
            CODE_GENERATOR_NAME_TO_ENUM[resource.codeGeneratorName] ||
            EnumCodeGenerator.NodeJs,
        },
      },
    });
  }

  async findMany(
    args: FindManyPrivatePluginArgs,
    user?: User
  ): Promise<PrivatePlugin[]> {
    const codeGeneratorFilter = args.where?.codeGenerator;
    delete args.where?.codeGenerator;

    if (codeGeneratorFilter) {
      const filter = {
        path: ["codeGenerator"],
        equals: codeGeneratorFilter.equals,
      };

      return this.findManyBySettings(args, filter);
    }

    return super.findMany(args, user);
  }

  async create(
    args: CreatePrivatePluginArgs,
    user: User
  ): Promise<PrivatePlugin> {
    await this.validateLicense(user.workspace?.id);

    return super.create(args, user);
  }

  async validateLicense(workspaceId: string): Promise<void> {
    const entitlement = await this.billingService.getBooleanEntitlement(
      workspaceId,
      BillingFeature.PrivatePlugins
    );

    if (entitlement && !entitlement.hasAccess)
      throw new AmplicationError(
        `Feature Unavailable. Please upgrade your plan to use the Private Plugins Module.`
      );
  }

  async createVersion(
    args: CreatePrivatePluginVersionArgs,
    user: User
  ): Promise<PrivatePluginVersion> {
    const plugin = await super.findOne({
      where: { id: args.data.privatePlugin.connect.id },
    });
    if (!plugin) {
      throw new AmplicationError(
        `Private Plugin not found, ID: ${args.data.privatePlugin.connect.id}`
      );
    }

    const existingVersion = plugin.versions?.find(
      (property) => property.version === args.data.version
    );
    if (existingVersion) {
      throw new AmplicationError(
        `Version already exists, version: ${args.data.version}, Private Plugin ID: ${args.data.privatePlugin.connect.id}`
      );
    }

    const newVersion: PrivatePluginVersion = {
      ...DEFAULT_PRIVATE_PLUGIN_VERSION,
      version: args.data.version,
    };

    await super.update(
      {
        where: { id: plugin.id },
        data: {
          enabled: plugin.enabled,
          versions: [...(plugin.versions || []), newVersion],
        },
      },
      user
    );

    return newVersion;
  }

  async updateVersion(
    args: UpdatePrivatePluginVersionArgs,
    user: User
  ): Promise<PrivatePluginVersion> {
    const plugin = await super.findOne({
      where: { id: args.where.privatePlugin.id },
    });
    if (!plugin) {
      throw new AmplicationError(
        `Private Plugin not found, ID: ${args.where.privatePlugin.id}`
      );
    }

    const existingVersionIndex = plugin.versions?.findIndex(
      (version) => version.version === args.where.version
    );

    if (existingVersionIndex === -1) {
      throw new AmplicationError(
        `Private Plugin Version not found, version: ${args.where.version}, Private Plugin ID: ${args.where.privatePlugin.id}`
      );
    }

    const existingVersion = plugin.versions[existingVersionIndex];

    const updatedVersion = {
      ...existingVersion,
      ...args.data,
    };

    plugin.versions[existingVersionIndex] = updatedVersion;

    await super.update(
      {
        where: { id: plugin.id },
        data: {
          enabled: plugin.enabled,
          versions: plugin.versions,
        },
      },
      user
    );

    return updatedVersion;
  }
}
