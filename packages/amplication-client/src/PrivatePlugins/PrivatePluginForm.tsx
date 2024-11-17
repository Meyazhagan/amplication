import React, { useMemo } from "react";
import { Formik } from "formik";
import { omit } from "lodash";
import * as models from "../models";
import { TextField, Form, SelectField } from "@amplication/ui/design-system";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import { DisplayNameField } from "../Components/DisplayNameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import BlueprintSelectField from "../Blueprints/BlueprintSelectField";

type Props = {
  onSubmit: (values: models.PrivatePlugin) => void;
  defaultValues?: models.PrivatePlugin;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "versions",
  "__typename",
];

export const INITIAL_VALUES: Partial<models.PrivatePlugin> = {
  pluginId: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["displayName", "pluginId"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
    pluginId: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const CODE_GENERATORS = [
  {
    value: models.EnumCodeGenerator.DotNet,
    label: ".NET",
  },
  {
    value: models.EnumCodeGenerator.NodeJs,
    label: "Node.js",
  },
  {
    value: models.EnumCodeGenerator.Blueprint,
    label: "Blueprints",
  },
];

const PrivatePluginForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.PrivatePlugin;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.PrivatePlugin) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form childrenAsBlocks>
            <FormikAutoSave debounceMS={1000} />
            <TextField disabled label="Plugin Id" name="pluginId" />
            <DisplayNameField
              name="displayName"
              label="Display Name"
              required
            />
            <SelectField
              name="codeGenerator"
              label="Code Generator"
              options={CODE_GENERATORS}
            />

            {formik.values.codeGenerator ===
              models.EnumCodeGenerator.Blueprint && (
              <BlueprintSelectField
                name="blueprints"
                label="Available for Blueprints"
                isMulti
              />
            )}
            <OptionalDescriptionField name="description" label="Description" />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PrivatePluginForm;
