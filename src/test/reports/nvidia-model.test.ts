import { afterEach, expect, it, vi } from 'vitest';
import { NVIDIAAdapter } from '../../../api/hint';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it.each([undefined, '', '  ', 'meta/llama-3.1-8b-instruct'])('uses the supported replacement for missing or retired configuration %s', async model => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubEnv('NVIDIA_HINT_MODEL', model);
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'Useful hint' } }] })));
  vi.stubGlobal('fetch', fetchMock);
  expect(await new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 })).toEqual({ text: 'Useful hint', source: 'nvidia' });
  const [url, request] = fetchMock.mock.calls[0];
  expect(url).toBe('https://integrate.api.nvidia.com/v1/chat/completions');
  expect(JSON.parse(request.body).model).toBe('meta/llama-3.3-70b-instruct');
});

it('preserves an explicitly configured alternative model', async () => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubEnv('NVIDIA_HINT_MODEL', ' alternative/model ');
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'Hint' } }] })));
  vi.stubGlobal('fetch', fetchMock);
  await new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 });
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).model).toBe('alternative/model');
});
