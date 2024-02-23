const fs = require('fs');
const AWS = require('aws-sdk');

// Set AWS credentials and region
AWS.config.update({
  accessKeyId: 'AKIAUIPMNFMZFH7ZUBO5',
  secretAccessKey: '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',
  region: 'us-east-1',
});

// Create DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Read JSON file
const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
};

// Insert data into DynamoDB
const insertDataIntoDynamoDB = async (tableName, jsonData) => {
  const params = {
    TableName: tableName,
    Item: jsonData,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('Data inserted into DynamoDB successfully');
  } catch (error) {
    console.error('Error inserting data into DynamoDB:', error);
    throw error;
  }
};

// Usage
const filePath = 'Pharmacy_Data/pharmacy.json';
const tableName = 'CHC_PatientData';

(async () => {
  try {
    const jsonData = await readFile(filePath);
    await insertDataIntoDynamoDB(tableName, jsonData);
  } catch (error) {
    console.error('Error:', error);
  }
})();
