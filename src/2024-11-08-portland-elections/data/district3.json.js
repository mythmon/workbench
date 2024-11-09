const resultsUrl = "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%203/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%203.json"

const res = await fetch(resultsUrl);
if (!res.ok) throw new Error(`Error: ${await res.text()}`);
const data = await res.json();

data.config.threshold = +data.config.threshold;
data.results = data.results.map(result => (
  {
    ...result,
    tally: Object.fromEntries(Object.entries(result.tally).map(([k, v]) => [k, +v])),
    tallyResults: result.tallyResults.map(tallyResult => ({
      ...tallyResult,
      transfers: Object.fromEntries(Object.entries(tallyResult.transfers).map(([k, v]) => [k, +v])),
    }))
  }
))

process.stdout.write(JSON.stringify(data));
