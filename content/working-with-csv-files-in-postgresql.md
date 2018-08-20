---
title: Working with CSV files in PostgreSQL
date: 2014-10-10
layout: Post
tags:
  - postgresql
  - csv
---

I recently had to manipulate some data in CSV format. The best way to do that IMO was to throw these CSV files in a database and then do whatever I wanted with it.

A quick Google search pointed me to the COPY command of PostgreSQL. Here’s how you import CSV data into PostgreSQL.

## Importing CSV files in PostgreSQL

First, create a table with columns matching columns in your CSV file.

```sql
CREATE TABLE my_table (my_column_1 INTEGER, my_column_2 VARCHAR(50), my_column_3 BOOLEAN);
```

Then, import your CSV file. Replace the comma below with your CSV delimiter if different.

```sql
COPY my_table FROM '/path/to/your/file.csv' DELIMITER ',' CSV HEADER;
```

Note that the `HEADER` parameter at the end is needed to tell Postgres that the first line is only the column names. If you don’t have column names in your CSV, remove this parameter.

If you have a different order or number of columns in your table than in your CSV, you might want to specify the column names in the import command, like so:

```sql
COPY my_table(my_column_1, my_column_3) FROM '/path/to/your/file.csv' DELIMITER ',' CSV HEADER;
```

## Exporting to CSV files from PostgreSQL

It is also possible to export the result of a query in CSV format.

```sql
COPY (SELECT * FROM my_table) TO '/path/to/your/exported_file.csv' WITH CSV HEADER;
```

Again here the HEADER parameter determines if the first row is the column names or not.

For more information about the COPY command in SQL, you can have a look at the [official doc](https://www.postgresql.org/docs/9.6/static/sql-copy.html).