const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibWltbW8iLCJyb2xlIjoiYWRtaW4iLCJ0ZW5hbnRJZCI6IkJsdWVUZW5hbnQifSwiaWF0IjoxNjE0NTk1NzIzLCJleHAiOjE2MjMyMzU3MjN9.N4ILF3qhF7Dn66BFmFeyvtW_2C2hwHAoWBUr94ntGOE"
  const decodedToken = jwt.verify(token, "secret");
  const tenantId = decodedToken.user.tenantId
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
  console.log("decoded tenant Id " + tenantId);
  response.context = {
      "tenantId": tenantId
  };
  return response
};