-- Histórico de compras/tickets de um usuário específico
SELECT 
    t.id AS ticket_id,
    t.status AS ticket_status,
    t.price_paid AS amount_paid,
    tr.name AS travel_name,
    tr.departure_time,
    d.name AS destination_name
FROM ticket t
JOIN travel tr ON t.travel_id = tr.id
JOIN destination d ON tr.destination_id = d.id
WHERE t.user_id = 'ID_DO_USUARIO'
ORDER BY tr.departure_time DESC;