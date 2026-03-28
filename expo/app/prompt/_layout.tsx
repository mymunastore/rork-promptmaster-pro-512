import { Stack } from 'expo-router';

export default function PromptLayout() {
  return (
    <Stack>
      <Stack.Screen name="editor" options={{ title: 'Prompt Editor' }} />
      <Stack.Screen name="view" options={{ title: 'View Prompt' }} />
    </Stack>
  );
}