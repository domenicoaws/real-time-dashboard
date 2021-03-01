const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  console.log("request is " + JSON.stringify(event))
  if(event.path === "/login"){
    return  {
      policyDocument: getAllowPolicyDocument(event)
    }; 
  }
  var token = getAuthorizationToken(event)
  console.log("token is " + token)
  if(token === null){
    return  {
      policyDocument: getDenyPolicyDocument(event)
    }; 
  }
  const decodedToken = jwt.verify(token, "secret");
  const tenantId = decodedToken.user.tenantId
  var response =  {
    policyDocument: getAllowPolicyDocument(event)
  };
  console.log("decoded tenant Id " + tenantId);
  response.context = {
      "tenantId": tenantId
  };
  return response
};

function getAuthorizationToken(event){
  if(event["headers"] && event["headers"]['Authorization']){
    return event["headers"]['Authorization']
  }

  if(event["queryStringParameters"] && event["queryStringParameters"]['token']){
    return event["queryStringParameters"]['token']
  }

  return null;
}

function getAllowPolicyDocument(event){
  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Allow', 
      Resource: event.methodArn
    }]
  };
}

function getDenyPolicyDocument(event){
  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Deny', 
      Resource: event.methodArn
    }]
  };
}