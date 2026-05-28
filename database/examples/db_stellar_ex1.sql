-- Buscar passageiros (pessoas) por ID de uma viagem específica
SELECT 
    u.id AS user_id,
    u.name AS passenger_name,
    u.email AS passenger_email,
    t.status AS ticket_status,
    t.price_paid
FROM ticket t
JOIN "user" u ON t.user_id = u.id
WHERE t.travel_id = 'COLOQUE_O_UUID_DA_VIAGEM_AQUI'
ORDER BY u.name ASC;