import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from './ContactForm';
import { api } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  api: { contact: vi.fn() },
}));

describe('ContactForm', () => {
  beforeEach(() => {
    api.contact.mockReset();
  });

  it('shows validation errors and does not submit when empty', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/add your name/i)).toBeInTheDocument();
    expect(screen.getByText(/add an email/i)).toBeInTheDocument();
    expect(screen.getByText(/write a message/i)).toBeInTheDocument();
    expect(api.contact).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'A sufficiently long message here.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/doesn’t look right/i)).toBeInTheDocument();
    expect(api.contact).not.toHaveBeenCalled();
  });

  it('submits valid data and shows a success state', async () => {
    api.contact.mockResolvedValue({ ok: true, delivered: false });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hello, I enjoyed exploring the atlas!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(api.contact).toHaveBeenCalledTimes(1));
    expect(api.contact.mock.calls[0][0]).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });

  it('surfaces a rate-limit error', async () => {
    const err = new Error('rate');
    err.status = 429;
    api.contact.mockRejectedValue(err);
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Another long enough message.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/try again in a little while/i);
  });
});
