const jwt = require('jsonwebtoken');
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();


exports.handler = async (event) => {
  if(event.path === "/login"){
    return  {
      policyDocument: getAllowPolicyDocument(event)
    }; 
  }
  var token = getAuthorizationToken(event)
  if(token === null){
    return  {
      policyDocument: getDenyPolicyDocument(event)
    }; 
  }
  
  const tenantId = await getTenantIdFromToken(token)
  var response =  {
    policyDocument: getAllowPolicyDocument(event)
  };
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

async function getTenantIdFromToken(token){
  const secret = await ssm.getParameter({
    Name: 'token_secret',
    WithDecryption: true
  }).promise();
  const decodedToken = jwt.verify(token, secret.Parameter.Value);
  return decodedToken.user.tenantId;
}