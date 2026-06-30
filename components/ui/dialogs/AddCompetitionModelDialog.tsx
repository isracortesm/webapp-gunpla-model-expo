'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getModels } from '@/features/models/service/models-service';
import { registerCompetitionModel } from '@/features/competition/service/competition-service';
import { useUnifiedDialog } from '@/features/dialogs/context/unified-dialog-provider';
import type { CompetitionEntity, CompetitionCategoryEntity } from '@/domain/entities/competition/entity';
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
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategoryEntity | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [userModels, setUserModels] = useState<ModelEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadModels() {
      try {
        const result = await getModels(1, 30, userId);
        setUserModels(result.data);
      } catch {
        showError('Failed to load models', 'Error');
      }
    }
    loadModels();
  }, [isOpen, userId, showError]);

  const availableModels = useMemo(() => {
    return userModels.filter((m) => !registeredModelIds.includes(m.documentId));
  }, [userModels, registeredModelIds]);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return availableModels;
    const q = searchQuery.toLowerCase();
    return availableModels.filter((m) => m.name.toLowerCase().includes(q));
  }, [availableModels, searchQuery]);

  const resetState = () => {
    setSelectedCategory(null);
    setExpandedCategory(null);
    setSelectedModelId(null);
    setSearchQuery('');
    setUserModels([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedModelId) return;

    setSubmitting(true);
    showLoading('Registering model...');
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
      showSuccess('Model registered successfully!');
      handleClose();
    } catch {
      showError('Failed to register model', 'Error');
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  const handleCategoryClick = (cat: CompetitionCategoryEntity) => {
    if (expandedCategory === cat.id) {
      setExpandedCategory(null);
      setSelectedCategory(null);
    } else {
      setExpandedCategory(cat.id);
      setSelectedCategory(cat);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-model-dialog__overlay" onClick={handleClose}>
      <div className="add-model-dialog__modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="add-model-dialog__title">Register Model to Competition</h2>

        <div className="add-model-dialog__section">
          <label className="add-model-dialog__label">Select Category</label>
          <div className="add-model-dialog__category-list">
            {competition.categories.map((cat) => {
              const isExpanded = expandedCategory === cat.id;

              return (
                <div key={cat.id} className="add-model-dialog__category-item">
                  <button
                    className={`add-model-dialog__category-btn ${isExpanded ? 'add-model-dialog__category-btn--selected' : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <span>{cat.name}</span>
                    <span className={`add-model-dialog__chevron ${isExpanded ? 'add-model-dialog__chevron--open' : ''}`}>
                      ▶
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="add-model-dialog__category-body">
                      <p className="add-model-dialog__category-desc">{cat.description}</p>
                      <div className="add-model-dialog__criterias">
                        <h4 className="add-model-dialog__criterias-title">Evaluation Criteria</h4>
                        {cat.criterias.map((criteria) => (
                          <div key={criteria.id} className="add-model-dialog__criteria-card">
                            <div className="add-model-dialog__criteria-header">
                              <span className="add-model-dialog__criteria-name">{criteria.name}</span>
                              <span className="add-model-dialog__criteria-code">[{criteria.codeName}]</span>
                              <span className="add-model-dialog__criteria-points">Max: {criteria.maxPoints} pts</span>
                            </div>
                            <p className="add-model-dialog__criteria-desc">{criteria.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="add-model-dialog__section">
          <label className="add-model-dialog__label">Select Model</label>
          <input
            type="text"
            className="add-model-dialog__search"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="add-model-dialog__model-list">
            {filteredModels.length === 0 && (
              <p className="add-model-dialog__empty">No models available</p>
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory || !selectedModelId || submitting}
            className="add-model-dialog__submit-btn"
          >
            {submitting ? 'Registering...' : 'Register Model'}
          </button>
        </div>
      </div>
    </div>
  );
}
