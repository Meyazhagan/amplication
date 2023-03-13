import { Button, EnumButtonStyle, Icon } from "@amplication/design-system";
import React, { useState } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";

const CreateServiceDatabase: React.FC<WizardStepProps> = ({ moduleClass }) => {
  const [chooseOption, setChooseOption] = useState<string>("Monorepo");

  const PLUGIN_LOGO_BASE_URL =
    "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

  const handleOptionChoose = (event) => {
    setChooseOption(event.target.innerText);
  };

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Which database do you want to use?"
          text={`Amplication generates the service with all the required configuration and code to start working with a DB. 
          
          You can easily change the type of the DB later in the plugins page
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${moduleClass}__repo_wrapper`}>
          <div className={`${moduleClass}__db_box`}>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <img
                  className={`${moduleClass}_db_btn`}
                  src={`${PLUGIN_LOGO_BASE_URL}db-postgres.png`}
                  alt={""}
                ></img>
              </Button>
              <label>PostgreSQL DB</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Use a Mongo database in the service generated by Amplication
              </div>
            </div>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <img
                  className={`${moduleClass}_db_btn`}
                  src={`${PLUGIN_LOGO_BASE_URL}db-mongo.png`}
                  alt={""}
                ></img>
              </Button>
              <label>Mongo DB</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Use a Mongo database in the service generated by Amplication
              </div>
            </div>
          </div>
          <div className={`${moduleClass}__db_box`}>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <img
                  className={`${moduleClass}_db_btn`}
                  src={`${PLUGIN_LOGO_BASE_URL}db-mysql.png`}
                  alt={""}
                ></img>
              </Button>
              <label>MySQL DB</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Use a Mongo database in the service generated by Amplication
              </div>
            </div>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <Icon
                  size="xsmall"
                  className={`${moduleClass}_db_btn`}
                  icon={"server"}
                ></Icon>
              </Button>
              <label>No database</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Start using your service without a database
              </div>
            </div>
          </div>
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceDatabase;
