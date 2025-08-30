-- Disable the problematic trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-create the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', new.email)
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
  END;
  
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create email templates for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Re-create the trigger with the improved function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
