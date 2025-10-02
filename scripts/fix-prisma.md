# 🔧 Fix Prisma Generate EPERM Error

## Problem

```
EPERM: operation not permitted, rename '...\query_engine-windows.dll.node.tmp...'
```

## Solutions

### ✅ Solution 1: Close All Processes (Quickest)

1. **Close ALL terminals** yang menjalankan `bun run dev`
2. **Close Kiro IDE** atau restart
3. **Open new terminal**
4. Run:

```bash
bun run db:generate
```

### ✅ Solution 2: Clean Prisma Cache

```bash
# 1. Remove Prisma client
Remove-Item -Recurse -Force node_modules\.prisma

# 2. Remove Prisma cache
Remove-Item -Recurse -Force node_modules\@prisma

# 3. Reinstall Prisma
bun add prisma @prisma/client

# 4. Generate again
bun run db:generate
```

### ✅ Solution 3: Manual Cleanup

```bash
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Clean install
Remove-Item -Recurse -Force node_modules
bun install

# 3. Generate
bun run db:generate
```

### ✅ Solution 4: Use npx Instead

```bash
# Sometimes npx works when bun doesn't
npx prisma generate
```

## After Fix

Once generated successfully, you can start dev server:

```bash
bun run dev
```

## Prevention

Always **stop dev server** before running `prisma generate`:

1. Press `Ctrl+C` in terminal running dev server
2. Wait for process to fully stop
3. Then run `bun run db:generate`
