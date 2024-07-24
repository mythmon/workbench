# React Date Range demo

```js
import React, { useState } from "npm:react";
// import { Calendar, DateRange, DateRangePicker } from "npm:react-date-range";
// import { Calendar, DateRange, DateRangePicker } from "https://cdn.jsdelivr.net/npm/react-date-range@2.0.1/+esm"
import { Calendar, DateRange, DateRangePicker } from "https://cdn.jsdelivr.net/npm/react-date-range@2.0.1/src/index.js";
import { addDays } from "npm:date-fns";
```

<style>
  ${import 'react-date-range/dist/styles.css'}
  ${import 'react-date-range/dist/theme/default.css'}
</style>


```jsx
function Picker() {

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <div className="App">
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      />
      ;
    </div>
  );
}
```

```jsx
display(<Picker/>);
```
