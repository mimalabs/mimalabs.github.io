# Amazon book links — verification pending

Status on **20 November 2026**: all **23** supplied Amazon shortlinks are retained in `content/products.json`, and every generated buy button is wired to its configured locale. This update added ten URLs: five newly listed Italian/Catalan editions of Farm, Halloween and Christmas, plus five editions of the new Vehicles book. Automated checks confirm Amazon-owned hostnames and that missing listings say **Coming soon**. Amazon lookups are restricted in this environment. **None of the 23 destinations has been independently confirmed to show the correct book.** Do not mark this Product Owner gate as passed until each link is opened in a normal browser.

| Product | Edition | Configured link | Destination verified? |
| --- | --- | --- | --- |
| Farm | EN | https://a.co/d/0iP4hcyy | No — manual review |
| Farm | DE | https://amzn.eu/d/00xUxhrS | No — manual review |
| Farm | ES | https://amzn.eu/d/05qXy8OT | No — manual review |
| Farm | FR | https://amzn.eu/d/08l6Mo86 | No — manual review |
| Farm | IT | https://a.co/d/00AVfMEF | No — manual review |
| Farm | CA | https://a.co/d/0cWgMcDY | No — manual review |
| Halloween | EN | https://a.co/d/0gFSO2ly | No — manual review |
| Halloween | DE | https://amzn.eu/d/0d2elJIz | No — manual review |
| Halloween | ES | https://amzn.eu/d/0fwmAeCM | No — manual review |
| Halloween | FR | https://amzn.eu/d/01JWLne6 | No — manual review |
| Halloween | CA | https://amzn.eu/d/05Iedfz4 | No — manual review |
| Halloween | IT | https://a.co/d/04mrW71z | No — manual review |
| Christmas | EN | https://a.co/d/07YIv6b3 | No — manual review |
| Christmas | DE | https://amzn.eu/d/0712zJ9S | No — manual review |
| Christmas | ES | https://amzn.eu/d/0edtUioA | No — manual review |
| Christmas | FR | https://amzn.eu/d/03cW13Kj | No — manual review |
| Christmas | IT | https://a.co/d/0aCEyz7T | No — manual review |
| Christmas | CA | https://a.co/d/05GK83Yo | No — manual review |
| Vehicles | EN | https://a.co/d/0hzRYmJq | No — manual review |
| Vehicles | DE | https://a.co/d/0cbz14Ii | No — manual review |
| Vehicles | FR | https://a.co/d/0fA4MIjz | No — manual review |
| Vehicles | IT | https://a.co/d/0fVS9LQz | No — manual review |
| Vehicles | CA | https://a.co/d/05cmbthB | No — manual review |

**Coming soon** (no purchase URL): **Vehicles ES**. Its Spanish cover is ready, but no Spanish Amazon listing URL was supplied.

For each live listing, compare the **Amazon cover/title/language** with `content/products.json` and the corresponding `site/assets/covers/<id>/<locale>.webp`. If any mismatch exists, correct the link or remove it (Coming soon) before publishing. Prefer stable `amazon.<marketplace>/dp/<ASIN>` links for future additions if available.
