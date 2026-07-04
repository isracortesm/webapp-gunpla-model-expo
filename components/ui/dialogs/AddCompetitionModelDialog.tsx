'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getModels } from '@/features/models/service/models-service';
import { registerCompetitionModel } from '@/features/competition/service/competition-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import type { CompetitionEntity } from '@/domain/entities/competition/entity';
import type { ModelEntity } from '@/domain/entities/models/model-entity';
import './AddCompetitionModelDialog.css';

interface AddCompetitionModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  competition: CompetitionEntity;
  userId: number;
  registeredModelIds: string[];
  token?: string;
}

export default function AddCompetitionModelDialog({
  isOpen,
  onClose,
  competition,
  userId,
  registeredModelIds,
  token,
}: AddCompetitionModelDialogProps) {
  const { showLoading, hideLoading, showError, showSuccess } = useUnifiedDialog();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<typeof competition.categories[number] | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [userModels, setUserModels] = useState<ModelEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (competition.categories.length > 0) {
      setSelectedCategory(competition.categories[0]);
    }
    setIsDropdownOpen(false);
    setSelectedModelId(null);
    setSearchQuery('');
    setUserModels([]);

    async function loadModels() {
      try {
        const result = await getModels(1, 30, userId);
        setUserModels(result.data);
      } catch {
        showError('Error al cargar modelos', 'Error');
      }
    }
    loadModels();
  }, [isOpen, userId, showError, competition.categories]);

  const availableModels = useMemo(() => {
    return userModels.filter((m) => !registeredModelIds.includes(m.documentId));
  }, [userModels, registeredModelIds]);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return availableModels;
    const q = searchQuery.toLowerCase();
    return availableModels.filter((m) => m.name.toLowerCase().includes(q));
  }, [availableModels, searchQuery]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedModelId) return;

    setSubmitting(true);
    showLoading('Registrando modelo...');
    try {
      await registerCompetitionModel(
        {
          competition: competition.documentId,
          user: String(userId),
          model: selectedModelId,
          category: String(selectedCategory.id),
        },
        token,
      );
      showSuccess('¡Modelo registrado correctamente!');
      handleClose();
    } catch {
      showError('Error al registrar modelo', 'Error');
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-model-dialog__overlay" onClick={handleClose}>
      <div className="add-model-dialog__modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="add-model-dialog__title">Registrar Modelo a la Competencia</h2>

        <div className="add-model-dialog__section">
          <label className="add-model-dialog__label">Seleccionar Categoría</label>
          <div className="add-model-dialog__category-selector-wrapper">
            <button
              className="add-model-dialog__category-selector"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedCategory?.name ?? 'Seleccionar una categoría'}</span>
              <span className={`add-model-dialog__selector-chevron ${isDropdownOpen ? 'add-model-dialog__selector-chevron--open' : ''}`}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="add-model-dialog__dropdown">
                {competition.categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`add-model-dialog__dropdown-item ${selectedCategory?.id === cat.id ? 'add-model-dialog__dropdown-item--selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {cat.name}
                    {selectedCategory?.id === cat.id && <span className="add-model-dialog__dropdown-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCategory && (
            <div className="add-model-dialog__category-content">
              <p className="add-model-dialog__category-desc">{selectedCategory.description}</p>
              <div className="add-model-dialog__criterias">
                <h4 className="add-model-dialog__criterias-title">Criterios de Evaluación</h4>
                {selectedCategory.criterias.map((criteria) => (
                  <div key={criteria.id} className="add-model-dialog__criteria-card">
                    <div className="add-model-dialog__criteria-header">
                      <span className="add-model-dialog__criteria-name">{criteria.name}</span>
                      <span className="add-model-dialog__criteria-points">Max: {criteria.maxPoints} pts</span>
                    </div>
                    <p className="add-model-dialog__criteria-desc">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="add-model-dialog__section">
          <label className="add-model-dialog__label">Seleccionar Modelo</label>
          <input
            type="text"
            className="add-model-dialog__search"
            placeholder="Buscar modelos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="add-model-dialog__model-list">
            {filteredModels.length === 0 && (
              <div className="add-model-dialog__empty">
                <p>No hay modelos disponibles</p>
                <button onClick={() => router.push('/user/models')} className="add-model-dialog__create-model-btn">
                  Crear un modelo
                </button>
              </div>
            )}
            {filteredModels.map((model) => (
              <button
                key={model.documentId}
                className={`add-model-dialog__model-item ${selectedModelId === model.documentId ? 'add-model-dialog__model-item--selected' : ''}`}
                onClick={() => setSelectedModelId(model.documentId)}
              >
                <div className="add-model-dialog__model-thumb">
                  {model.image?.url ? (
                    <Image src={model.image.url} alt={model.name} fill className="object-cover" />
                  ) : (
                    <Image src="/globe.svg" alt="Placeholder" fill className="object-cover" />
                  )}
                </div>
                <div className="add-model-dialog__model-info">
                  <span className="add-model-dialog__model-name">{model.name}</span>
                  <span className="add-model-dialog__model-desc">{model.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="add-model-dialog__actions">
          <button onClick={handleClose} className="add-model-dialog__cancel-btn">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory || !selectedModelId || submitting}
            className="add-model-dialog__submit-btn"
          >
            {submitting ? 'Registrando...' : 'Registrar Modelo'}
          </button>
        </div>
      </div>
    </div>
  );
}
