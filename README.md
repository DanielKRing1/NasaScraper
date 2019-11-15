# NasaScraper
Scripts for scraping Nasa's LST+Elevation (AG1km v006) and Land Cover (MCD12Q1 v006) Data

These scripts were made to help me download data and write it to disk as JSON.

<b>Land Cover</b>
(Not the best method) But bcus I initially couldn't figure out a better way to efficiently hit the 315 download endpoints, I created a script to launch Puppeteer in to visit the links for me.

<b>LST and Elevation</b>
I created this script to download all 24,000+ files more quickly than the script provided by the download page at https://search.earthdata.nasa.gov/ (visit the link, and search for the AGkm1 v006 dataset)
To use this script, obtain a "cookiejarfile" and a ".netrc" file by running the script provided by NASA (above link ^).
Add these 2 files to the "nasa_lst_elevation" directory.
Running the index.js file will download all the files. ~10 GB

<b>Purpose</b>
This directory is meant to provide a template for quickly downloading semi-specific NASA data and write it to JSON files.
It currently does well with the AG1km data.
However, my ultimate goal is to compile multiple datasets into a single general, ~low accuracy PostgreSQL database.<br>
I ahve come up empty handed with a public GeoLocation API that offers high throughput for free.<br>
I intend these scripts to help me create one (but it probably won't be public).

NASA, you guys gotta simplify your websites...
1 or 2 download options are better than 5 that don't work...
