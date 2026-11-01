import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { StarlightAtmosphere } from '../../app/components/StarlightAtmosphere';
import {
  StarlightCelebration,
  triggerStarlightBurst,
} from '../../app/components/StarlightCelebration';
import { ThemeContext } from '../../app/context/ThemeContextValue';

describe('Starlight Atmosphere & Celebration Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('StarlightAtmosphere returns null when theme is not starlight', () => {
    const { container } = render(
      <ThemeContext.Provider
        value={{
          isDark: true,
          theme: 'dark',
          toggleTheme: () => {},
          isStarlight: false,
          toggleStarlight: () => {},
          setStarlight: () => {},
        }}
      >
        <StarlightAtmosphere />
      </ThemeContext.Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('StarlightAtmosphere renders canvas when isStarlight is true', () => {
    // Mock getContext on canvas
    const getContextMock = vi.fn().mockReturnValue({
      scale: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
    });
    HTMLCanvasElement.prototype.getContext = getContextMock as any;

    const { container } = render(
      <ThemeContext.Provider
        value={{
          isDark: true,
          theme: 'dark',
          toggleTheme: () => {},
          isStarlight: true,
          toggleStarlight: () => {},
          setStarlight: () => {},
        }}
      >
        <StarlightAtmosphere />
      </ThemeContext.Provider>,
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('StarlightCelebration renders particles on triggerStarlightBurst', () => {
    const { container } = render(
      <ThemeContext.Provider
        value={{
          isDark: true,
          theme: 'dark',
          toggleTheme: () => {},
          isStarlight: true,
          toggleStarlight: () => {},
          setStarlight: () => {},
        }}
      >
        <StarlightCelebration />
      </ThemeContext.Provider>,
    );

    expect(container.firstChild).toBeNull();

    act(() => {
      triggerStarlightBurst(200, 300);
    });

    const particlesContainer = container.querySelector('div');
    expect(particlesContainer).toBeInTheDocument();
    expect(particlesContainer?.children.length).toBeGreaterThan(0);
  });
});
