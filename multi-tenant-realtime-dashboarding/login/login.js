const jwt = require('jsonwebtoken');

const JWT_EXPIRATION_TIME = '100d';

module.exports.handler = (event, context, callback) => {
    var body = event.body;
    const user = {username: body.username, role:body.role, tenantId:body.tenantId}
    // Issue JWT
    const token = jwt.sign({ user }, "secret", { expiresIn: JWT_EXPIRATION_TIME });
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