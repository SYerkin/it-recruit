import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@shared/api';

export const AdminVerification: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'verification-requests'],
    queryFn: () => adminApi.getVerificationRequests(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminComment }: { id: number; status: 'APPROVED' | 'REJECTED'; adminComment?: string }) =>
      adminApi.updateVerificationRequest(id, { status, adminComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verification-requests'] });
    },
  });

  if (isLoading) return <div style={{ padding: 20 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Заявки на верификацию</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {(data?.data || []).map((request) => (
          <div key={request.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fff' }}>
            <div><strong>{request.company.name}</strong> ({request.submittedBy.email})</div>
            <div>Статус: {request.status}</div>
            <div style={{ marginTop: 8 }}>
              Документы:{' '}
              {request.documents.map((doc, index) => (
                <a key={`${request.id}-${index}`} href={doc.url} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>
                  {doc.name || `Документ ${index + 1}`}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={() => updateMutation.mutate({ id: request.id, status: 'APPROVED' })}
                disabled={updateMutation.isPending || request.status === 'APPROVED'}
              >
                Одобрить
              </button>
              <button
                onClick={() => {
                  const comment = window.prompt('Причина отклонения');
                  if (comment !== null) {
                    updateMutation.mutate({ id: request.id, status: 'REJECTED', adminComment: comment });
                  }
                }}
                disabled={updateMutation.isPending || request.status === 'REJECTED'}
              >
                Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
