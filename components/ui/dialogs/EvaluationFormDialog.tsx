'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  onSaved: () => Promise<void> | void;
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
      const existing = evaluations.find((e) => e.name === criteria.name);
      nextRows[String(criteria.id)] = {
        points: existing ? String(existing.points) : '',
        comments: existing?.comments ?? '',
      };
    }
    return nextRows;
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedHelpers, setExpandedHelpers] = useState<Record<string, boolean>>({});

  const toggleHelper = (key: string) => {
    setExpandedHelpers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

    const operations: { documentId?: string; name: string; criteriaDocumentId: string; points: number; comments: string }[] = [];

    for (const criteria of category.criterias) {
      const row = rows[String(criteria.id)];
      const rawPoints = row?.points ?? '';
      const comments = row?.comments ?? '';
      const existing = evaluations.find((e) => e.name === criteria.name);

      if (rawPoints.trim() === '') {
        if (existing) {
          operations.push({
            documentId: existing.documentId,
            name: criteria.name,
            criteriaDocumentId: criteria.documentId,
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
        name: criteria.name,
        criteriaDocumentId: criteria.documentId,
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
          try {
            await createCompetitionEvaluation(
              {
                name: op.name,
                criteria: op.criteriaDocumentId,
                points: op.points,
                comments: op.comments,
                result: result.documentId,
                reviewer: reviewerDocumentId,
              },
              token,
            );
          } catch (error: unknown) {
            // 409: la evaluación ya existe (creada concurrentemente) → tratar como guardado exitoso
            const isConflict =
              error instanceof Error &&
              'status' in error &&
              (error as { status?: number }).status === 409;
            if (!isConflict) throw error;
          }
        }
      }
      showSuccess('Evaluaciones guardadas correctamente');
      await onSaved();
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
              <button
                type="button"
                aria-label="Mostrar descripción de la categoría"
                aria-expanded={!!expandedHelpers['category']}
                className="evaluation-dialog__info-btn"
                onClick={() => toggleHelper('category')}
              >
                <Image src="/info_30dp.svg" alt="" width={18} height={18} />
              </button>
            )}
          </div>

          {category.description && expandedHelpers['category'] && (
            <p className="evaluation-dialog__helper-text">{category.description}</p>
          )}

          <div className="evaluation-dialog__criterias">
            {category.criterias.map((criteria) => {
              const row = rows[String(criteria.id)] ?? { points: '', comments: '' };
              return (
                <div key={criteria.id} className="evaluation-dialog__criteria">
                  <div className="evaluation-dialog__criteria-header">
                    <span className="evaluation-dialog__criteria-name">{criteria.name}</span>
                    {criteria.description && (
                      <button
                        type="button"
                        aria-label="Mostrar descripción del criterio"
                        aria-expanded={!!expandedHelpers[String(criteria.id)]}
                        className="evaluation-dialog__info-btn"
                        onClick={() => toggleHelper(String(criteria.id))}
                      >
                        <Image src="/info_30dp.svg" alt="" width={18} height={18} />
                      </button>
                    )}
                    <span className="evaluation-dialog__criteria-max">Max {criteria.maxPoints} pts</span>
                  </div>

                  {criteria.description && expandedHelpers[String(criteria.id)] && (
                    <p className="evaluation-dialog__helper-text">{criteria.description}</p>
                  )}

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
