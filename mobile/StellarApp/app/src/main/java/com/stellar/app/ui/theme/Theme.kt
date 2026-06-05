package com.stellar.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val SpaceBlack = Color(0xFF0A0E1A)
val SpaceDark = Color(0xFF111827)
val SpaceCard = Color(0xFF1A2235)
val SpaceBorder = Color(0xFF2D3748)
val IndigoLight = Color(0xFF818CF8)
val IndigoPrimary = Color(0xFF6366F1)
val IndigoDark = Color(0xFF4F46E5)
val TextPrimary = Color(0xFFF1F5F9)
val TextSecondary = Color(0xFF94A3B8)
val GreenSuccess = Color(0xFF34D399)
val RedAlert = Color(0xFFF87171)
val OrangeWarn = Color(0xFFFBBF24)

private val StellarColorScheme = darkColorScheme(
    primary = IndigoPrimary,
    onPrimary = Color.White,
    secondary = IndigoLight,
    background = SpaceBlack,
    surface = SpaceCard,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    outline = SpaceBorder
)

@Composable
fun StellarTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = StellarColorScheme,
        content = content
    )
}
