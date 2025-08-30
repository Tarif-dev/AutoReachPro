-- Default email templates for new users
-- This script creates a function to add default templates for any user

-- First, let's create a temporary table for default template data
CREATE TEMP TABLE temp_default_templates (
  name TEXT,
  subject TEXT,
  content TEXT,
  category TEXT
);

-- Insert default template data
INSERT INTO temp_default_templates (name, subject, content, category) VALUES 
(
  'Cold Outreach - Introduction',
  'Quick question about {{company_name}}',
  E'Hi {{first_name}},\n\nI hope this email finds you well. I came across {{company_name}} and was impressed by {{company_description}}.\n\nI''m {{sender_name}} from {{sender_company}}, and we specialize in helping companies like yours {{value_proposition}}.\n\nI''d love to share a quick case study of how we helped {{similar_company}} achieve {{result}} in just {{timeframe}}.\n\nWould you be open to a brief 15-minute call this week to discuss how we might be able to help {{company_name}}?\n\nBest regards,\n{{sender_name}}\n{{sender_company}}\n{{sender_email}}\n{{sender_phone}}',
  'outreach'
),
(
  'Follow-up - First Contact',
  'Following up on my email about {{company_name}}',
  E'Hi {{first_name}},\n\nI wanted to follow up on my previous email about helping {{company_name}} with {{pain_point}}.\n\nI understand you''re probably busy, but I thought you might be interested in seeing how {{similar_company}} increased their {{metric}} by {{percentage}}% in just {{timeframe}}.\n\nHere are the key results they achieved:\n• {{result_1}}\n• {{result_2}}\n• {{result_3}}\n\nIf this resonates with your current challenges, I''d be happy to share the exact strategy we used.\n\nWould a quick 15-minute call work for you this week?\n\nBest,\n{{sender_name}}\nP.S. I only work with {{client_limit}} clients at a time, so if you''re interested, it''s best to connect soon.',
  'follow-up'
),
(
  'Meeting Request',
  'Quick 15-min chat about {{company_name}}''s {{focus_area}}?',
  E'Hi {{first_name}},\n\nI''ve been following {{company_name}}''s progress in {{industry}}, and I''m impressed by your approach to {{focus_area}}.\n\nI work with {{client_type}} companies to {{service_description}}, and I believe there might be some synergies worth exploring.\n\nWould you be open to a brief 15-minute call to:\n\n1. Learn more about your current {{challenge_area}} challenges\n2. Share how we''ve helped companies like {{similar_company}} achieve {{specific_outcome}}\n3. Explore if there''s a potential fit for collaboration\n\nI have a few slots available this week:\n• {{time_slot_1}}\n• {{time_slot_2}}\n• {{time_slot_3}}\n\nWould any of these work for you?\n\nBest regards,\n{{sender_name}}',
  'meeting'
),
(
  'Value-First Outreach',
  'Free {{resource_type}} for {{company_name}} - {{benefit}}',
  E'Hi {{first_name}},\n\nI noticed that {{company_name}} is {{company_activity}}. That''s exactly the kind of forward-thinking approach I love to see!\n\nI''ve been helping {{target_audience}} with {{specific_challenge}}, and I created a {{resource_type}} that shows exactly how to {{desired_outcome}}.\n\nHere''s what you''ll learn:\n✓ {{learning_point_1}}\n✓ {{learning_point_2}}\n✓ {{learning_point_3}}\n✓ {{learning_point_4}}\n\nI''d love to send it your way - no strings attached. It''s helped companies like {{example_company}} achieve {{example_result}}.\n\nInterested? Just reply with "{{keyword}}" and I''ll send it over immediately.\n\nBest,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}',
  'outreach'
);

-- Function to create default templates for new users
CREATE OR REPLACE FUNCTION create_default_templates_for_user(user_id_param UUID)
RETURNS void AS $$
BEGIN
  -- Insert default templates for the user
  INSERT INTO email_templates (
    user_id,
    name, 
    subject, 
    content, 
    category, 
    is_default, 
    usage_count,
    created_at,
    updated_at
  ) 
  SELECT 
    user_id_param,
    name,
    subject,
    content,
    category,
    false, -- User-specific templates are not marked as default
    0,
    NOW(),
    NOW()
  FROM email_templates 
  WHERE is_default = true AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql;
