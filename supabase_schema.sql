-- 1. Create Profiles Table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'retailer')),
  full_name text,
  email text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Retailers Table
CREATE TABLE retailers (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  store_name text,
  store_description text,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. RLS Policies for Retailers
CREATE POLICY "Retailers can view their own store data" ON retailers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Retailers can update their own store data" ON retailers
  FOR UPDATE USING (auth.uid() = id);

-- 6. Public Profile Access (for shopping view)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- 7. Trigger for auto-inserting profiles on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'role'
  );

  -- If the role is retailer, also insert into retailers table
  IF (new.raw_user_meta_data->>'role' = 'retailer') THEN
    INSERT INTO public.retailers (id, store_name, store_description)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'store_name',
      new.raw_user_meta_data->>'store_description'
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
