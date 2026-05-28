-- Verificar a ocupação atual de uma viagem (Segurança de capacidade)
SELECT 
    tr.id AS travel_id,
    tr.capacity AS max_capacity,
    COUNT(tk.id) AS confirmed_tickets,
    (tr.capacity - COUNT(tk.id)) AS available_seats
FROM travel tr
LEFT JOIN ticket tk ON tr.id = tk.travel_id AND tk.status = 'CONFIRMED'
WHERE tr.id = 'ID_DA_VIAGEM'
GROUP BY tr.id, tr.capacity;