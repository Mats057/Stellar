-- Listar todas as viagens disponíveis com detalhes do Destino e da Empresa
SELECT 
    t.id AS travel_id,
    t.name AS travel_name,
    t.price AS current_price,
    t.departure_time,
    d.name AS destination_name,
    d.distance_earth,
    c.name AS company_name
FROM travel t
JOIN destination d ON t.destination_id = d.id
JOIN company c ON t.company_id = c.id
WHERE t.departure_time > CURRENT_TIMESTAMP -- Apenas viagens futuras
ORDER BY t.departure_time ASC;