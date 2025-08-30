-- AutoReachPro Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
  credits_remaining INTEGER DEFAULT 500,
  monthly_send_limit INTEGER DEFAULT 500
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  industry TEXT,
  website TEXT,
  phone TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'qualified', 'converted')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  source TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, email)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  template_subject TEXT NOT NULL,
  template_content TEXT NOT NULL,
  personalization_enabled BOOLEAN DEFAULT true,
  schedule_type TEXT DEFAULT 'immediate' CHECK (schedule_type IN ('immediate', 'scheduled', 'drip')),
  schedule_data JSONB,
  total_leads INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.0
);

-- Create campaign_leads table (junction table)
CREATE TABLE IF NOT EXISTS campaign_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'replied', 'bounced', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  personalized_subject TEXT,
  personalized_content TEXT,
  tracking_id UUID DEFAULT uuid_generate_v4(),
  UNIQUE(campaign_id, lead_id)
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS campaigns_user_id_idx ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns(status);
CREATE INDEX IF NOT EXISTS campaign_leads_campaign_id_idx ON campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_leads_lead_id_idx ON campaign_leads(lead_id);
CREATE INDEX IF NOT EXISTS email_templates_user_id_idx ON email_templates(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Leads policies
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Campaign leads policies
CREATE POLICY "Users can view own campaign leads" ON campaign_leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_leads.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaign leads" ON campaign_leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_leads.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own campaign leads" ON campaign_leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_leads.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own campaign leads" ON campaign_leads
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_leads.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

-- Email templates policies
CREATE POLICY "Users can view own templates" ON email_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON email_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON email_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON email_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  
  -- Insert default email templates for new user
  INSERT INTO email_templates (user_id, name, subject, content, category, is_default) VALUES
    (
      new.id,
      'Cold Outreach - General',
      'Quick question about {{company}}',
      'Hi {{first_name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in the {{industry}} space.

I wanted to reach out because {{personalized_reason}}.

{{value_proposition}}

Would you be open to a brief 15-minute conversation this week to discuss how this could benefit {{company}}?

Best regards,
{{sender_name}}',
      'outreach',
      true
    ),
    (
      new.id,
      'Follow-up - No Response',
      'Following up on {{company}}',
      'Hi {{first_name}},

I wanted to follow up on my previous email about helping {{company}} with {{value_proposition}}.

I understand you''re busy, but I believe this could make a significant impact on your {{industry}} operations.

Would you have 10 minutes this week for a quick call?

Best regards,
{{sender_name}}',
      'follow-up',
      true
    ),
    (
      new.id,
      'Meeting Request',
      'Partnership opportunity for {{company}}',
      'Hi {{first_name}},

I hope you''re doing well! I''ve been following {{company}}''s progress and I''m impressed by your recent achievements.

I believe there''s a great opportunity for us to collaborate. Would you be interested in a brief call to explore how we might work together?

Looking forward to hearing from you.

Best regards,
{{sender_name}}',
      'meeting',
      true
    );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create sample data function (for development only)
CREATE OR REPLACE FUNCTION create_sample_data(sample_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert sample leads
  INSERT INTO leads (user_id, email, first_name, last_name, company, position, industry, status) VALUES
    (sample_user_id, 'sarah.johnson@techstartup.com', 'Sarah', 'Johnson', 'TechStartup Inc.', 'VP of Sales', 'Technology', 'replied'),
    (sample_user_id, 'mike.chen@innovate.co', 'Mike', 'Chen', 'Innovate Co.', 'CEO', 'Software', 'contacted'),
    (sample_user_id, 'emily.davis@growthcorp.com', 'Emily', 'Davis', 'Growth Corp', 'Marketing Director', 'Marketing', 'new'),
    (sample_user_id, 'john.smith@enterprise.com', 'John', 'Smith', 'Enterprise Solutions', 'CTO', 'Technology', 'qualified'),
    (sample_user_id, 'lisa.wong@startup.io', 'Lisa', 'Wong', 'Startup.io', 'Founder', 'SaaS', 'converted');

  -- Insert sample campaign
  INSERT INTO campaigns (user_id, name, description, template_subject, template_content, status, total_leads, emails_sent, emails_opened, emails_replied)
  VALUES (
    sample_user_id,
    'Q1 SaaS Outreach',
    'Targeting SaaS companies for our new automation tool',
    'Streamline your {{industry}} operations with AI',
    'Hi {{first_name}},

I noticed {{company}} is doing great work in the {{industry}} space. 

Our AI automation platform has helped similar companies reduce manual work by 60% and increase efficiency significantly.

Would you be interested in a quick 15-minute demo to see how this could benefit {{company}}?

Best regards,
AutoReachPro Team',
    'active',
    350,
    298,
    142,
    23
  );
END;
$$ LANGUAGE plpgsql;
