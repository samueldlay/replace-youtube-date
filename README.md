# replace-youtube-date

A user script that replaces YouTube's default element containing the last posted
text with the actual posted date (which also displays when "show more" is
clicked)

# How to use with Tampermonkey

- Install Tampermonkey from
  [here](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- Install the dependencies with `npm install`
- Run the script `npm compile`
- Copy the compiled code into an empty userscript file in Tampermonkey

# How to use without Tampermonkey

- Run the compile script: `npm compile`
- Copy the code from `youtubeUserscript.js`
- Paste the code into your console at any YouTube video URL
