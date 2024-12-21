import {
  Button,
  EnumButtonStyle,
  FlexItem,
  Snackbar,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import useResourceSettings from "./hooks/useResourceSettings";
import { ResourceSettingsFormFields } from "./ResourceSettingsFormFields";
import { validate } from "../util/formikValidateJsonSchema";
import { useAppContext } from "../context/appContext";
import getPropertiesValidationSchemaUtil from "../CustomProperties/getPropertiesValidationSchemaUtil";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-form";

function ResourceSettingsForm({ resource }: Props) {
  const {
    resourceSettings,
    updateResourceSettings,
    updateError: error,
    loading,
  } = useResourceSettings(resource?.id);

  const {
    blueprintsMap: { blueprintsMapById },
  } = useAppContext();

  const handleSubmit = useCallback(
    (data: models.ResourceSettings) => {
      const { properties } = data;

      updateResourceSettings({
        variables: {
          data: {
            properties,
          },
          resourceId: resource.id,
        },
      }).catch(console.error);
    },
    [updateResourceSettings, resource]
  );

  const validationSchema = useMemo(() => {
    const blueprint = blueprintsMapById[resource?.blueprintId];

    const settingsSchema =
      blueprint &&
      getPropertiesValidationSchemaUtil(Object.values(blueprint.properties));

    const schema = {
      properties: {
        settings: {
          type: "object",
          properties: {
            properties: settingsSchema.schema,
          },
        },
      },
    };

    return schema;
  }, [blueprintsMapById, resource?.blueprintId]);

  const errorMessage = formatError(error);
  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={resourceSettings || { properties: {} }}
        enableReinitialize
        onSubmit={handleSubmit}
        validate={(values: models.ResourceSettings) =>
          validate(values, validationSchema)
        }
      >
        {(formik) => {
          return (
            <>
              <Form>
                <ResourceSettingsFormFields
                  fieldNamePrefix="settings."
                  blueprintId={resource?.blueprintId}
                />

                <div>
                  <FlexItem
                    end={
                      <Button
                        type="submit"
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={!formik.isValid || !formik.dirty || loading}
                      >
                        Save
                      </Button>
                    }
                  ></FlexItem>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error?.message)} message={errorMessage} />
    </div>
  );
}

export default ResourceSettingsForm;
