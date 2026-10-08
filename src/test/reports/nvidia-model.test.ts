import { afterEach, expect, it, vi } from 'vitest';
import { NVIDIAAdapter } from '../../../api/hint';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it.each([undefined, '', '  ', 'meta/llama-3.1-8b-instruct', 'meta/llama-3.3-70b-instruct'])('uses the supported replacement for missing or retired configuration %s', async model => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubEnv('NVIDIA_HINT_MODEL', model);
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'Useful hint' } }] })));
  vi.stubGlobal('fetch', fetchMock);
  expect(await new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 })).toEqual({ text: 'Useful hint', source: 'nvidia' });
  const [url, request] = fetchMock.mock.calls[0];
  expect(url).toBe('https://integrate.api.nvidia.com/v1/chat/completions');
  expect(JSON.parse(request.body).model).toBe('writer/palmyra-med-70b');
});

it('preserves an explicitly configured alternative model', async () => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubEnv('NVIDIA_HINT_MODEL', ' alternative/model ');
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'Hint' } }] })));
  vi.stubGlobal('fetch', fetchMock);
  await new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 });
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).model).toBe('alternative/model');
});


it('recovers from a newly retired model using a catalog-listed text fallback', async () => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubEnv('NVIDIA_HINT_MODEL', 'future/retired-model');
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(new Response('retired', { status: 410 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ id: 'mistralai/mistral-large-2-instruct' }, { id: 'some/unknown-model' }] })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: 'Recovered hint' } }] })));
  vi.stubGlobal('fetch', fetchMock);
  expect(await new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 })).toEqual({ text: 'Recovered hint', source: 'nvidia' });
  expect(fetchMock.mock.calls[1][0]).toBe('https://integrate.api.nvidia.com/v1/models');
  expect(JSON.parse(fetchMock.mock.calls[2][1].body).model).toBe('mistralai/mistral-large-2-instruct');
  expect(JSON.parse(fetchMock.mock.calls[2][1].body).messages).toEqual(JSON.parse(fetchMock.mock.calls[0][1].body).messages);
});

it.each([401, 403, 429, 500])('does not retry or expose upstream details on HTTP %s', async status => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  const fetchMock = vi.fn().mockResolvedValue(new Response('private upstream details', { status }));
  vi.stubGlobal('fetch', fetchMock);
  const promise = new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 });
  await expect(promise).rejects.toThrow(`${status}`);
  await expect(promise).rejects.not.toThrow('private upstream details');
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('fails clearly when the retirement catalog has no approved replacement', async () => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(new Response('retired', { status: 410 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ id: 'vision/only' }] })));
  vi.stubGlobal('fetch', fetchMock);
  await expect(new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 })).rejects.toThrow('503');
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it('does not return an empty successful hint', async () => {
  vi.stubEnv('NVIDIA_API_KEY', 'test-key');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] }))));
  await expect(new NVIDIAAdapter().generateHint({ questionText: 'Test', previousAttempts: 2 })).rejects.toThrow('502');
});
