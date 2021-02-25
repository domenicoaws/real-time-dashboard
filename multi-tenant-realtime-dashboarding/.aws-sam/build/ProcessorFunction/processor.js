exports.handler = (event, context, callback) => {
    const output = event.records.map((record) => {
        const payload =JSON.parse((Buffer.from(record.data, 'base64').toString()))
        console.log("date before processing is " + payload.timestamp)
        const resultPayLoad = {
                timestamp : new Date(payload.timestamp),
                tenantId : payload.tenantId,
                latency : payload.latency,
                requestId: payload.requestId,
                ip_address: payload.ip,
                http_method: payload.httpMethod,
                path: payload.resourcePath,
                status_code: payload.status,
                http_protocol: payload.protocol,
                response_length: payload.responseLength
            };
        console.log(resultPayLoad.timestamp)
        return{
            recordId: record.recordId,
            result: 'Ok',
            data: (Buffer.from(JSON.stringify(resultPayLoad))).toString('base64'),
        };
    });
    callback(null, { records: output });
};