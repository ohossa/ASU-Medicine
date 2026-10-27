import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCloudSync } from './useCloudSync';

// Mock Clerk useAuth hook
const mockGetToken = vi.fn().mockResolvedValue('test-token-123');
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
    isSignedIn: true,
    userId: 'test-user'
  })
}));

describe('useCloudSync hook', () => {
  let fetchMock: any;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Mock global fetch
    fetchMock = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: {} })
      })
    );
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('performs pull on mount and processes payload changes', async () => {
    // Setup cloud data returned from server
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            'theme': 'dark',
            'asu_quiz_session:test-user:1:anatomy': JSON.stringify({
              chapterId: 1,
              subjectName: 'anatomy',
              current: 5,
              answers: {},
              timestamp: 1000 // Old timestamp
            })
          }
        })
      })
    );

    // Set local storage values
    localStorage.setItem('theme', 'light');
    localStorage.setItem('asu_quiz_session:test-user:1:anatomy', JSON.stringify({
      chapterId: 1,
      subjectName: 'anatomy',
      current: 10,
      answers: {},
      timestamp: 2000 // Newer local timestamp
    }));

    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    renderHook(() => useCloudSync());

    // Allow async pullData to run and resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Theme should be overwritten because it does not have a timestamp check
    expect(localStorage.getItem('theme')).toBe('dark');

    // Quiz session should NOT be overwritten because local timestamp (2000) > cloud timestamp (1000)
    const localSession = JSON.parse(localStorage.getItem('asu_quiz_session:test-user:1:anatomy')!);
    expect(localSession.current).toBe(10);

    // Event should be dispatched since theme changed
    expect(dispatchEventSpy).toHaveBeenCalled();
  });

  it('overwrites local session if cloud session has a newer timestamp', async () => {
    // Setup cloud data with newer timestamp
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            'asu_quiz_session:test-user:1:anatomy': JSON.stringify({
              chapterId: 1,
              subjectName: 'anatomy',
              current: 12,
              answers: {},
              timestamp: 3000 // Newer cloud timestamp
            })
          }
        })
      })
    );

    localStorage.setItem('asu_quiz_session:test-user:1:anatomy', JSON.stringify({
      chapterId: 1,
      subjectName: 'anatomy',
      current: 10,
      answers: {},
      timestamp: 2000 // Older local timestamp
    }));

    renderHook(() => useCloudSync());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Local session should be overwritten
    const localSession = JSON.parse(localStorage.getItem('asu_quiz_session:test-user:1:anatomy')!);
    expect(localSession.current).toBe(12);
  });

  it('queues a push if a sync is triggered while a push is already in progress', async () => {
    // Mock fetch for first push to be slow and resolve later
    let resolveFirstPush: any;
    const firstPushPromise = new Promise(resolve => {
      resolveFirstPush = resolve;
    });

    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return firstPushPromise.then(() => ({
          ok: true,
          json: () => Promise.resolve({ data: {} })
        }));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: {} })
      });
    });

    renderHook(() => useCloudSync());

    // Allow mount pull to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(fetchMock).toHaveBeenCalledTimes(1); // 1 pull on mount

    // Mutate a key and trigger first push
    localStorage.setItem('theme', 'dark');
    window.dispatchEvent(new Event('trigger-cloud-sync'));

    // Allow microtasks to execute and start the push
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(fetchMock).toHaveBeenCalledTimes(2); // 1 pull + 1 push started

    // Mutate again and trigger second push while first is still in progress
    localStorage.setItem('theme', 'light');
    window.dispatchEvent(new Event('trigger-cloud-sync'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Fetch should not have been called a third time yet since the first push is in progress
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Resolve first push
    await act(async () => {
      resolveFirstPush();
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    // Now the second push should automatically execute because of the dirty flag queueing
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
  it('syncs only the current account shuffle setting and quiz sessions', async()=>{
    localStorage.setItem('asu_preferences:test-user:shuffle',JSON.stringify({enabled:true,timestamp:200}));
    localStorage.setItem('asu_preferences:other:shuffle',JSON.stringify({enabled:false,timestamp:100}));
    localStorage.setItem('asu_quiz_session:other:1:all',JSON.stringify({current:9}));
    const {unmount}=renderHook(()=>useCloudSync());
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});
    window.dispatchEvent(new Event('trigger-cloud-sync'));
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});
    const push=fetchMock.mock.calls.find(([,init]:any[])=>init?.method==='POST');
    expect(JSON.parse(push[1].body)).toEqual({'asu_preferences:test-user:shuffle':{enabled:true,timestamp:200}});
    unmount();
  });

  it('does not execute POST /api/sync during idle pull when cloud and local are already in sync', async () => {
    const existingHistory = [{ id: 'attempt-1', date: '2026-10-23T10:00:00Z', pct: 95 }];
    localStorage.setItem('asu_history:test-user', JSON.stringify(existingHistory));
    localStorage.setItem('theme', 'dark');

    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            'theme': 'dark',
            'endocrine_essay_quiz_history': existingHistory
          }
        })
      })
    );

    const { unmount } = renderHook(() => useCloudSync());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should only have performed 1 GET pull, and ZERO POST calls
    const postCalls = fetchMock.mock.calls.filter(([, init]: any[]) => init?.method === 'POST');
    expect(postCalls).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('triggers POST /api/sync during pull if local has offline attempts missing in cloud', async () => {
    const cloudHistory = [{ id: 'cloud-1', date: '2026-10-20T10:00:00Z', pct: 85 }];
    const offlineHistory = [
      { id: 'cloud-1', date: '2026-10-20T10:00:00Z', pct: 85 },
      { id: 'offline-2', date: '2026-10-23T10:00:00Z', pct: 100 }
    ];
    localStorage.setItem('asu_history:test-user', JSON.stringify(offlineHistory));

    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            'endocrine_essay_quiz_history': cloudHistory
          }
        })
      });
    });

    const { unmount } = renderHook(() => useCloudSync());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    const postCalls = fetchMock.mock.calls.filter(([, init]: any[]) => init?.method === 'POST');
    expect(postCalls).toHaveLength(1);
    const body = JSON.parse(postCalls[0][1].body);
    expect(body.endocrine_essay_quiz_history).toHaveLength(2);
    expect(body.endocrine_essay_quiz_history.map((x: any) => x.id)).toContain('offline-2');
    unmount();
  });

});
