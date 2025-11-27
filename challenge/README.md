# Challenge Page Deployment

This directory contains a "Tough Challenge" designed to test the Agentic Solver.

## Contents
- `index.html`: The challenge page. It mimics a "Maintenance Mode" page but contains hidden data and instructions in the HTML source.

## How to Deploy (Vercel)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Navigate to this folder: `cd challenge`
3.  Deploy: `vercel --prod`
    - Follow the prompts (link to existing project? No. Project name? `tds-challenge`. Settings? Default).

## Configuration
Before deploying, you **MUST** update the Webhook URL in `index.html`.
1.  Open `index.html`.
2.  Find `[REPLACE_WITH_YOUR_WEBHOOK_URL]`.
3.  Replace it with a URL where you can see the POST request (e.g., a RequestBin, or your own API endpoint).

## The Solution
The page contains a Base64 encoded JSON list of products.
The task is to calculate the **Total Revenue** (Price * Stock) for the **'Electronics'** category.
The answer is printed to the console when you run `python ../generate_challenge.py`.
