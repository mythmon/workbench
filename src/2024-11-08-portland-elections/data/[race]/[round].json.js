import {parseArgs} from "node:util";

// Data from https://rcvresults.multco.us/
const resultsUrls = {
  district1: {
    round1: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%201/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%201.json",
    round2: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%201/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%201.json",
    round3: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%201/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%201.json",
    round4: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%201/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%201.json",
    round5: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%201/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%201.json",
  },
  district2: {
    round1: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%202/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%202.json",
    round2: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%202/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%202.json",
    round3: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%202/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%202.json",
    round4: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%202/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%202.json",
    round5: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%202/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%202.json",
  },
  district3: {
    round1: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%203/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%203.json",
    round2: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%203/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%203.json",
    round3: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%203/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%203.json",
    round4: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%203/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%203.json",
    round5: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%203/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%203.json",
  },
  district4: {
    round1: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%204/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%204.json",
    round2: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%204/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%204.json",
    round3: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%204/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%204.json",
    round4:"https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%204/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%204.json",
    round5: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%204/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%204.json",
  },
  mayor: {
    round1: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Mayor/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Mayor.json",
    round2: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Mayor/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Mayor.json",
    round3: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Mayor/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Mayor.json",
    round4: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Mayor/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Mayor.json",
    round5: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Mayor/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Mayor.json",
  }
}

const {values} = parseArgs({
  options: {
    race: {type: "string"},
    round: {type: "string"},
  }
});

const resultsUrl = resultsUrls[values.race][values.round];
if (!resultsUrl) {
  throw new Error(`No data found for ${values.race} and ${values.round}`);
}

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
