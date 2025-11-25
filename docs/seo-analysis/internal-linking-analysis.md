# Internal Linking Analysis Report

## Foundation Blog Posts (11 posts)

**Analysis Date:** 2025-11-17
**Analyzed File:** `/home/user/findmytherapy/apps/web/lib/blogData.ts`

---

## Executive Summary

### Overall Metrics

- **Total Posts:** 11 (4 Pillar + 6 Cluster + 1 Foundation/existing)
- **Posts with relatedPosts:** 11/11 (100%)
- **Total Internal Links:** 21 outgoing links
- **Average Links per Post:** 1.91 (Target: 2-4)
- **Bidirectional Link Issues:** 9 cases of one-way linking
- **Orphaned Posts:** 1 (no incoming links)

### Health Score: 6/10 ⚠️

**Strengths:**
✓ All posts have outgoing links defined
✓ Good Pillar → Cluster linking for "Therapeutensuche" cluster
✓ No completely isolated posts

**Critical Issues:**
⚠️ 1 orphaned post (Angststörungen Pillar has no incoming links)
⚠️ 9 non-bidirectional links (linking should be mutual)
⚠️ Low linking density (1.91 vs. target 2-4)
⚠️ Some Pillar posts don't link to their expected Cluster posts

---

## Detailed Findings

### 1. Posts with Defined `relatedPosts`

All 11 Foundation posts have `relatedPosts` arrays defined ✓

**Pillar Posts (4):**

- ✓ `depression-verstehen-bewaeltigen` → 2 links
- ✓ `angststoerungen-formen-symptome-behandlung` → 2 links
- ✓ `burnout-erkennen-vorbeugen` → 2 links
- ✓ `richtigen-therapeuten-finden` → 2 links

**Cluster Posts (6):**

- ✓ `atemtechniken-bei-angst` → 2 links
- ✓ `psychologe-vs-psychotherapeut` → 1 link
- ✓ `kassenzuschuss-psychotherapie-oesterreich` → 2 links
- ✓ `serioese-online-therapie-erkennen` → 2 links
- ✓ `meditation-anfaenger-3-minuten` → 2 links
- ✓ `wartezeiten-psychotherapie-wien` → 2 links

**Foundation (Existing) (1):**

- ✓ `akuthilfe-panikattacken` → 2 links (to non-Foundation posts)

---

### 2. Bidirectional Linking Issues ⚠️

**9 cases where Post A links to Post B, but B doesn't link back:**

| From Post                                  | To Post                       | Issue        |
| ------------------------------------------ | ----------------------------- | ------------ |
| depression-verstehen-bewaeltigen           | akuthilfe-panikattacken       | One-way link |
| angststoerungen-formen-symptome-behandlung | akuthilfe-panikattacken       | One-way link |
| angststoerungen-formen-symptome-behandlung | atemtechniken-bei-angst       | One-way link |
| burnout-erkennen-vorbeugen                 | richtigen-therapeuten-finden  | One-way link |
| atemtechniken-bei-angst                    | akuthilfe-panikattacken       | One-way link |
| psychologe-vs-psychotherapeut              | richtigen-therapeuten-finden  | One-way link |
| serioese-online-therapie-erkennen          | psychologe-vs-psychotherapeut | One-way link |
| meditation-anfaenger-3-minuten             | burnout-erkennen-vorbeugen    | One-way link |
| wartezeiten-psychotherapie-wien            | richtigen-therapeuten-finden  | One-way link |

**SEO Impact:** Bidirectional linking strengthens topic clusters and improves PageRank flow.

---

### 3. Pillar → Cluster Linking

#### Cluster 1: Angststörungen

**Pillar:** `angststoerungen-formen-symptome-behandlung`

- ✓ Links to: `atemtechniken-bei-angst`
- ✓ Links to: `akuthilfe-panikattacken` (Foundation/existing)
- Status: **GOOD** ✓

#### Cluster 2: Depression

