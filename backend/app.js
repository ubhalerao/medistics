const db = require('./db');

// Example query to select all rows from a table named 'your_table'
db.any('SELECT * FROM users')
  .then((data) => {
    console.log('Query Result:', data);
  })
  .catch((error) => {
    console.error('Error executing query:', error);
  })
  .finally(() => {
    // Close the database connection
    db.$pool.end();
  });
