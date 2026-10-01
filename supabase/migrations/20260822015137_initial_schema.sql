-- Create custom types
CREATE TYPE workspace_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE fridge_item_status AS ENUM ('in_stock', 'low', 'out');

-- 1. Workspaces Table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_pro BOOLEAN DEFAULT FALSE,
    country TEXT DEFAULT 'US',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspace Members Table
CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role workspace_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- 3. Fridge Items Table
CREATE TABLE fridge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    status fridge_item_status DEFAULT 'in_stock',
    expiration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Shopping Items Table
CREATE TABLE shopping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    is_purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE fridge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
-- Users can view workspaces they own or are members of
CREATE POLICY "View workspaces" ON workspaces FOR SELECT 
USING (auth.uid() = owner_id OR id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Only owners can update workspaces
CREATE POLICY "Update workspaces" ON workspaces FOR UPDATE 
USING (auth.uid() = owner_id);

-- Only owners can delete workspaces
CREATE POLICY "Delete workspaces" ON workspaces FOR DELETE 
USING (auth.uid() = owner_id);

-- Workspace Members Policies
-- Users can see all members in a workspace they belong to
CREATE POLICY "View workspace members" ON workspace_members FOR SELECT 
USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()) OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Only Admins (owner) can insert/update/delete members
CREATE POLICY "Manage workspace members" ON workspace_members FOR ALL 
USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));

-- Fridge Items Policies
-- Users can view items in their workspaces
CREATE POLICY "View fridge items" ON fridge_items FOR SELECT 
USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()) OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Admins and Editors can insert/update/delete fridge items
CREATE POLICY "Manage fridge items" ON fridge_items FOR ALL 
USING (
  workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()) OR 
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Shopping Items Policies
-- Users can view shopping items in their workspaces
CREATE POLICY "View shopping items" ON shopping_items FOR SELECT 
USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()) OR workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Admins and Editors can insert/update/delete shopping items
CREATE POLICY "Manage shopping items" ON shopping_items FOR ALL 
USING (
  workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()) OR 
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);
