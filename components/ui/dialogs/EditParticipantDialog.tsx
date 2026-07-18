'use client';

import { useState, useEffect } from 'react';
import { updateActivityParticipant } from '@/features/event-dashboard/service/event-dashboard-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import type { ActivityParticipantEntity, PopulatedUser } from '@/domain/entities/event-dashboard/entity';
import './EditParticipantDialog.css';

interface EditParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  participant: ActivityParticipantEntity | null;
  token: string;
}

export default function EditParticipantDialog({
  isOpen,
  onClose,
  onUpdated,
  participant,
  token,
}: EditParticipantDialogProps) {
  const { showLoading, hideLoading, showError, showSuccess } = useUnifiedDialog();
  const [statusName, setStatusName] = useState<'registered' | 'paid'>('registered');
  const [checkIn, setCheckIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!participant) return;
    setStatusName(participant.statusName === 'paid' ? 'paid' : 'registered');
    setCheckIn(participant.checkIn);
    setIsDropdownOpen(false);
  }, [participant]);

  const handleSubmit = async () => {
    if (!participant) return;

    showLoading('Actualizando...');
    try {
      await updateActivityParticipant(participant.documentId, { statusName, checkIn }, token);
      showSuccess('Participación actualizada');
      onUpdated();
      onClose();
    } catch {
      showError('Error al actualizar la participación', 'Error');
    } finally {
      hideLoading();
    }
  };

  if (!isOpen || !participant) return null;

  const populatedUser = participant.user as PopulatedUser | undefined;

  return (
    <div className="edit-participant-dialog__overlay" onClick={onClose}>
      <div className="edit-participant-dialog__modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-participant-dialog__title">Editar Participación</h2>

        <div className="edit-participant-dialog__info">
          <p className="edit-participant-dialog__username">{populatedUser?.username ?? '—'}</p>
          <p className="edit-participant-dialog__email">{populatedUser?.email ?? '—'}</p>
        </div>

        <div className="edit-participant-dialog__field">
          <label className="edit-participant-dialog__label">Estado</label>
          <div className="edit-participant-dialog__select-wrapper">
            <button
              className="edit-participant-dialog__select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{statusName === 'paid' ? 'Pagado' : 'Registrado'}</span>
              <span className={`edit-participant-dialog__chevron ${isDropdownOpen ? 'edit-participant-dialog__chevron--open' : ''}`}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className="edit-participant-dialog__dropdown">
                <button
                  className={`edit-participant-dialog__dropdown-item ${statusName === 'registered' ? 'edit-participant-dialog__dropdown-item--selected' : ''}`}
                  onClick={() => { setStatusName('registered'); setIsDropdownOpen(false); }}
                >
                  Registrado
                </button>
                <button
                  className={`edit-participant-dialog__dropdown-item ${statusName === 'paid' ? 'edit-participant-dialog__dropdown-item--selected' : ''}`}
                  onClick={() => { setStatusName('paid'); setIsDropdownOpen(false); }}
                >
                  Pagado
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="edit-participant-dialog__field">
          <label className="edit-participant-dialog__label">Check-in</label>
          <button
            className={`edit-participant-dialog__switch ${checkIn ? 'edit-participant-dialog__switch--on' : ''}`}
            onClick={() => setCheckIn(!checkIn)}
            role="switch"
            aria-checked={checkIn}
          >
            <span className="edit-participant-dialog__switch-thumb" />
          </button>
        </div>

        <div className="edit-participant-dialog__actions">
          <button onClick={onClose} className="edit-participant-dialog__cancel-btn">Cancelar</button>
          <button onClick={handleSubmit} className="edit-participant-dialog__submit-btn">Actualizar</button>
        </div>
      </div>
    </div>
  );
}
