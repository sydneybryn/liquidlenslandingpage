# GTM Conversion Tracking Import

`gtm-conversion-tracking-import.json` adds 6 triggers + 6 GA4 event tags to your existing
GTM container (`GTM-N8SQ8F23`) on top of what's already there. It does **not** touch or
duplicate your existing GA4 Configuration tag.

## Import steps

1. In GTM, open the `GTM-N8SQ8F23` container → **Admin → Import Container**.
2. Choose `gtm-conversion-tracking-import.json`.
3. Choose **Existing workspace** (or create a new one) → Import option: **Merge**,
   conflict resolution: **Rename conflicting tags/triggers** (there shouldn't be any,
   since these are all new names).
4. Confirm.

## One manual fix required after import

Each of the 6 new tags has a placeholder `measurementId` value:
`"REPLACE_WITH_YOUR_GA4_CONFIG_TAG_NAME"`. Hand-authored JSON can't safely reference
your existing GA4 Configuration tag by internal ID, so after import, open each of the
6 new tags and, in the **Configuration Tag** field, select your existing GA4
Configuration tag from the dropdown instead of leaving it blank/placeholder. Takes
about 2 minutes total.

## Before publishing

Use GTM's **Preview** mode (Tag Assistant) on the live site and click through:
- App Store button in the nav → confirms `App Store Click - Nav` trigger + tag fire
  with `link_location=nav`
- App Store button in the hero → confirms `App Store Click - Hero` + `link_location=hero`
- Scroll to 25/50/75/90% → confirms `Scroll Depth - Landing`
- Instagram link, mailto link, "See the effects" / nav anchor links

Cross-check in GA4 **DebugView** (real-time) that `app_store_click`, `scroll_depth`,
`outbound_click`, `contact_click`, and `cta_click` all appear with correct parameters.

**Note on the Scroll Depth trigger's page filter:** it's currently set to
`Page Path contains "index.html"`. If your production site serves the homepage at the
bare root (e.g. `https://yourdomain.com/` with no `/index.html` in the URL), change
this filter in GTM to `Page Path equals /` before publishing, or scroll events won't fire.

## After publishing

1. Trigger `app_store_click` once (click either App Store button on the live site).
2. In **GA4 Admin → Events**, find `app_store_click` and toggle **Mark as key event**.
   This is a GA4 property setting — it cannot be set via GTM import.
3. (Optional, later) Link GA4 to Google Ads and import `app_store_click` as a Google
   Ads conversion action once you're running paid acquisition.
