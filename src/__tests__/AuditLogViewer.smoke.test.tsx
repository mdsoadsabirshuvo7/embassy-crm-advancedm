import { render, screen } from '@testing-library/react';
import React from 'react';
import AuditLogViewer from '@/components/audit/AuditLogViewer';

// Basic smoke test to ensure component renders without crashing.

test('renders audit log viewer heading', () => {
  render(<AuditLogViewer limit={5} />);
  expect(screen.getByText(/Audit Logs/i)).toBeInTheDocument();
});
