package com.stellar.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import com.stellar.app.data.model.TicketQRData
import com.stellar.app.ui.theme.*
import org.json.JSONObject
import java.util.concurrent.Executors
@androidx.camera.core.ExperimentalGetImage
@Composable
fun QrScannerScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_GRANTED
        )
    }
    var scannedTicket by remember { mutableStateOf<TicketQRData?>(null) }
    var scanError by remember { mutableStateOf(false) }
    var isScanning by remember { mutableStateOf(true) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted -> hasCameraPermission = granted }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
    ) {
        when {
            // ─── Resultado do scan ────────────────────────────────────────
            scannedTicket != null -> {
                TicketResultScreen(
                    ticket = scannedTicket!!,
                    onScanAgain = {
                        scannedTicket = null
                        scanError = false
                        isScanning = true
                    },
                    onBack = onBack
                )
            }

            // ─── Erro de leitura ──────────────────────────────────────────
            scanError -> {
                Column(
                    modifier = Modifier.align(Alignment.Center).padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = RedAlert, modifier = Modifier.size(64.dp))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("QR Code inválido", fontSize = 20.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Este QR Code não é um ticket Stellar válido.",
                        fontSize = 14.sp, color = TextSecondary, textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = { scanError = false; isScanning = true },
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(12.dp)
                    ) { Text("Tentar novamente") }
                }
            }

            // ─── Sem permissão ────────────────────────────────────────────
            !hasCameraPermission -> {
                Column(
                    modifier = Modifier.align(Alignment.Center).padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Default.CameraAlt, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(64.dp))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Câmera necessária", fontSize = 20.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Para escanear seu ticket, precisamos de acesso à câmera.",
                        fontSize = 14.sp, color = TextSecondary, textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) },
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(12.dp)
                    ) { Text("Permitir câmera") }
                }
            }

            // ─── Camera ativa ─────────────────────────────────────────────
            else -> {
                CameraPreview(
                    isScanning = isScanning,
                    onQrCodeScanned = { rawValue ->
                        if (!isScanning) return@CameraPreview
                        isScanning = false
                        val ticket = parseQrTicket(rawValue)
                        if (ticket != null) scannedTicket = ticket
                        else scanError = true
                    }
                )

                // Overlay do scanner
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Topo
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(SpaceBlack.copy(alpha = 0.7f))
                            .padding(top = 48.dp, start = 16.dp, end = 16.dp, bottom = 24.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(onClick = onBack) {
                                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Voltar", tint = TextPrimary)
                            }
                            Text(
                                "ESCANEAR TICKET",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                letterSpacing = 2.sp
                            )
                            Spacer(modifier = Modifier.size(48.dp))
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Visor do QR
                    Box(
                        modifier = Modifier
                            .size(260.dp)
                            .clip(RoundedCornerShape(24.dp))
                            .border(2.dp, IndigoPrimary, RoundedCornerShape(24.dp))
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(SpaceBlack.copy(alpha = 0.8f))
                            .padding(horizontal = 20.dp, vertical = 10.dp)
                    ) {
                        Text(
                            "Aponte para o QR Code do seu ticket Stellar",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                    }

                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// Componente da câmera com ML Kit
@androidx.camera.core.ExperimentalGetImage
@Composable
fun CameraPreview(
    isScanning: Boolean,
    onQrCodeScanned: (String) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val executor = remember { Executors.newSingleThreadExecutor() }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { ctx ->
            val previewView = PreviewView(ctx)
            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)

            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

                val scanner = BarcodeScanning.getClient()
                val analysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()

                analysis.setAnalyzer(executor) { imageProxy ->
                    if (!isScanning) {
                        imageProxy.close()
                        return@setAnalyzer
                    }
                    val mediaImage = imageProxy.image ?: run { imageProxy.close(); return@setAnalyzer }
                    val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)

                    scanner.process(image)
                        .addOnSuccessListener { barcodes ->
                            barcodes.firstOrNull { it.format == Barcode.FORMAT_QR_CODE }
                                ?.rawValue
                                ?.let { onQrCodeScanned(it) }
                        }
                        .addOnCompleteListener { imageProxy.close() }
                }

                try {
                    cameraProvider.unbindAll()
                    cameraProvider.bindToLifecycle(
                        lifecycleOwner,
                        CameraSelector.DEFAULT_BACK_CAMERA,
                        preview,
                        analysis
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }, ContextCompat.getMainExecutor(ctx))
            previewView
        }
    )
}

// Tela de resultado após scan bem-sucedido
@Composable
fun TicketResultScreen(
    ticket: TicketQRData,
    onScanAgain: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .padding(top = 48.dp, start = 24.dp, end = 24.dp, bottom = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Voltar", tint = TextPrimary)
            }
            Text(
                "TICKET VERIFICADO",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = GreenSuccess,
                letterSpacing = 2.sp
            )
            Spacer(modifier = Modifier.size(48.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Ícone de sucesso
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(40.dp))
                .background(GreenSuccess.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = GreenSuccess, modifier = Modifier.size(44.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            "Boarding Pass",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = TextSecondary,
            letterSpacing = 3.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            ticket.destination,
            fontSize = 26.sp,
            fontWeight = FontWeight.Black,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Card do ticket
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, SpaceBorder)
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                TicketRow(label = "PASSAGEIRO", value = ticket.passenger, icon = Icons.Default.Person)
                Spacer(modifier = Modifier.height(20.dp))
                HorizontalDivider(color = SpaceBorder)
                Spacer(modifier = Modifier.height(20.dp))
                TicketRow(label = "ASSENTO", value = ticket.seat, icon = Icons.Default.AirlineSeatReclineNormal)
                Spacer(modifier = Modifier.height(20.dp))
                TicketRow(label = "PARTIDA", value = ticket.departure, icon = Icons.Default.FlightTakeoff)
                Spacer(modifier = Modifier.height(20.dp))
                TicketRow(label = "CHEGADA", value = ticket.arrival, icon = Icons.Default.FlightLand)
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        // Status badge
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(GreenSuccess.copy(alpha = 0.12f))
                .padding(horizontal = 20.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Verified, contentDescription = null, tint = GreenSuccess, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("CONFIRMADO", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = GreenSuccess, letterSpacing = 2.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedButton(
            onClick = onScanAgain,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = IndigoLight),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndigoPrimary.copy(alpha = 0.5f))
        ) {
            Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Escanear outro ticket", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
    }
}

@Composable
fun TicketRow(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(IndigoPrimary.copy(alpha = 0.12f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = IndigoPrimary, modifier = Modifier.size(18.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(label, fontSize = 9.sp, color = TextSecondary, letterSpacing = 1.5.sp, fontWeight = FontWeight.Bold)
            Text(value, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        }
    }
}

// Parseia o JSON do QR Code do site Stellar
fun parseQrTicket(raw: String): TicketQRData? {
    return try {
        val json = JSONObject(raw)
        TicketQRData(
            passenger = json.getString("passenger"),
            seat = json.getString("seat"),
            destination = json.getString("destination"),
            departure = json.getString("departure"),
            arrival = json.getString("arrival")
        )
    } catch (e: Exception) {
        null
    }
}
