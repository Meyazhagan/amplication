import * as models from "../models";

import {
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";

type Props = {
  resource: models.Resource;
};

function ResourceGitOrg({ resource }: Props) {
  const { gitRepository } = resource;

  const provider = gitRepository?.gitOrganization?.provider;

  const gitOrg = gitRepository
    ? provider === models.EnumGitProvider.Bitbucket
      ? gitRepository.groupName
      : gitRepository?.gitOrganization.name
    : undefined;

  return (
    <FlexItem
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Small}
      margin={EnumFlexItemMargin.None}
    >
      {gitOrg ? (
        <>
          <Icon
            icon={gitProviderIconMap[provider || models.EnumGitProvider.Github]}
            size="xsmall"
          />
          <Text
            textStyle={EnumTextStyle.Subtle}
            textColor={EnumTextColor.White}
          >
            {gitOrg}
          </Text>
        </>
      ) : (
        <Text
          textStyle={EnumTextStyle.Subtle}
          textColor={EnumTextColor.ThemeRed}
        >
          Not connected
        </Text>
      )}
    </FlexItem>
  );
}

export default ResourceGitOrg;
