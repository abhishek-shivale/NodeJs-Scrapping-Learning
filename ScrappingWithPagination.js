/// chapter 5

import axios from "axios";
import cheerio from "cheerio";

const sleep = (s) => new Promise((r) => setTimeout(r, s));

async function ScrapJobFromIndexPage() {
  const allJob = [];
  for (let i = 1; i <= 14; i++) {
    const jobIndexPage = await axios.get(
      `https://braigslist.vercel.app/jobs/${i}/`
    );
    console.log("Requested url:" + i);
    await sleep(1000);
    const $ = cheerio.load(jobIndexPage.data);
    const job = $(".title-blob > a")
      .map((i, el) => {
        const title = $(el).text();
        const url = $(el).attr("href");
        return { title, url };
      })
      .get();
    allJob.push(...job);
  }
  console.log(allJob.length);
  return allJob;
}

async function ScrapJobDescription(allJobs) {
  let allJobDescription = [];
  for (const job of allJobs) {
    const jobDescription = await axios.get(
      "https://braigslist.vercel.app/" + job.url
    );
    console.log("Requested Url :" + job.url);
    const $ = cheerio.load(jobDescription.data);
    const description = $("div").text();
    job.description = description;
    allJobDescription.push(job);
  }
}

async function main() {
  const allJobs = await ScrapJobFromIndexPage();
  ScrapJobDescription(allJobs);
}
main();