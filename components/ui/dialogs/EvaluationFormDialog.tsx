'use client';

import { useState } from 'react';
import {
  createCompetitionEvaluation,
  updateCompetitionEvaluation,
} from '@/features/competition/service/competition-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import type {
  CompetitionCategoryEntity,
  CompetitionEvaluationEntity,
  CompetitionResultEntity,
} from '@/domain/entities/competition/entity';
import './EvaluationFormDialog.css';

interface EvaluationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  category: CompetitionCategoryEntity;
  result: CompetitionResultEntity;
  reviewerDocumentId: string;
  evaluations: CompetitionEvaluationEntity[];
  token: string;
}

type CriteriaRow = {
  points: string;
  comments: string;
};

export default function EvaluationFormDialog({
  isOpen,
  onClose,
  onSaved,
  category,
  result,
  reviewerDocumentId,
  evaluations,
  token,
}: EvaluationFormDialogProps) {
  const { showLoading, hideLoading, showError, showSuccess } = useUnifiedDialog();
  const [rows, setRows] = useState<Record<string, CriteriaRow>>(() => {
    const nextRows: Record<string, CriteriaRow> = {};
    for (const criteria of category.criterias) {
      const existing = evaluations.find((e) => e.criteria === criteria.name);
      nextRows[String(criteria.id)] = {
        points: existing ? String(existing.points) : '',
        comments: existing?.comments ?? '',
      };
    }
    return nextRows;
  });
  const [submitting, setSubmitting] = useState(false);

  const updateRow = (criteriaId: number, patch: Partial<CriteriaRow>) => {
    setRows((prev) => ({
      ...prev,
      [String(criteriaId)]: {
        ...(prev[String(criteriaId)] ?? { points: '', comments: '' }),
        ...patch,
      },
    }));
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const operations: { documentId?: string; criteria: string; points: number; comments: string }[] = [];

    for (const criteria of category.criterias) {
      const row = rows[String(criteria.id)];
      const rawPoints = row?.points ?? '';
      const comments = row?.comments ?? '';
      const existing = evaluations.find((e) => e.criteria === criteria.name);

      if (rawPoints.trim() === '') {
        if (existing) {
          operations.push({
            documentId: existing.documentId,
            criteria: criteria.name,
            points: 0,
            comments,
          });
        }
        continue;
      }

      const points = Number(rawPoints);
      if (!Number.isInteger(points) || points < 0 || points > criteria.maxPoints) {
        showError(`Puntaje inválido para "${criteria.name}" (0-${criteria.maxPoints})`, 'Validación');
        return;
      }

      operations.push({
        documentId: existing?.documentId,
        criteria: criteria.name,
        points,
        comments,
      });
    }

    if (operations.length === 0) {
      showError('No hay evaluaciones que guardar', 'Error');
      return;
    }

    setSubmitting(true);
    showLoading('Guardando evaluaciones...');
    try {
      for (const op of operations) {
        if (op.documentId) {
          await updateCompetitionEvaluation(
            op.documentId,
            { points: op.points, comments: op.comments },
            token,
          );
        } else {
          await createCompetitionEvaluation(
            {
              criteria: op.criteria,
              points: op.points,
              comments: op.comments,
              result: result.documentId,
              reviewer: reviewerDocumentId,
            },
            token,
          );
        }
      }
      showSuccess('Evaluaciones guardadas correctamente');
      onSaved();
      onClose();
    } catch {
      showError('Error al guardar las evaluaciones', 'Error');
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="evaluation-dialog__overlay" onClick={handleClose}>
      <div className="evaluation-dialog__modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="evaluation-dialog__title">
          {evaluations.length > 0 ? 'Editar evaluaciones' : 'Capturar evaluaciones'}
        </h2>

        <div className="evaluation-dialog__category">
          <div className="evaluation-dialog__category-header">
            <span className="evaluation-dialog__category-name">{category.name}</span>
            {category.description && (
              <span className="evaluation-dialog__tooltip" tabIndex={0}>
                <span className="evaluation-dialog__tooltip-icon">ⓘ</span>
                <span className="evaluation-dialog__tooltip-text">{category.description}</span>
              </span>
            )}
          </div>

          <div className="evaluation-dialog__criterias">
            {category.criterias.map((criteria) => {
              const row = rows[String(criteria.id)] ?? { points: '', comments: '' };
              return (
                <div key={criteria.id} className="evaluation-dialog__criteria">
                  <div className="evaluation-dialog__criteria-header">
                    <span className="evaluation-dialog__criteria-name">{criteria.name}</span>
                    {criteria.description && (
                      <span className="evaluation-dialog__tooltip" tabIndex={0}>
                        <span className="evaluation-dialog__tooltip-icon">ⓘ</span>
                        <span className="evaluation-dialog__tooltip-text">{criteria.description}</span>
                      </span>
                    )}
                    <span className="evaluation-dialog__criteria-max">Max {criteria.maxPoints} pts</span>
                  </div>

                  <div className="evaluation-dialog__criteria-fields">
                    <div className="evaluation-dialog__field">
                      <label className="evaluation-dialog__field-label">Puntaje</label>
                      <input
                        type="number"
                        min={0}
                        max={criteria.maxPoints}
                        step={1}
                        inputMode="numeric"
                        value={row.points}
                        onChange={(e) => updateRow(criteria.id, { points: e.target.value })}
                        className="evaluation-dialog__input evaluation-dialog__input--points"
                        placeholder="0"
                      />
                    </div>
                    <div className="evaluation-dialog__field evaluation-dialog__field--grow">
                      <label className="evaluation-dialog__field-label">Comentario</label>
                      <input
                        type="text"
                        value={row.comments}
                        onChange={(e) => updateRow(criteria.id, { comments: e.target.value })}
                        className="evaluation-dialog__input"
                        placeholder="Retroalimentación del juez"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="evaluation-dialog__actions">
          <button onClick={handleClose} className="evaluation-dialog__cancel-btn">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="evaluation-dialog__submit-btn">
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
