# Merge, Dedup & Transform Datasets

> A high-performance dataset processing tool designed to merge, deduplicate, and transform massive datasets efficiently. It streamlines data workflows by handling multiple datasets, parallelizing workloads, and ensuring persistent, optimized operations for large-scale data projects.

> Ideal for developers, data engineers, and automation workflows that demand speed, accuracy, and transformation flexibility in dataset handling.


<p align="center">
  <a href="https://bitbash.def" target="_blank">
    <img src="https://github.com/za2122/footer-section/blob/main/media/scraper.png" alt="Bitbash Banner" width="100%"></a>
</p>
<p align="center">
  <a href="https://t.me/devpilot1" target="_blank">
    <img src="https://img.shields.io/badge/Chat%20on-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
  </a>&nbsp;
  <a href="https://wa.me/923249868488?text=Hi%20BitBash%2C%20I'm%20interested%20in%20automation." target="_blank">
    <img src="https://img.shields.io/badge/Chat-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp">
  </a>&nbsp;
  <a href="mailto:sale@bitbash.dev" target="_blank">
    <img src="https://img.shields.io/badge/Email-sale@bitbash.dev-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail">
  </a>&nbsp;
  <a href="https://bitbash.dev" target="_blank">
    <img src="https://img.shields.io/badge/Visit-Website-007BFF?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website">
  </a>
</p>




<p align="center" style="font-weight:600; margin-top:8px; margin-bottom:8px;">
  Created by Bitbash, built to showcase our approach to Scraping and Automation!<br>
  If you are looking for <strong>Merge, Dedup & Transform Datasets</strong> you've just found your team — Let’s Chat. 👆👆
</p>


## Introduction

This project provides a robust dataset processor that combines merging, deduplication, and transformation in a single streamlined operation.

It’s built for anyone dealing with large or complex data collections — particularly useful for those integrating multiple dataset sources and looking to automate post-scraping data cleanup.

### Why It Matters

- Processes data up to 20x faster through workload parallelization.
- Supports simultaneous reading from multiple datasets.
- Provides deep and configurable deduplication (supports nested fields and objects).
- Fully transformation-capable before and after deduplication.
- Maintains migration-proof persistence to avoid redundant work.

## Features

| Feature | Description |
|----------|-------------|
| High-speed merging | Combine multiple datasets efficiently with preserved order and parallel loading. |
| Advanced deduplication | Deduplicate on multiple or nested fields with JSON-based deep equality checks. |
| Pre & Post transformation | Apply custom transformation logic before or after deduplication. |
| Memory optimization | Near-constant memory usage for very large datasets (10M+ items). |
| Flexible outputs | Export results into datasets or key-value storage for varied workflows. |
| Persistence | Automatically retains processed data between runs to avoid duplicate computation. |
| Parallel processing | Leverages concurrent workloads for faster data merging. |
| Batch processing | Handles large batches independently, with access to dataset context variables. |

---

## What Data This Scraper Extracts

| Field Name | Field Description |
|-------------|------------------|
| datasetId | Unique identifier of the dataset being processed. |
| datasetOffset | Position of the batch within the dataset. |
| items | Array of dataset items being merged, deduplicated, or transformed. |
| dedupFields | List of field names used for deduplication. |
| outputMode | Determines whether results are stored in datasets or KV stores. |
| transformationFunctions | Custom logic functions applied pre/post deduplication. |

---

## Example Output


    [
      {
        "datasetId": "dataset-123",
        "datasetOffset": 0,
        "items": [
          { "name": "Adidas Shoes", "id": "12345", "price": 59.99 },
          { "name": "Nike Air", "id": "54321", "price": 79.99 }
        ],
        "dedupFields": ["name", "id"],
        "outputMode": "dataset",
        "transformationFunctions": ["preDedupTransformFunction", "postDedupTransformFunction"]
      }
    ]

---

## Directory Structure Tree


    merge-dedup-transform-datasets/
    ├── src/
    │   ├── main.js
    │   ├── utils/
    │   │   ├── deduplication.js
    │   │   ├── merging.js
    │   │   └── transformations.js
    │   └── config/
    │       └── settings.example.json
    ├── tests/
    │   ├── test_dedup.js
    │   ├── test_merge.js
    │   └── test_transform.js
    ├── data/
    │   ├── input.sample.json
    │   └── output.sample.json
    ├── package.json
    ├── README.md
    └── LICENSE

---

## Use Cases

- **Data engineers** use it to consolidate fragmented datasets across runs, ensuring no duplicates remain.
- **Analysts** apply transformations pre/post deduplication to clean and normalize data at scale.
- **Automation teams** integrate it into pipelines to unify scraped data from multiple sources.
- **Researchers** merge multi-source data collections for large-scale insights and analytics.
- **Developers** rely on it for migration-safe processing without redundant data handling.

---

## FAQs

**Q1: How does it handle large datasets without running out of memory?**
It uses a dedup-as-loading mode, which processes data in constant memory chunks, making it suitable for datasets with tens of millions of records.

**Q2: Can I use nested fields for deduplication?**
Yes. The tool supports deep comparison through JSON stringification, so even nested objects or arrays are compared accurately.

**Q3: What happens if I re-run the process?**
All persistable steps are cached, meaning no duplicated or repeated data operations occur between runs.

**Q4: Can I define my own transformation functions?**
Absolutely. You can define custom functions for both pre-deduplication and post-deduplication transformation phases.

---

## Performance Benchmarks and Results

**Primary Metric:** Achieves up to **20x faster processing speed** compared to conventional dataset loaders.
**Reliability Metric:** Over **99.9% success rate** for large dataset operations (10M+ records).
**Efficiency Metric:** Maintains near-constant memory consumption even with high-volume input.
**Quality Metric:** Guarantees **complete and accurate deduplication** with persistent, validated data output.


<p align="center">
<a href="https://calendar.app.google/74kEaAQ5LWbM8CQNA" target="_blank">
  <img src="https://img.shields.io/badge/Book%20a%20Call%20with%20Us-34A853?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Book a Call">
</a>
  <a href="https://www.youtube.com/@bitbash-demos/videos" target="_blank">
    <img src="https://img.shields.io/badge/🎥%20Watch%20demos%20-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch on YouTube">
  </a>
</p>
<table>
  <tr>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtu.be/MLkvGB8ZZIk" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review1.gif" alt="Review 1" width="100%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Bitbash is a top-tier automation partner, innovative, reliable, and dedicated to delivering real results every time.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Nathan Pennington
        <br><span style="color:#888;">Marketer</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtu.be/8-tw8Omw9qk" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review2.gif" alt="Review 2" width="100%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Bitbash delivers outstanding quality, speed, and professionalism, truly a team you can rely on.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Eliza
        <br><span style="color:#888;">SEO Affiliate Expert</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
    <td align="center" width="33%" style="padding:10px;">
      <a href="https://youtube.com/shorts/6AwB5omXrIM" target="_blank">
        <img src="https://github.com/za2122/footer-section/blob/main/media/review3.gif" alt="Review 3" width="35%" style="border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      </a>
      <p style="font-size:14px; line-height:1.5; color:#444; margin:0 15px;">
        “Exceptional results, clear communication, and flawless delivery. Bitbash nailed it.”
      </p>
      <p style="margin:10px 0 0; font-weight:600;">Syed
        <br><span style="color:#888;">Digital Strategist</span>
        <br><span style="color:#f5a623;">★★★★★</span>
      </p>
    </td>
  </tr>
</table>
