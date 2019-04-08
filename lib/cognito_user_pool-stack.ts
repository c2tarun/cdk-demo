import cdk = require("@aws-cdk/cdk");
import cognito = require("@aws-cdk/aws-cognito");

export class CognitoUserPool extends cdk.Construct {
  public readonly userPool: cognito.CfnUserPool;

  constructor(scope: cdk.Construct, name: string) {
    super(scope, name);

    this.userPool = new cognito.CfnUserPool(this, name, {
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: false
      }
    });

    new cognito.CfnUserPoolClient(this, name + "client", {
      userPoolId: this.userPool.ref
    });
  }
}
