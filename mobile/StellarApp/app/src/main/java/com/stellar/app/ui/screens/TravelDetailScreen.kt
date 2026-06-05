package com.stellar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.stellar.app.data.model.MockData
import com.stellar.app.data.model.Travel
import com.stellar.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun TravelDetailScreen(
    travelId: String,
    onBack: () -> Unit,
    onBuyClick: (Travel) -> Unit
) {
    val travel = MockData.travels.find { it.id == travelId }
        ?: return

    // Telemetria muda a cada 3 segundos — simula IoT ao vivo
    var telemetry by remember { mutableStateOf(MockData.liveTelemetry) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(3000)
            // Simula variação dos sensores
            telemetry = telemetry.copy(
                speedKmh = (26_000..30_000).random(),
                temperatureC = (-80..-60).random(),
                fuelPercent = (telemetry.fuelPercent - 1).coerceAtLeast(0)
            )
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
    ) {
        // Header com gradient
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(IndigoDark.copy(alpha = 0.6f), SpaceBlack)
                    )
                )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = 48.dp, start = 24.dp, end = 24.dp, bottom = 16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White.copy(alpha = 0.1f))
                        .size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Voltar",
                        tint = TextPrimary
                    )
                }
                Column {
                    Text(
                        text = travel.company.uppercase(),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = IndigoLight,
                        letterSpacing = 2.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = travel.destination,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        lineHeight = 30.sp
                    )
                    Text(
                        text = travel.name,
                        fontSize = 14.sp,
                        color = TextSecondary
                    )
                }
            }
        }

        Column(modifier = Modifier.padding(horizontal = 24.dp)) {

            // ─── Telemetria IoT ao vivo ───────────────────────────────────
            Spacer(modifier = Modifier.height(24.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(GreenSuccess)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "TELEMETRIA AO VIVO — SENSORES IoT",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = GreenSuccess,
                    letterSpacing = 2.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Barra de progresso da viagem
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(SpaceCard)
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Terra", fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.Bold)
                    Text(
                        "${telemetry.progressPercent}% da jornada",
                        fontSize = 11.sp,
                        color = IndigoLight,
                        fontWeight = FontWeight.Bold
                    )
                    Text(travel.destination.split("(")[0].trim(), fontSize = 11.sp, color = TextSecondary, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { telemetry.progressPercent / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = IndigoPrimary,
                    trackColor = SpaceBorder
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "📍 ${telemetry.currentLocation}",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Grid de sensores 2x2
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SensorCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Speed,
                    label = "VELOCIDADE",
                    value = "${"%,d".format(telemetry.speedKmh)} km/h",
                    color = IndigoLight
                )
                SensorCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Height,
                    label = "ALTITUDE",
                    value = "${"%,d".format(telemetry.altitudeKm)} km",
                    color = IndigoLight
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SensorCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.Thermostat,
                    label = "TEMPERATURA",
                    value = "${telemetry.temperatureC}°C",
                    color = if (telemetry.temperatureC < -70) IndigoLight else OrangeWarn
                )
                SensorCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Default.LocalGasStation,
                    label = "COMBUSTÍVEL",
                    value = "${telemetry.fuelPercent}%",
                    color = when {
                        telemetry.fuelPercent > 50 -> GreenSuccess
                        telemetry.fuelPercent > 20 -> OrangeWarn
                        else -> RedAlert
                    }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // ETA
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(IndigoPrimary.copy(alpha = 0.1f))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Schedule, contentDescription = null, tint = IndigoPrimary, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("PREVISÃO DE CHEGADA", fontSize = 9.sp, color = IndigoLight, letterSpacing = 1.5.sp, fontWeight = FontWeight.Bold)
                    Text(telemetry.eta, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                }
            }

            // ─── Informações do voo ───────────────────────────────────────
            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "SOBRE A VIAGEM",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = TextSecondary,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SpaceCard),
                border = androidx.compose.foundation.BorderStroke(1.dp, SpaceBorder)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = travel.description,
                        fontSize = 14.sp,
                        color = TextSecondary,
                        lineHeight = 22.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = SpaceBorder)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        InfoChip(label = "DISTÂNCIA", value = "${travel.distanceKm} km")
                        InfoChip(label = "CAPACIDADE", value = "${travel.capacity} passag.")
                        InfoChip(label = "VAGAS", value = "${travel.spotsLeft} livres")
                    }
                }
            }

            // ─── Botão comprar ────────────────────────────────────────────
            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = { onBuyClick(travel) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                enabled = travel.spotsLeft > 0
            ) {
                Icon(Icons.Default.RocketLaunch, contentDescription = null, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (travel.spotsLeft > 0) "QUERO EMBARCAR — ${travel.price}" else "NAVE LOTADA",
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
fun SensorCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    label: String,
    value: String,
    color: Color
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SpaceCard),
        border = androidx.compose.foundation.BorderStroke(1.dp, SpaceBorder)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(label, fontSize = 9.sp, color = TextSecondary, letterSpacing = 1.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 16.sp, fontWeight = FontWeight.Black, color = color)
        }
    }
}
