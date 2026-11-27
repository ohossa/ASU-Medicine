-- Apply separately after confirming write quota headroom.
CREATE INDEX IF NOT EXISTS idx_learning_entries_user_question
ON learning_entries(user_id, question_id);
