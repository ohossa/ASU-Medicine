# Immediate Quiz XP Feedback

1. Use the same answer grading rules for the local XP notice and server rewards. Verify points for objective, essay and partially answered case questions and check that invalid or incorrect answers earn no notice.
2. Store committed answers before showing XP. Show first-correct feedback immediately, label it pending, and flush when the quiz ends or is left. Keep failed submissions for retry without repeating the notice or incrementing the confirmed XP total twice.
3. Keep distinct answers to the same question in order during batching so a later wrong answer cannot erase an earlier earned reward. Verify offline recovery, reload and duplicate handling.
4. Run the full test suite and build, push both changes to production, and verify Vercel, D1 and the quiz while signed in if a session is available.
