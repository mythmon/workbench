# 2024-07-19 DuckDB and JSON interpolation

```js
Inputs.table(penguins)
```

```sql id=sql1 echo
INSTALL json;
```

```sql id=sql2 echo
-- ${sql1}
LOAD json;
```

```sql echo
-- ${sql2}
SELECT json(${JSON.stringify(penguins)})
```

```sql echo
SELECT * FROM duckdb_extensions()
```
