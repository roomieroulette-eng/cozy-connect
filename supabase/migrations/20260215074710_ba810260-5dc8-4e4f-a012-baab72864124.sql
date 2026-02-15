
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'match' or 'message'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  related_match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create notification on new match
CREATE OR REPLACE FUNCTION public.notify_on_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  u1_name TEXT;
  u2_name TEXT;
BEGIN
  SELECT COALESCE(name, 'Someone') INTO u1_name FROM profiles WHERE user_id = NEW.user1_id;
  SELECT COALESCE(name, 'Someone') INTO u2_name FROM profiles WHERE user_id = NEW.user2_id;

  INSERT INTO notifications (user_id, type, title, body, related_match_id)
  VALUES (NEW.user1_id, 'match', 'New Match! 🎉', u2_name || ' matched with you!', NEW.id);

  INSERT INTO notifications (user_id, type, title, body, related_match_id)
  VALUES (NEW.user2_id, 'match', 'New Match! 🎉', u1_name || ' matched with you!', NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_match
AFTER INSERT ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_match();

-- Function to create notification on new message
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sender_name TEXT;
  receiver_id UUID;
  match_record RECORD;
BEGIN
  SELECT COALESCE(name, 'Someone') INTO sender_name FROM profiles WHERE user_id = NEW.sender_id;

  SELECT * INTO match_record FROM matches WHERE id = NEW.match_id;
  IF match_record.user1_id = NEW.sender_id THEN
    receiver_id := match_record.user2_id;
  ELSE
    receiver_id := match_record.user1_id;
  END IF;

  INSERT INTO notifications (user_id, type, title, body, related_match_id)
  VALUES (receiver_id, 'message', 'New Message 💬', sender_name || ': ' || LEFT(NEW.content, 100), NEW.match_id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_message();
