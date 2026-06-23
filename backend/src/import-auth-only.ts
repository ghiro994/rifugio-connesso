import 'dotenv/config';
import { pool } from './db.js';
import { importAuthUsers } from './import-csv.js';

importAuthUsers()
  .then(() => {
    console.log('Import auth completato.');
    return pool.end();
  })
  .catch((e) => {
    console.error(e);
    pool.end();
    process.exit(1);
  });
