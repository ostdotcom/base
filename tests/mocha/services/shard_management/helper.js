

const rootPrefix = "../../../.."
;




function Helper(){
}

Helper.prototype = {
  createTableParamsFor: function (tableName) {
    return {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: "tuid",
          KeyType: "HASH"
        },  //Partition key
        {
          AttributeName: "cid",
          KeyType: "RANGE"
        }  //Sort key
      ],
      AttributeDefinitions: [
        {AttributeName: "tuid", AttributeType: "S"},
        {AttributeName: "cid", AttributeType: "N"}
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  }
};

module.exports = new Helper();