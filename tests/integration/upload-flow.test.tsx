import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { FindingCard } from '../../src/components/findings/FindingCard';
import { Finding } from '../../src/types';

describe('UI Primitives and Finding Card Integration', () => {
  it('renders status badges with appropriate labels and colors', () => {
    const { rerender } = render(<Badge status="supported" />);
    expect(screen.getByText('Supported')).toBeInTheDocument();

    rerender(<Badge status="inconclusive" />);
    expect(screen.getByText('Inconclusive')).toBeInTheDocument();

    rerender(<Badge status="underpowered" />);
    expect(screen.getByText('Underpowered')).toBeInTheDocument();
  });

  it('renders button with loading spinner when isLoading is true', () => {
    render(<Button isLoading>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders FindingCard with rank, metrics, and summary', () => {
    const finding: Finding = {
      id: 'test_finding',
      analysisSessionId: 'test_session',
      attributeKey: 'color_contrast',
      attributeLabel: 'Color Contrast',
      metric: 'ctr',
      groupLabels: ['Low Contrast', 'High Contrast'],
      groupValues: [0.024, 0.052],
      groupCounts: [28, 32],
      effectSize: 0.028,
      confidenceInterval: [0.012, 0.044],
      sampleSize: 60,
      status: 'supported',
      method: 'Proportion test',
      limitations: ['Caveat 1'],
      summary: 'Higher visual contrast is associated with higher CTR.',
    };

    render(
      <MemoryRouter>
        <FindingCard finding={finding} rank={1} />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Color Contrast vs CTR')).toBeInTheDocument();
    expect(screen.getByText('+2.8%')).toBeInTheDocument();
    expect(screen.getByText('[1.2%, 4.4%]')).toBeInTheDocument();
    expect(screen.getByText('n = 60')).toBeInTheDocument();
    expect(screen.getByText('Supported')).toBeInTheDocument();
  });
});
