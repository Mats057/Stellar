package com.stellar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.stellar.app.data.model.MockData
import com.stellar.app.data.model.Travel
import com.stellar.app.ui.theme.*

@Composable
fun HomeScreen(
    onTravelClick: (String) -> Unit,
    onScanClick: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }

    val filtered = remember(searchQuery) {
        if (searchQuery.isBlank()) MockData.travels
        else MockData.travels.filter {
            it.destination.contains(searchQuery, ignoreCase = true) ||
            it.name.contains(searchQuery, ignoreCase = true)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(SpaceDark, SpaceBlack)
                    )
                )
                .padding(top = 48.dp, start = 24.dp, end = 24.dp, bottom = 24.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "STELLAR.",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            color = IndigoPrimary,
                            letterSpacing = 4.sp
                        )
                        Text(
                            text = "Para que dimensão vamos?",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            letterSpacing = 1.sp
                        )
                    }
                    // Botão Scanner QR
                    IconButton(
                        onClick = onScanClick,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(IndigoPrimary.copy(alpha = 0.15f))
                            .size(48.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCodeScanner,
                            contentDescription = "Escanear QR Code",
                            tint = IndigoPrimary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = "A exploração\nnão tem limites.",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    color = TextPrimary,
                    lineHeight = 34.sp
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Search bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text("Buscar destino...", color = TextSecondary, fontSize = 14.sp)
                    },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null, tint = TextSecondary)
                    },
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = SpaceBorder,
                        focusedContainerColor = SpaceCard,
                        unfocusedContainerColor = SpaceCard,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    singleLine = true
                )
            }
        }

        // Lista de voos
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.RocketLaunch,
                        contentDescription = null,
                        tint = IndigoPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "DESTINOS DISPONÍVEIS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextSecondary,
                        letterSpacing = 2.sp
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            items(filtered) { travel ->
                TravelCard(travel = travel, onClick = { onTravelClick(travel.id) })
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}

@Composable
fun TravelCard(travel: Travel, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = SpaceCard),
        border = androidx.compose.foundation.BorderStroke(1.dp, SpaceBorder)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = travel.company.uppercase(),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = IndigoLight,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = travel.destination,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = travel.name,
                        fontSize = 13.sp,
                        color = TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                // Badge de vagas
                val (badgeColor, badgeText) = when {
                    travel.spotsLeft <= 3 -> Pair(RedAlert.copy(alpha = 0.15f), RedAlert)
                    travel.spotsLeft <= 10 -> Pair(OrangeWarn.copy(alpha = 0.15f), OrangeWarn)
                    else -> Pair(GreenSuccess.copy(alpha = 0.15f), GreenSuccess)
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(badgeColor)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "${travel.spotsLeft} vagas",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = badgeText
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = SpaceBorder, thickness = 1.dp)
            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                InfoChip(label = "PARTIDA", value = travel.departure)
                InfoChip(label = "CHEGADA", value = travel.arrival)
                Column(horizontalAlignment = Alignment.End) {
                    Text(text = "INVESTIMENTO", fontSize = 9.sp, color = TextSecondary, letterSpacing = 1.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(text = travel.price, fontSize = 18.sp, fontWeight = FontWeight.Black, color = IndigoPrimary)
                }
            }
        }
    }
}

@Composable
fun InfoChip(label: String, value: String) {
    Column {
        Text(text = label, fontSize = 9.sp, color = TextSecondary, letterSpacing = 1.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = value, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
    }
}
