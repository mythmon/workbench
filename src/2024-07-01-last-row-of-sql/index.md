# Last row of SQL

```sql id=test
  select
    'hello' as key,
    'world' as value
  union all
  select
    'howdy' as key,
    'partner' as value
```

```js
display(test)
```

```js
display(Inputs.table(test))
```

<div class="grid grid-cols-1">
  <div class="card">${test.at(-1).value}</div>
</div>

```js
const converted = test.toArray();
```

```js
display(converted)
```

```js
display(Inputs.table(converted))
```

<div class="grid grid-cols-1">
  <div class="card">${converted.at(-1).value}</div>
</div>
