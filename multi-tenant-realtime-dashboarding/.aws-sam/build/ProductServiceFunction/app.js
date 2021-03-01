exports.lambdaHandler = async (event) => {
    const tenantId = event.requestContext.authorizer.tenantId
    if(event["queryStringParameters"] && event["queryStringParameters"]['generate_error']){
        return {
            statusCode:500
        }
    }

    if(event["queryStringParameters"] && event["queryStringParameters"]['slowness']){
        await sleep(randomNumber(500,3000));
    }
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Products for tenant ' + tenantId),
    };
    return response;
};

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}
