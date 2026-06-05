package com.stellar.app.data.model

// Dados que vêm do QR Code do site
data class TicketQRData(
    val passenger: String,
    val seat: String,
    val destination: String,
    val departure: String,
    val arrival: String
)

// Viagem espacial mockada para a tela Home
data class Travel(
    val id: String,
    val name: String,
    val destination: String,
    val company: String,
    val price: String,
    val departure: String,
    val arrival: String,
    val distanceKm: String,
    val capacity: Int,
    val spotsLeft: Int,
    val description: String
)

// Dados de telemetria IoT mockados (para a tela de voo ao vivo)
data class FlightTelemetry(
    val speedKmh: Int,
    val altitudeKm: Long,
    val temperatureC: Int,
    val fuelPercent: Int,
    val progressPercent: Int,
    val currentLocation: String,
    val eta: String
)

// Mock data — dados fictícios do projeto
object MockData {

    val travels = listOf(
        Travel(
            id = "1",
            name = "Expresso Marte Rota A",
            destination = "Marte (Nova Colônia Texas)",
            company = "SpaceX Interplanetária",
            price = "\$250.000",
            departure = "15/08/2026",
            arrival = "20/11/2026",
            distanceKm = "225.000.000",
            capacity = 100,
            spotsLeft = 12,
            description = "A primeira rota comercial para Marte. Experimente a viagem mais icônica da história humana, com suporte de vida de última geração e vista garantida do pôr do sol marciano."
        ),
        Travel(
            id = "2",
            name = "Lua Express — Turismo Orbital",
            destination = "Lua (Base Artemis)",
            company = "NASA Commercial",
            price = "\$85.000",
            departure = "10/07/2026",
            arrival = "14/07/2026",
            distanceKm = "384.400",
            capacity = 50,
            spotsLeft = 3,
            description = "Quatro dias na Base Artemis. Caminhada lunar incluída no pacote premium. A experiência de baixa gravidade que vai mudar sua perspectiva para sempre."
        ),
        Travel(
            id = "3",
            name = "Órbita ISS — Fin de Semana",
            destination = "Estação Espacial Internacional",
            company = "Axiom Space",
            price = "\$55.000",
            departure = "05/09/2026",
            arrival = "08/09/2026",
            distanceKm = "408",
            capacity = 8,
            spotsLeft = 2,
            description = "Três dias na ISS com astronautas profissionais. Inclui treinamento de 2 dias em Houston antes da missão. Vista da Terra a cada 90 minutos."
        ),
        Travel(
            id = "4",
            name = "Titã Explorer",
            destination = "Titã (Lua de Saturno)",
            company = "Blue Origin Deep Space",
            price = "\$1.200.000",
            departure = "20/03/2027",
            arrival = "10/09/2027",
            distanceKm = "1.430.000.000",
            capacity = 20,
            spotsLeft = 8,
            description = "A viagem mais ambiciosa já oferecida ao público. Explore a lua com lagos de metano e uma atmosfera densa. Para os verdadeiros pioneiros."
        )
    )

    // Telemetria de um voo em andamento (mockada)
    val liveTelemetry = FlightTelemetry(
        speedKmh = 28_000,
        altitudeKm = 98_400_000,
        temperatureC = -73,
        fuelPercent = 67,
        progressPercent = 44,
        currentLocation = "Entre Terra e Marte — Cinturão de Asteroides",
        eta = "47 dias, 3h 22min"
    )
}
