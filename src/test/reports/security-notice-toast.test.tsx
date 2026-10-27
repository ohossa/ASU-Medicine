import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SecurityNoticeToast, dispatchSecurityNotice } from '../../app/components/SecurityNoticeToast';

describe('SecurityNoticeToast Component', () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders nothing initially when no notice is active', () => {
    const { container } = render(<SecurityNoticeToast />);
    expect(container.firstChild).toBeNull();
  });

  it('renders security notice when event is dispatched', () => {
    render(<SecurityNoticeToast />);

    act(() => {
      dispatchSecurityNotice({
        title: 'Session Expired',
        message: 'Your authenticated session has ended. Please sign in again.',
        type: 'warning',
      });
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Session Expired')).toBeInTheDocument();
    expect(screen.getByText(/Your authenticated session has ended/)).toBeInTheDocument();
  });

  it('executes action callback and dismisses notice when action button clicked', () => {
    const onAction = vi.fn();
    render(<SecurityNoticeToast />);

    act(() => {
      dispatchSecurityNotice({
        title: 'Rate Limit Exceeded',
        message: 'Too many requests. Please wait a moment.',
        type: 'error',
        actionLabel: 'Retry Now',
        onAction,
      });
    });

    const actionButton = screen.getByRole('button', { name: 'Retry Now' });
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('dismisses notice when dismiss button is clicked', () => {
    render(<SecurityNoticeToast />);

    act(() => {
      dispatchSecurityNotice({
        title: 'Notice',
        message: 'Security update applied.',
        type: 'info',
      });
    });

    const dismissButton = screen.getByRole('button', { name: /Dismiss security notice/i });
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