**Pillar:** `depression-verstehen-bewaeltigen`

- Links to: `akuthilfe-panikattacken`, `burnout-erkennen-vorbeugen`
- ⚠️ No Cluster posts exist in Foundation set for Depression
- Status: **Acceptable** (links to related Pillar)

#### Cluster 3: Therapeutensuche

**Pillar:** `richtigen-therapeuten-finden`

- ✓ Links to: `kassenzuschuss-psychotherapie-oesterreich`, `serioese-online-therapie-erkennen`
- ⚠️ Missing: `psychologe-vs-psychotherapeut`, `wartezeiten-psychotherapie-wien`
- Status: **NEEDS IMPROVEMENT** ⚠️

#### Cluster 4: Burnout

**Pillar:** `burnout-erkennen-vorbeugen`

- Links to: `depression-verstehen-bewaeltigen`, `richtigen-therapeuten-finden`
- ⚠️ No Cluster posts exist in Foundation set for Burnout
- Status: **Acceptable** (links to related Pillars)

---

### 4. Orphaned Posts (No Incoming Links)

**1 orphaned post:**

⚠️ **`angststoerungen-formen-symptome-behandlung`** (Pillar)

- **Tier:** Pillar
- **Category:** Ratgeber
- **Search Volume:** ~18,000/month
- **Problem:** This is a high-value Pillar post with NO incoming links from other Foundation posts
- **Impact:** Lower internal PageRank, reduced topic authority signal

---

### 5. Posts with Strong Link Profiles

**Most Linked-To Posts (Incoming Links):**

1. **`richtigen-therapeuten-finden`** - 5 incoming links ⭐⭐⭐
   - From: burnout-erkennen-vorbeugen, psychologe-vs-psychotherapeut, kassenzuschuss-psychotherapie-oesterreich, serioese-online-therapie-erkennen, wartezeiten-psychotherapie-wien

2. **`akuthilfe-panikattacken`** - 3 incoming links ⭐⭐
   - From: depression-verstehen-bewaeltigen, angststoerungen-formen-symptome-behandlung, atemtechniken-bei-angst

3. **`burnout-erkennen-vorbeugen`** - 2 incoming links ⭐
   - From: depression-verstehen-bewaeltigen, meditation-anfaenger-3-minuten

---

### 6. Linking Density Analysis

**Current:** 1.91 links per post
**Target:** 2-4 links per post
**Status:** Below target ⚠️

**Distribution:**

- 2 links: 9 posts (82%)
- 1 link: 1 post (9%)
- 0 links: 0 posts (0%)

**Recommendation:** Increase to 3-4 links per post for better SEO.

---

## Visual Linking Map

