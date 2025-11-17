# Quick Reference: Exact Code Changes Needed

## Foundation Posts relatedPosts Updates

### CRITICAL FIXES (Do First)

#### 1. akuthilfe-panikattacken (Line ~1478)
```typescript
// CURRENT (links to NON-Foundation):
relatedPosts: ['kognitive-verhaltenstherapie-erklaert', 'mental-health-strategien-alltag'],

// CHANGE TO (links within Foundation):
relatedPosts: ['angststoerungen-formen-symptome-behandlung', 'atemtechniken-bei-angst'],
```

#### 2. depression-verstehen-bewaeltigen (Line ~1621)
```typescript
// CURRENT:
relatedPosts: ['akuthilfe-panikattacken', 'burnout-erkennen-vorbeugen'],

// CHANGE TO (add orphaned post):
relatedPosts: ['akuthilfe-panikattacken', 'burnout-erkennen-vorbeugen', 'angststoerungen-formen-symptome-behandlung'],
```

#### 3. burnout-erkennen-vorbeugen (Line ~1784)
```typescript
// CURRENT:
relatedPosts: ['depression-verstehen-bewaeltigen', 'richtigen-therapeuten-finden'],

// CHANGE TO (add orphaned post + bidirectional):
relatedPosts: ['depression-verstehen-bewaeltigen', 'richtigen-therapeuten-finden', 'meditation-anfaenger-3-minuten', 'angststoerungen-formen-symptome-behandlung'],
```

#### 4. richtigen-therapeuten-finden (Line ~1812)
```typescript
// CURRENT:
relatedPosts: ['kassenzuschuss-psychotherapie-oesterreich', 'serioese-online-therapie-erkennen'],

// CHANGE TO (add missing clusters + bidirectional):
relatedPosts: [
  'kassenzuschuss-psychotherapie-oesterreich', 
  'serioese-online-therapie-erkennen',
  'psychologe-vs-psychotherapeut',
  'wartezeiten-psychotherapie-wien'
],
```

#### 5. atemtechniken-bei-angst (Line ~1831)
```typescript
// CURRENT:
relatedPosts: ['akuthilfe-panikattacken', 'meditation-anfaenger-3-minuten'],

// CHANGE TO (add bidirectional to Pillar):
relatedPosts: ['akuthilfe-panikattacken', 'meditation-anfaenger-3-minuten', 'angststoerungen-formen-symptome-behandlung'],
```

#### 6. psychologe-vs-psychotherapeut (Line ~1849)
```typescript
// CURRENT:
relatedPosts: ['richtigen-therapeuten-finden'],

// CHANGE TO (add bidirectional):
relatedPosts: ['richtigen-therapeuten-finden', 'serioese-online-therapie-erkennen'],
```

---

## Summary of Changes

| Post Slug | Current Links | New Links | Change |
|-----------|--------------|-----------|--------|
| akuthilfe-panikattacken | 2 (non-Foundation) | 2 (Foundation) | Replace all |
| depression-verstehen-bewaeltigen | 2 | 3 | Add 1 |
| angststoerungen-formen-symptome-behandlung | 2 | 2 | No change (others will link to it) |
| burnout-erkennen-vorbeugen | 2 | 4 | Add 2 |
| richtigen-therapeuten-finden | 2 | 4 | Add 2 |
| atemtechniken-bei-angst | 2 | 3 | Add 1 |
| psychologe-vs-psychotherapeut | 1 | 2 | Add 1 |
| kassenzuschuss-psychotherapie-oesterreich | 2 | 2 | No change |
| serioese-online-therapie-erkennen | 2 | 2 | No change |
| meditation-anfaenger-3-minuten | 2 | 2 | No change |
| wartezeiten-psychotherapie-wien | 2 | 2 | No change |

**Total Links After Changes:** 
- Before: 21 links
- After: 28 links
- Increase: +33%

**Average Links per Post:**
- Before: 1.91
- After: 2.55
- Still below ideal (3-4), but significant improvement

---

## Line Numbers Reference (for editing)

Based on grep search results:

| Post | Approximate Line | relatedPosts Line |
|------|-----------------|-------------------|
| akuthilfe-panikattacken (original) | 65 | 97 |
| akuthilfe-panikattacken (Foundation) | 1447 | 1478 |
| depression-verstehen-bewaeltigen | 1589 | 1621 |
| angststoerungen-formen-symptome-behandlung | 1722 | 1745 |
| burnout-erkennen-vorbeugen | 1761 | 1784 |
| richtigen-therapeuten-finden | 1800 | 1812 |
| atemtechniken-bei-angst | 1819 | 1831 |
| psychologe-vs-psychotherapeut | 1837 | 1849 |
| kassenzuschuss-psychotherapie-oesterreich | 1853 | 1865 |
| serioese-online-therapie-erkennen | 1869 | 1881 |
| meditation-anfaenger-3-minuten | 1885 | 1897 |
| wartezeiten-psychotherapie-wien | 1901 | 1913 |

**Note:** Line numbers are approximate and may shift as you edit the file.

---

## Testing After Changes

1. **Verify no syntax errors:**
   ```bash
   npm run typecheck
   # or
   tsc --noEmit
   ```

2. **Check blog builds:**
   ```bash
   npm run build
   ```

3. **Verify related posts appear correctly:**
   - Check each blog post page
   - Ensure "Related Posts" section displays correctly
   - Verify all links work

4. **SEO validation:**
   - Check internal linking in Google Search Console (after deployment)
   - Monitor crawl stats for improved coverage
   - Track engagement metrics (time on site, pages per session)

---

## Future Optimization (Phase 2)

Once critical fixes are done, consider:

1. **Add more cross-cluster links:**
   - Link Depression → Therapeutensuche posts
   - Link Burnout → Selbsthilfe posts (meditation, breathing)
   - Link Angststörungen → Depression posts (comorbidity)

2. **Increase to 3-4 links per post:**
   - Each Pillar should have 4-5 links
   - Each Cluster should have 3-4 links
   - Mix of same-cluster and cross-cluster links

3. **Add strategic external links:**
   - While not in relatedPosts, ensure in-content links to:
     - Official health organizations (ÖGK, WHO)
     - Scientific studies (PubMed)
     - Austrian government health resources

---

**Last Updated:** 2025-11-17
**Priority:** HIGH - Implement before batch publication
