# Instructions for Claude Code

**⚠️ CRITICAL: Read this BEFORE making any code changes ⚠️**

## 🔴 DATABASE SCHEMA CHANGES

**IF YOU ARE MODIFYING `apps/web/prisma/schema.prisma`:**

### MANDATORY STEPS (NO EXCEPTIONS):

1. **After changing the schema file**, you MUST update the production database:
   ```bash
   cd apps/web
   pnpm db:verify-production
   ```

2. **Verify the production database** is updated:
   ```bash
   curl https://findmytherapy-qyva.vercel.app/api/health
   ```

3. **Only then** commit the changes:
   ```bash
   git add apps/web/prisma/schema.prisma
   git commit -m "Update schema [production DB verified]"
   ```

### WHY IS THIS CRITICAL?

- Vercel uses a **DIFFERENT database** than local development
- Production DB: `postgres://[hash]@db.prisma.io:5432/postgres`
- Local DB: `postgresql://postgres:password@localhost:5432/mental_health_dev`
- If you only update the schema file, **PRODUCTION WILL BREAK**

### NEVER DO THIS:

```bash
# ❌ WRONG - This will break production!
# Edit apps/web/prisma/schema.prisma
git add apps/web/prisma/schema.prisma
git commit -m "Add new model"
git push
# ☠️ Production API will fail with "table does not exist"
```

### ALWAYS DO THIS:

```bash
# ✅ CORRECT
# 1. Edit schema file
# 2. Update production DB
cd apps/web
pnpm db:verify-production
# 3. Verify
curl https://findmytherapy-qyva.vercel.app/api/health
# 4. Commit
git add apps/web/prisma/schema.prisma
git commit -m "Add new model [production DB updated]"
git push
```

## 📋 FULL CHECKLIST

Before completing ANY task involving Prisma schema changes:

- [ ] Schema file modified
- [ ] Local database updated (`DATABASE_URL=local pnpm exec prisma db push`)
- [ ] Production database updated (`pnpm db:verify-production`)
- [ ] Health endpoint checked (`curl .../api/health`)
- [ ] All tests pass
- [ ] Commit includes note about production DB update

## 🚨 IN YOUR RESPONSES

When you modify the Prisma schema, you MUST:

1. **Explicitly state** that you are updating the production database
2. **Show the command output** from `pnpm db:verify-production`
3. **Verify** the health endpoint after the change
4. **Warn the user** if you couldn't verify production DB

Example response:
```
I've added the new XYZ model to the Prisma schema.

⚠️ CRITICAL: I'm now updating the production database...
[shows pnpm db:verify-production output]

✅ Production database updated successfully.
✅ Health check passed: /api/health returns healthy

You can now safely commit these changes.
```

## 📖 DOCUMENTATION

- **Critical Checklist**: `/CRITICAL_CHECKLIST.md` (READ THIS FIRST!)
- **Database Setup Guide**: `/apps/web/docs/DATABASE_SETUP.md`
- **Verification Script**: `/apps/web/scripts/verify-production-db.sh`

## 🤖 SUMMARY FOR AI ASSISTANTS

**YOU MUST:**
- Read `CRITICAL_CHECKLIST.md` before any Prisma schema changes
- Run `pnpm db:verify-production` after schema changes
- Verify `/api/health` endpoint after updates
- Explicitly confirm production DB was updated in your response

**YOU MUST NOT:**
- Commit schema changes without updating production DB
- Assume local and production databases are in sync
- Skip the verification steps
- Merge PRs without confirming production DB is updated

---

**Last Updated**: November 20, 2025
**Reason**: Prevent production failures from schema mismatches
