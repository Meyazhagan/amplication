import { Button, Modal, Snackbar } from "@amplication/design-system";
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { match } from "react-router-dom";
import * as H from "history";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";
import CreateServiceWelcome from "./wizard-pages/CreateServiceWelcome";
import ServiceWizard from "./ServiceWizard";
import CreateServiceName from "./wizard-pages/CreateServiceName";
import CreateGithubSync from "./wizard-pages/CreateGithubSync";
import CreateGenerationSettings from "./wizard-pages/CreateGenerationSettings";
import CreateServiceRepository from "./wizard-pages/CreateServiceRepository";
import CreateServiceDatabase from "./wizard-pages/CreateServiceDatabase";
import CreateServiceAuth from "./wizard-pages/CreateServiceAuth";
import { schemaArray, ResourceInitialValues } from "./wizardResourceSchema";
import { ResourceSettings } from "./wizard-pages/interfaces";
import CreateServiceBuild from "./wizard-pages/CreateServiceBuild";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

const CreateServiceWizard: React.FC<Props> = ({
  moduleClass,
  innerRoutes,
  ...props
}) => {
  const { errorCreateService } = useContext(AppContext);
  const defineUser = (props.location.state as "signup" | "login") || "login";
  const resourceSettingsRef: MutableRefObject<ResourceSettings> = useRef();

  const errorMessage = formatError(errorCreateService);

  const createResource = useCallback((values: ResourceSettings) => {
    // at the end of the process this function will trigger create service
  }, []);
  // on refresh if the route is not the base redirect to base
  /// wizardHook => defineUser | createResource | loadingResource | route to go | progressBar

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardBaseRoute={""}
        wizardPattern={
          defineUser === "login"
            ? [1, 2, 3, 4, 5, 6, 8]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        context={{
          submitWizard: createResource,
          resourceSettingsRef,
        }}
        moduleCss={moduleClass}
      >
        <CreateServiceWelcome moduleCss={moduleClass} path="welcome" />
        <CreateServiceName moduleCss={moduleClass} path="service-name" />
        <CreateGithubSync moduleCss={moduleClass} path="github-sync" />
        <CreateGenerationSettings
          moduleCss={moduleClass}
          path="generation-settings"
        />
        <CreateServiceRepository moduleCss={moduleClass} path="repository" />
        <CreateServiceDatabase moduleCss={moduleClass} path="data-base" />
        <CreateServiceAuth moduleCss={moduleClass} path="auth" />
        <CreateServiceBuild moduleCss={moduleClass} path="build" />
        <div path="end">end of wizard - 8</div>
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
