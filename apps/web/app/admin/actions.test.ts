jest.mock('../../lib/auth-guards', () => ({
  requireAdmin: jest.fn(() => Promise.resolve()),
}));

const updateMock = jest.fn();
const revalidateMock = jest.fn();

jest.mock('@/lib/prisma', () => ({
  prisma: {
    therapistProfile: {
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
  TherapistStatus: {
    PENDING: 'PENDING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => revalidateMock(...args),
}));

const { requireAdmin } = require('../../lib/auth-guards') as { requireAdmin: jest.Mock };
const { updateTherapistStatus } = require('./actions') as {
  updateTherapistStatus: (form: FormData) => Promise<void>;
};

describe('updateTherapistStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists status, notes and visibility for verified profiles', async () => {
    const form = new FormData();
    form.set('profileId', 'profile-123');
    form.set('status', 'VERIFIED');
    form.set('adminNotes', 'Freigabe für Pilot-Kohorte');

    await updateTherapistStatus(form);

    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'profile-123' },
      data: {
        status: 'VERIFIED',
        adminNotes: 'Freigabe für Pilot-Kohorte',
        isPublic: true,
      },
    });
    expect(revalidateMock).toHaveBeenCalledWith('/admin');
  });

  it('normalises notes and keeps profile private when nicht verifiziert', async () => {
    const form = new FormData();
    form.set('profileId', 'profile-456');
    form.set('status', 'PENDING');
    form.set('adminNotes', '   ');

    await updateTherapistStatus(form);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'profile-456' },
      data: {
        status: 'PENDING',
        adminNotes: null,
        isPublic: false,
      },
    });
    expect(revalidateMock).toHaveBeenCalledWith('/admin');
  });

  it('rejects invalid status transitions', async () => {
    const form = new FormData();
    form.set('profileId', 'profile-789');
    form.set('status', 'UNKNOWN');

    await expect(updateTherapistStatus(form)).rejects.toThrow(
      'Ungültiges Formular für Status-Update',
    );
    expect(updateMock).not.toHaveBeenCalled();
    expect(revalidateMock).not.toHaveBeenCalled();
  });
});
