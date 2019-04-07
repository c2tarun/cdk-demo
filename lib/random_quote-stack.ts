import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");

export class RandomQuoteStack extends cdk.Stack {
  public readonly randomQuoteLambda: lambda.Function;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.randomQuoteLambda = new lambda.Function(this, "randomQuote", {
      runtime: lambda.Runtime.NodeJS810,
      handler: "random_quote.handler",
      code: lambda.Code.asset("lambda")
    });
  }
}
