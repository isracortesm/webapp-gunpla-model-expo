'use client';

import { useState } from 'react';

interface PasswordFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
}

export default function PasswordField({
  id,
  value,
  onChange,
  placeholder,
  className = '',
  required,
  disabled,
  readOnly,
  label,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          style={{ paddingRight: '40px', width: '100%' }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: '8px',
            top: '30%',
            transform: 'translateY(-30%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          tabIndex={-1}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <img
            src={show ? '/visibility_off.svg' : '/visibility_on.svg'}
            alt={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
