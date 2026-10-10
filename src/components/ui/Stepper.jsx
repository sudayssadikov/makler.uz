import React from 'react';
import { Check } from 'lucide-react';
import './Stepper.css';

export const Stepper = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div className="neo-stepper-wrapper">
      <div className="neo-stepper-track">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={step.id || step.title || idx}
              className={`neo-stepper-item ${isCompleted ? 'is-completed' : ''} ${
                isCurrent ? 'is-current' : ''
              }`}
              onClick={() => onStepClick && idx <= currentStep && onStepClick(idx)}
              style={{ cursor: onStepClick && idx <= currentStep ? 'pointer' : 'default' }}
            >
              <div className="neo-stepper-indicator">
                {isCompleted ? <Check size={16} /> : idx + 1}
              </div>
              <span className="neo-stepper-title">{step.title || step}</span>
              {idx < steps.length - 1 && <div className="neo-stepper-line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
