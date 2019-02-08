'use strict'
const AWS = require('aws-sdk');
let tableClient = new AWS.DynamoDB.DocumentClient({
    'region': 'us-east-2'
});

function scanFn(params, searchStr) {
    return new Promise((resolve, reject) => {
        tableClient.scan(params, (err, data) => {
            if(err){
                reject(err);
            } else {
                let attr = params.ProjectionExpression.slice(4);
                
                let rawVals = [];
                data.Items.forEach(i => {
                    if(i[attr].length > searchStr.length){
                        if (i[attr].toLowerCase().includes(searchStr)) {
                            rawVals.push(i);
                        }
                    } else if (i[attr].length === searchStr.length) {
                        if (i[attr] === searchStr) {
                            rawVals.push(i);
                        }
                    }
                })
                resolve(rawVals);
            }
        });
    });
}

function runScansPerAttr(searchStr) {
    // this function will run a scan on each attribute

    return new Promise((resolve, reject) => {
        let matchResults = [];
        const attrArr = ["Cost", "Department", "Description", "Price", "ShelfLife", "lastSold", "xFor"];
        let count = 1;
        const arrlength = attrArr.length;
        attrArr.forEach(i => {
            const params = {
                TableName: 'grocery_products',
                ProjectionExpression: `ID, ${i}`
            };
            
            scanFn(params, searchStr)
                .then(matches => {
                    count++;
                    matchResults = matchResults.concat(matches);
                    if (count === arrlength) {
                        resolve(matchResults);
                    }
                    
                })
                .catch(err => {
                    console.log("err", err);
                    reject(err);
                });
                

        });
        

    })
}

//in event need to pass in what we are looking for
exports.handler = (event, context, callback) => {
    let res;
    let str = event.queryStringParameters.searchStr.toLowerCase();
    runScansPerAttr(str).then(matches => {
        res = matches;
        callback(null, {"statusCode": 200, "body": JSON.stringify(res)});
    })
    
};