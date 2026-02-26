# Supabase Setup Guide for LifeOS

## ✅ What's Done

1. ✅ Supabase package installed (`@supabase/supabase-js`)
2. ✅ Supabase client created (`src/lib/supabase.ts`)
3. ✅ AuthContext updated to use Supabase Auth
4. ✅ DataContext updated to use Supabase Database
5. ✅ All pages updated to handle async operations
6. ✅ Database schema SQL file created (`database-schema.sql`)

## 📋 Setup Steps

### 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Create a new project
3. Wait for project to be ready (2-3 minutes)

### 2. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Create Environment File

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Replace `your_project_url_here` and `your_anon_key_here` with actual values from Supabase.

### 4. Create Database Tables

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `database-schema.sql` file from project root
3. Copy entire SQL content
4. Paste in SQL Editor
5. Click **Run**

This will create:
- `inbox` table
- `tasks` table
- Row Level Security (RLS) policies
- Indexes for performance

### 5. Create User Account

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. Save the credentials (you'll use this to login)

### 6. Test the Application

1. Run `npm run dev`
2. Go to `/login`
3. Use the email/password you created
4. You should be able to:
   - Add inbox items
   - Create tasks
   - Mark tasks complete
   - See data persist after refresh

## 🔒 Security Notes

- RLS (Row Level Security) is enabled
- Users can only access their own data
- All operations are authenticated
- No public access to data

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify variable names start with `VITE_`
- Restart dev server after adding `.env`

### "Failed to fetch data"
- Check Supabase project is active
- Verify RLS policies are created
- Check browser console for specific errors

### "Authentication failed"
- Verify user exists in Supabase Auth
- Check email/password are correct
- Ensure email confirmation is not required (or confirm email)

## 📝 Next Steps (Optional)

- Add email confirmation flow
- Add password reset functionality
- Add user profile page
- Add data export feature
