const jwt = require('jsonwebtoken');
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const JWT_EXPIRATION_TIME = '100d';

module.exports.handler = async (event, context, callback) => {
    var body = JSON.parse(event.body)
    var user = {
        username: body.username,
        role: body.role,
        tenantId: body.tenantId
    };
    const secret = await ssm.getParameter({
        Name: 'token_secret',
        WithDecryption: true
      }).promise();
    // Issue JWT
    const token = jwt.sign({ user }, secret.Parameter.Value, { expiresIn: JWT_EXPIRATION_TIME });
    const response = { // Success response
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token,
      }),
    };

    callback(null, response);
};