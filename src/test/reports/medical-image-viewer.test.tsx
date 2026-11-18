import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicalImageViewerModal } from '../../app/components/MedicalImageViewerModal';
import { SpecimenViewer } from '../../app/components/SpecimenViewer';

describe('Medical Image Viewer & Specimen Modal', () => {
  const sampleUrl = 'https://a-plus-storage.r2.cloudflarestorage.com/figures/histology_kidney.jpg';

  it('renders MedicalImageViewerModal when isOpen is true', () => {
    const onClose = vi.fn();
    render(
      <MedicalImageViewerModal
        isOpen={true}
        onClose={onClose}
        imageUrl={sampleUrl}
        title="Renal Glomerulus Histology"
      />
    );

    expect(screen.getByText('Renal Glomerulus Histology')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', sampleUrl);

    // Close button works
    const closeBtn = screen.getByLabelText('Close inspection modal');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('MedicalImageViewerModal responds to zoom controls', () => {
    const onClose = vi.fn();
    render(
      <MedicalImageViewerModal
        isOpen={true}
        onClose={onClose}
        imageUrl={sampleUrl}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();

    const zoomInBtn = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('150%')).toBeInTheDocument();

    const resetBtn = screen.getByLabelText('Reset zoom');
    fireEvent.click(resetBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('SpecimenViewer renders with Apple HIG controls and uncropped view', () => {
    render(<SpecimenViewer imageUrl={sampleUrl} altText="Kidney specimen" />);

    expect(screen.getByText('Practical Specimen')).toBeInTheDocument();
    expect(screen.getByText('Full View')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle microscopy contrast')).toBeInTheDocument();
  });
});
