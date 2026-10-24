# TrendFinds — Amazon affiliate site

A fast, free-to-host affiliate site built with [Hugo](https://gohugo.io/). The code lives on GitHub; the live site is served free by **Cloudflare Pages** (GitHub Pages does not allow commercial sites).

## 1. Things to change first

Open `hugo.toml` and edit:

| Setting | What to put |
| --- | --- |
| `baseURL` | Your domain, e.g. `https://trendfinds.com/` (or your `*.pages.dev` address until you buy one) |
| `title` | Your site name |
| `amazonTag` | Your Amazon Associates tracking ID (e.g. `abir0c-20`) — every product button uses it |
| `contactEmail` | Your email (also update `content/contact.md`) |

Also replace "TrendFinds" in `content/about.md`, `content/affiliate-disclosure.md` and `content/privacy-policy.md` if you rename the site.

## 2. Deploy free on Cloudflare Pages

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages → Create → Pages → Connect to Git** and choose this repository.
3. Build settings:
   - **Framework preset:** Hugo
   - **Build command:** `hugo --minify`
   - **Build output directory:** `public`
   - **Environment variable:** `HUGO_VERSION` = `0.168.0`
4. Click **Save and Deploy**. Your site goes live at `your-project.pages.dev`.
5. (Optional) Buy a domain at Cloudflare Registrar and add it under **Custom domains**. Then update `baseURL`.

From then on, every change you push to GitHub rebuilds the site automatically in about a minute.

## 3. Add a new post

**Easiest (in the browser):** on GitHub, open `content/posts/`, click **Add file → Create new file**, name it `your-post-slug.md`, paste the template from `archetypes/posts.md`, fill it in, and commit. Remove `draft: true` when it's ready to go live.

**On your computer (with Hugo installed):** `hugo new content posts/best-cozy-gifts.md`, then `hugo server` to preview at http://localhost:1313.

### Front matter

```yaml
collections: ["gift-guides"]                 # trending-this-week, deals, gift-guides
departments: ["home-kitchen", "pets"]        # home-kitchen, tech-gadgets, beauty-self-care, fitness-outdoors, pets
```

### Product card

```
{{< product name="Product Name" asin="B0XXXXXXXX" badge="Best Overall" pros="Pro one|Pro two" cons="Con one" >}}
Your own description of the product.
{{< /product >}}
```

- `asin` is the 10-character code in the Amazon URL: `amazon.com/dp/`**`B08HV3MPFD`**
- No ASIN yet? Use `search="cozy throw blanket"` to link to an Amazon search instead.
- `image` is optional — only use your own photos or screenshots (put them in `static/images/`). Never copy Amazon's product images.

Other helpers: `{{< picks >}} … {{< /picks >}}` for the "Quick picks" box, and `{{< amazon asin="B0…" >}}text{{< /amazon >}}` for an inline text link.

## Amazon rules to remember

- The disclosure is added automatically to every post and the footer — don't remove it.
- Don't write exact prices; say "under $25" and let readers check Amazon.
- Don't put affiliate links in emails or PDFs; link to your post instead.
- Don't run paid ads straight to Amazon links.
