# news-image-20261124

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/huangjun430-ctrl/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/huangjun430-ctrl/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124)

Entry for the make.fun bounty [**Sum up 24 November's world news in one image**](https://make.fun/bounty/news-image-20261124) (`news-image-20261124`).

## Overview

A single 1024×1024 editorial front-page image (`entry.png`, ≤ 1 MiB) summarizing **12 verified world news stories from Tuesday, 24 November 2026**—combining 4 illustrated lead panels with an 8-story UTC wire rail and an explicit date-check footer.

## Deterministic Execution

```bash
node main.ts
```

`main.ts` validates `entry.png` (PNG header, ≤ 1 MiB, ≤ 1024×1024) and copies it deterministically to `/output/entry.png`.