```
PILLAR POSTS:
=============

[Depression] depression-verstehen-bewaeltigen
  → akuthilfe-panikattacken (Foundation)
  → burnout-erkennen-vorbeugen (Pillar)
  ← burnout-erkennen-vorbeugen (Pillar)

[Angststörungen] angststoerungen-formen-symptome-behandlung ⚠️ ORPHAN
  → akuthilfe-panikattacken (Foundation)
  → atemtechniken-bei-angst (Cluster)
  ← (NONE)

[Burnout] burnout-erkennen-vorbeugen
  → depression-verstehen-bewaeltigen (Pillar)
  → richtigen-therapeuten-finden (Pillar)
  ← depression-verstehen-bewaeltigen (Pillar)
  ← meditation-anfaenger-3-minuten (Cluster)

[Therapeutensuche] richtigen-therapeuten-finden ⭐ HUB
  → kassenzuschuss-psychotherapie-oesterreich (Cluster)
  → serioese-online-therapie-erkennen (Cluster)
  ← burnout-erkennen-vorbeugen (Pillar)
  ← psychologe-vs-psychotherapeut (Cluster)
  ← kassenzuschuss-psychotherapie-oesterreich (Cluster)
  ← serioese-online-therapie-erkennen (Cluster)
  ← wartezeiten-psychotherapie-wien (Cluster)

---

CLUSTER POSTS:
==============

[Cluster] atemtechniken-bei-angst
  → akuthilfe-panikattacken (Foundation)
  → meditation-anfaenger-3-minuten (Cluster)
  ← angststoerungen-formen-symptome-behandlung (Pillar)
  ← meditation-anfaenger-3-minuten (Cluster)

[Cluster] psychologe-vs-psychotherapeut
  → richtigen-therapeuten-finden (Pillar)
  ← serioese-online-therapie-erkennen (Cluster)

[Cluster] kassenzuschuss-psychotherapie-oesterreich
  → richtigen-therapeuten-finden (Pillar)
  → wartezeiten-psychotherapie-wien (Cluster)
  ← richtigen-therapeuten-finden (Pillar)
  ← wartezeiten-psychotherapie-wien (Cluster)

[Cluster] serioese-online-therapie-erkennen
  → richtigen-therapeuten-finden (Pillar)
  → psychologe-vs-psychotherapeut (Cluster)
  ← richtigen-therapeuten-finden (Pillar)

[Cluster] meditation-anfaenger-3-minuten
  → atemtechniken-bei-angst (Cluster)
  → burnout-erkennen-vorbeugen (Pillar)
  ← atemtechniken-bei-angst (Cluster)

[Cluster] wartezeiten-psychotherapie-wien
  → richtigen-therapeuten-finden (Pillar)
  → kassenzuschuss-psychotherapie-oesterreich (Cluster)
  ← kassenzuschuss-psychotherapie-oesterreich (Cluster)

---

FOUNDATION (EXISTING):
======================

[Foundation] akuthilfe-panikattacken
  → kognitive-verhaltenstherapie-erklaert (NON-Foundation)
  → mental-health-strategien-alltag (NON-Foundation)
  ← depression-verstehen-bewaeltigen (Pillar)
  ← angststoerungen-formen-symptome-behandlung (Pillar)
  ← atemtechniken-bei-angst (Cluster)
```

---

## Priority Recommendations

### CRITICAL (Fix Immediately)

#### 1. Fix Orphaned Pillar Post

**Post:** `angststoerungen-formen-symptome-behandlung`
**Impact:** HIGH - 18k monthly searches, Pillar content
**Action:** Add this post to relatedPosts of at least 2-3 other Foundation posts

**Suggested additions:**

```typescript
// In depression-verstehen-bewaeltigen:
relatedPosts: ['akuthilfe-panikattacken', 'burnout-erkennen-vorbeugen', 'angststoerungen-formen-symptome-behandlung'],

// In burnout-erkennen-vorbeugen:
relatedPosts: ['depression-verstehen-bewaeltigen', 'richtigen-therapeuten-finden', 'angststoerungen-formen-symptome-behandlung'],

// In atemtechniken-bei-angst:
relatedPosts: ['akuthilfe-panikattacken', 'meditation-anfaenger-3-minuten', 'angststoerungen-formen-symptome-behandlung'],
```

#### 2. Make Bidirectional Links Mutual

**Impact:** HIGH - Improves SEO link equity distribution
**Action:** For each one-way link, add the reverse link

**Specific fixes needed:**

```typescript
// akuthilfe-panikattacken currently links to NON-Foundation posts
// Change to:
relatedPosts: ['angststoerungen-formen-symptome-behandlung', 'atemtechniken-bei-angst'],

// atemtechniken-bei-angst
relatedPosts: ['akuthilfe-panikattacken', 'meditation-anfaenger-3-minuten', 'angststoerungen-formen-symptome-behandlung'],

// richtigen-therapeuten-finden - add missing Cluster posts
relatedPosts: [
  'kassenzuschuss-psychotherapie-oesterreich',
  'serioese-online-therapie-erkennen',
  'psychologe-vs-psychotherapeut',
  'wartezeiten-psychotherapie-wien'
],

// psychologe-vs-psychotherapeut
relatedPosts: ['richtigen-therapeuten-finden', 'serioese-online-therapie-erkennen'],

// burnout-erkennen-vorbeugen
relatedPosts: ['depression-verstehen-bewaeltigen', 'richtigen-therapeuten-finden', 'meditation-anfaenger-3-minuten'],
```

