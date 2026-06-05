package com.stellar.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.stellar.app.ui.screens.HomeScreen
import com.stellar.app.ui.screens.QrScannerScreen
import com.stellar.app.ui.screens.TravelDetailScreen
import com.stellar.app.ui.theme.StellarTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            StellarTheme {
                StellarNavigation()
            }
        }
    }
}

// Rotas de navegação
object Routes {
    const val HOME = "home"
    const val TRAVEL_DETAIL = "travel/{travelId}"
    const val QR_SCANNER = "qr_scanner"

    fun travelDetail(id: String) = "travel/$id"
}

@Composable
fun StellarNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        // Tela 1 — Home
        composable(Routes.HOME) {
            HomeScreen(
                onTravelClick = { travelId ->
                    navController.navigate(Routes.travelDetail(travelId))
                },
                onScanClick = {
                    navController.navigate(Routes.QR_SCANNER)
                }
            )
        }

        // Tela 2 — Detalhe do voo com IoT
        composable(
            route = Routes.TRAVEL_DETAIL,
            arguments = listOf(navArgument("travelId") { type = NavType.StringType })
        ) { backStackEntry ->
            val travelId = backStackEntry.arguments?.getString("travelId") ?: return@composable
            TravelDetailScreen(
                travelId = travelId,
                onBack = { navController.popBackStack() },
                onBuyClick = {
                    // Redireciona para o site — na versão real conectaria à API
                    navController.popBackStack()
                }
            )
        }

        // Tela 3 — Scanner QR Code
        composable(Routes.QR_SCANNER) {
            QrScannerScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
