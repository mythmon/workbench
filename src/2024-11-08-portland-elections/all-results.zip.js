import JSZip from "jszip";
import {timeParse} from "d3-time-format";

// Data from https://rcvresults.multco.us/
const resultsUrls = [
  {office: "district 1", resultsNum: 1, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%201/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%201.json"},
  {office: "district 1", resultsNum: 2, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%201/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%201.json"},
  {office: "district 1", resultsNum: 3, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%201/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%201.json"},
  {office: "district 1", resultsNum: 4, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%201/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%201.json"},
  {office: "district 1", resultsNum: 5, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%201/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%201.json"},

  {office: "district 2", resultsNum: 1, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%202/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%202.json"},
  {office: "district 2", resultsNum: 2, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%202/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%202.json"},
  {office: "district 2", resultsNum: 3, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%202/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%202.json"},
  {office: "district 2", resultsNum: 4, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%202/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%202.json"},
  {office: "district 2", resultsNum: 5, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%202/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%202.json"},

  {office: "district 3", resultsNum: 1, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%203/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%203.json"},
  {office: "district 3", resultsNum: 2, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%203/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%203.json"},
  {office: "district 3", resultsNum: 3, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%203/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%203.json"},
  {office: "district 3", resultsNum: 4, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%203/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%203.json"},
  {office: "district 3", resultsNum: 5, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%203/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%203.json"},

  {office: "district 4", resultsNum: 1, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Councilor%20District%204/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Councilor,%20District%204.json"},
  {office: "district 4", resultsNum: 2, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Councilor%20District%204/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Councilor,%20District%204.json"},
  {office: "district 4", resultsNum: 3, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Councilor%20District%204/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Councilor,%20District%204.json"},
  {office: "district 4", resultsNum: 4, url: "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Councilor%20District%204/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Councilor,%20District%204.json"},
  {office: "district 4", resultsNum: 5, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Councilor%20District%204/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Councilor,%20District%204.json"},

  {office: "mayor", resultsNum: 1, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland%20Mayor/a3df36c7-9b95-4614-a357-759ae2ca223f_City%20of%20Portland,%20Mayor.json"},
  {office: "mayor", resultsNum: 2, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland%20Mayor/8ae97233-9022-48ba-9ff1-07cc5fb12141_City%20of%20Portland,%20Mayor.json"},
  {office: "mayor", resultsNum: 3, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland%20Mayor/09dd9240-5e25-4fc7-8159-26717db95079_City%20of%20Portland,%20Mayor.json"},
  {office: "mayor", resultsNum: 4, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland%20Mayor/0e40aff6-a890-4a8a-9bbc-ea6924944cb0_City%20of%20Portland,%20Mayor.json"},
  {office: "mayor", resultsNum: 5, url:  "https://mcdcselectionsrcvprdst.z5.web.core.windows.net/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland%20Mayor/65380232-cc8b-4692-b331-d8792a07891f_City%20of%20Portland,%20Mayor.json"},
];

const timestampParse = timeParse("%Y_%m_%d_%H_%M_%S");
function cleanData(data) {
  const dateStr = data.config.contest
    .replace(/district_\d/i, "")
    .replace(/^[^\d]+/i, "");
  const timestamp = timestampParse(dateStr);

  return {
    ...data,
    config: {
      ...data.config,
      threshold: +data.config.threshold,
      timestamp,
    },
    results: data.results.map(result => ({
      ...result,
      tally: Object.fromEntries(Object.entries(result.tally).map(([k, v]) => [k, +v])),
      tallyResults: result.tallyResults.map(tallyResult => ({
        ...tallyResult,
        transfers: Object.fromEntries(Object.entries(tallyResult.transfers).map(([k, v]) => [k, +v])),
      })),
    })),
  };
}

const zip = new JSZip();
const voteSummaries = [];

for (const {office, resultsNum, url} of resultsUrls) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error with request to ${url}: ${await res.body()}`);
  const rawData = await res.json();
  const data = cleanData(rawData);
  zip.file(`${office.replace(' ', '_')}/results_${resultsNum}.json`, JSON.stringify(data));

  voteSummaries.push({
    office,
    resultsNum,
    timestamp: data.config.timestamp,
    totalVotes: Object.values(data.results[0].tally).reduce((acc, d) => acc + d, 0),
  })
}

zip.file("summary.json", JSON.stringify(voteSummaries));

const buf = await zip.generateAsync({type: "nodebuffer"});
process.stdout.write(buf);