### HIGH PRIORITY

#### 3. Complete Pillar → Cluster Linking

**Post:** `richtigen-therapeuten-finden`
**Action:** Add missing cluster posts

```typescript
relatedPosts: [
  'kassenzuschuss-psychotherapie-oesterreich',
  'serioese-online-therapie-erkennen',
  'psychologe-vs-psychotherapeut', // ADD THIS
  'wartezeiten-psychotherapie-wien' // ADD THIS
],
```

#### 4. Increase Linking Density

**Current:** 1.91 links/post
**Target:** 3-4 links/post
**Action:** Add 1-2 more relevant links to each post

**Benefits:**

- Better topic clustering signal to Google
- Increased time on site (users explore more content)
- Stronger internal PageRank flow

### MEDIUM PRIORITY

#### 5. Link Foundation Post to Foundation Posts

**Post:** `akuthilfe-panikattacken`
**Current Issue:** Links to non-Foundation posts (kognitive-verhaltenstherapie-erklaert, mental-health-strategien-alltag)
**Action:** Change to link within Foundation cluster

```typescript
// Change from:
relatedPosts: ['kognitive-verhaltenstherapie-erklaert', 'mental-health-strategien-alltag'],

// To:
relatedPosts: ['angststoerungen-formen-symptome-behandlung', 'atemtechniken-bei-angst'],
```

#### 6. Cross-Cluster Linking

**Action:** Create strategic links between different topic clusters

Examples:

- `depression-verstehen-bewaeltigen` could link to `richtigen-therapeuten-finden`
- `burnout-erkennen-vorbeugen` could link to `meditation-anfaenger-3-minuten`

---

## Implementation Checklist

### Phase 1: Critical Fixes (Do First)

- [ ] Fix orphaned post: Add `angststoerungen-formen-symptome-behandlung` to 3+ relatedPosts arrays
- [ ] Fix `akuthilfe-panikattacken` to link within Foundation posts
- [ ] Add missing links to `richtigen-therapeuten-finden`
- [ ] Make all links bidirectional (see specific fixes above)

### Phase 2: Optimization (Do Next)

- [ ] Increase each post to 3-4 links minimum
- [ ] Add cross-cluster strategic links
- [ ] Ensure each Pillar links to all its Cluster posts
- [ ] Ensure each Cluster links back to its Pillar

### Phase 3: Maintenance (Ongoing)

- [ ] Review linking structure quarterly
- [ ] Add new posts with proper linking
- [ ] Monitor Google Search Console for internal link metrics
- [ ] Track time-on-site improvements

---

## Expected Impact

### After Implementing Recommendations:

**Linking Density:**

- Current: 1.91 links/post
- After fixes: ~3.5 links/post
- Improvement: +83%

**Orphaned Posts:**

- Current: 1
- After fixes: 0
- Improvement: 100%

**Bidirectional Links:**

- Current: ~50% bidirectional
- After fixes: ~95% bidirectional
- Improvement: +90%

**SEO Benefits:**

- Stronger topic authority signals
- Better PageRank distribution
- Increased crawl depth
- Higher user engagement (more page views per session)
- Lower bounce rates

---

## Monitoring Metrics

Track these in Google Search Console after implementation:

1. **Internal Link Count:** Should increase from 21 to ~40-45
2. **Average Time on Page:** Should increase by 15-30%
3. **Pages per Session:** Should increase by 20-40%
4. **Bounce Rate:** Should decrease by 10-20%
5. **Organic Rankings:** Watch for improvements in 2-3 months

---

**Report Generated:** 2025-11-17
**Next Review:** 2026-02-17 (3 months)
