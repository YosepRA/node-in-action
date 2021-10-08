"use strict";

const htmlparser = require('htmlparser');

const request = require('request');

const fs = require('fs');

const configFilename = './data/rss-feeds.txt';

function checkRSSFile() {
  fs.exists(configFilename, exists => {
    if (!exists) return next(new Error('Missing RSS file:', configFilename));
    next(null, configFilename);
  });
}

function readRSSFile(filename) {
  fs.readFile(filename, (err, feedList) => {
    if (err) return next(err);
    const parsedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
    const randomFeed = Math.floor(Math.random() * parsedList.length);
    next(null, parsedList[randomFeed]);
  });
}

function downloadRSSFeed(feedUrl) {
  request(feedUrl, (err, res, body) => {
    if (err) return next(err);

    if (res.statusCode !== 200) {
      return next(new Error('Abnormal status code.'));
    }

    next(null, body);
  });
}

function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);

  if (handler.dom.items.length < 1) {
    return next(new Error('No RSS data found.'));
  }

  const firstItem = handler.dom.items.shift();
  console.log(firstItem.title);
  console.log(firstItem.link);
  console.log(firstItem.description);
}

const tasks = [checkRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

function next(err, result) {
  if (err) throw err;
  const currentTask = tasks.shift();
  if (currentTask) currentTask(result);
}

next();