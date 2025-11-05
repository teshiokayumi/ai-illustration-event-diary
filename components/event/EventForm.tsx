import React, { useState, useEffect } from 'react';
import { Event } from '../../types';

interface EventFormProps {
  onSubmit: (eventData: Omit<Event, 'id' | 'userId'>, editPassword: string) => void;
  initialData?: Event | null;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, isSubmitting, submitButtonText = "イベントを送信" }) => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    fee: '0',
    organizerName: '',
    contactInfo: '',
  });
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        startTime: initialData.startTime.substring(0, 16),
        endTime: initialData.endTime.substring(0, 16),
        location: initialData.location,
        description: initialData.description,
        fee: String(initialData.fee),
        organizerName: initialData.organizerName,
        contactInfo: initialData.contactInfo || '',
      });
      // Do not pre-fill the edit password for security
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPassword && !initialData) {
        alert("イベント編集用のパスワードを設定してください。");
        return;
    }
    const eventDataToSubmit = {
      ...formData,
      fee: parseFloat(formData.fee) || 0,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      editPasswordHash: initialData ? initialData.editPasswordHash : editPassword,
    };
    
    onSubmit(eventDataToSubmit, editPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="イベントタイトル" name="title" value={formData.title} onChange={handleChange} required />
        <InputField label="主催者名" name="organizerName" value={formData.organizerName} onChange={handleChange} required />
        <InputField label="開始日時" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required />
        <InputField label="終了日時" name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} required />
        <InputField label="場所・URL" name="location" value={formData.location} onChange={handleChange} required />
        <InputField label="参加費 ($)" name="fee" type="number" value={formData.fee} onChange={handleChange} required />
      </div>
      <InputField label="連絡先情報 (任意)" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
      <div>
        <label className="block text-sm font-medium text-on-surface-secondary mb-1">説明</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-on-surface focus:ring-primary focus:border-primary"
        />
      </div>
      {!initialData && (
          <InputField 
            label="イベント編集用パスワードを作成" 
            name="editPassword" 
            type="password" 
            value={editPassword} 
            onChange={(e) => setEditPassword(e.target.value)} 
            required 
            helpText="このパスワードは後でイベントを編集するために必要です。失くさないでください。"
          />
      )}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500"
        >
          {isSubmitting ? '送信中...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    helpText?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', required = false, helpText }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-secondary mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-on-surface focus:ring-primary focus:border-primary"
        />
        {helpText && <p className="mt-2 text-xs text-on-surface-secondary">{helpText}</p>}
    </div>
);

export default EventForm;
