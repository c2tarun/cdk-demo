import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");
import api = require("@aws-cdk/aws-apigateway");

export class RandomQuoteStack extends cdk.Stack {
  public readonly randomQuoteLambda: lambda.Function;
  public readonly randomQuoteApi: api.LambdaRestApi;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.randomQuoteLambda = new lambda.Function(this, "randomQuote", {
      runtime: lambda.Runtime.NodeJS810,
      handler: "random_quote.handler",
      code: lambda.Code.asset("lambda")
    });

    this.randomQuoteApi = new api.LambdaRestApi(this, "randomQuoteApi", {
      handler: this.randomQuoteLambda,
      proxy: false
    });

    const randomQuoteLambdaIntegration = new api.LambdaIntegration(this.randomQuoteLambda);
    const quoteApiRes = this.randomQuoteApi.root.addResource("quote");
    quoteApiRes.addMethod("GET", randomQuoteLambdaIntegration, {
      authorizationType: api.AuthorizationType.None,
      apiKeyRequired: false
    });
    quoteApiRes.addMethod("POST", randomQuoteLambdaIntegration, {
      authorizationType: api.AuthorizationType.None,
      apiKeyRequired: false
    });

    this.addCorsOptions(this.randomQuoteApi.root);
    this.addCorsOptions(quoteApiRes);
  }

  addCorsOptions(apiResource: api.IRestApiResource) {
    apiResource.addMethod(
      "OPTIONS",
      new api.MockIntegration({
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers":
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
              "method.response.header.Access-Control-Allow-Credentials": "'false'",
              "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'"
            }
          }
        ],
        passthroughBehavior: api.PassthroughBehavior.Never,
        requestTemplates: {
          "application/json": '{"statusCode": 200}'
        }
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Allow-Credentials": true,
              "method.response.header.Access-Control-Allow-Origin": true
            }
          }
        ]
      }
    );
  }
}
