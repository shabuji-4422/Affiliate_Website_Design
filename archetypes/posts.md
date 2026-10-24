---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
slug: "{{ .File.ContentBaseName }}"
description: "One sentence (under 160 characters) that appears in Google results."
date: {{ .Date }}
lastmod: {{ .Date }}
collections: []        # any of: "trending-this-week", "deals", "gift-guides"
departments: []        # any of: "home-kitchen", "tech-gadgets", "beauty-self-care", "fitness-outdoors", "pets"
draft: true
---

Intro paragraph: who this post is for and what they'll get.

{{</* picks */>}}
- **Best overall:** Product name
- **Best budget:** Product name
{{</* /picks */>}}

### How We Chose These

### Product Name

{{</* product name="Product Name" asin="B0XXXXXXXX" badge="Best Overall" pros="Pro one|Pro two" cons="Con one" */>}}
Your own description of the product.
{{</* /product */>}}

### Quick Comparison

- **Product:** best for ...

### Final Words
