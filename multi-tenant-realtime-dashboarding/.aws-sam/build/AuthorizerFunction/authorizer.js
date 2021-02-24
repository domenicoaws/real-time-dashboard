exports.handler = async (event) => {
    if ('pathParameters' in event && 'tenantId' in event.pathParameters) { // check if the path parameter is present
      var response =  {
        policyDocument: {
          Version: '2012-10-17',
          Statement: [{ // allow all HTTP methods on all resources
            Action: 'execute-api:Invoke',
            Effect: 'Allow', 
            Resource: event.methodArn
          }]
        }
      };
      response.context = {
          "tenantId": event.pathParameters.tenantId
      };
      return response
    } else {
      throw new Error('path parameter tenantId missing');
    }
  };