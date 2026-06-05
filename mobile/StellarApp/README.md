# Stellar — App Android (Mobile)

Aplicativo Android do projeto **Stellar** — plataforma de voos espaciais interplanetários.

---

## 🚀 O que o app faz

3 telas obrigatórias cobertas:

| Tela | Descrição |
|------|-----------|
| **Home** | Lista os voos disponíveis com busca. Botão de scanner no topo. |
| **Detalhe do voo** | Informações do voo + **telemetria IoT ao vivo** (velocidade, altitude, temperatura, combustível — atualiza a cada 3s) |
| **Scanner QR** | Lê o QR Code gerado no site Stellar e exibe o boarding pass |

## 🔗 Integração com o restante do projeto

O QR Code gerado no **frontend React** (site Stellar) contém um JSON com os dados do ticket:
```json
{
  "passenger": "Nome do passageiro",
  "seat": "A-241D",
  "destination": "Marte (Nova Colônia Texas)",
  "departure": "15/08/2026 ...",
  "arrival": "20/11/2026 ..."
}
```
O app lê esse QR e exibe o boarding pass completo.

---

## 📥 Como rodar (passo a passo)

### 1. Instalar o Android Studio
- Acesse: https://developer.android.com/studio
- Baixe e instale normalmente (Next > Next > Finish)

### 2. Abrir o projeto
- Abra o Android Studio
- Clique em **"Open"**
- Selecione a pasta `StellarApp` (esta pasta)
- Aguarde o Gradle sincronizar (barra de progresso no rodapé — pode demorar 3-5 min na primeira vez)

### 3. Rodar no emulador
- No topo do Android Studio, clique em **"Device Manager"** (ícone de celular)
- Crie um Virtual Device: Pixel 8, API 35
- Clique no ▶️ **Run** (botão verde de play)

### 4. Rodar no celular físico (opcional)
- Ative **Modo Desenvolvedor** no Android:
  - Configurações > Sobre o telefone > toque 7x em "Número da versão"
- Ative **Depuração USB**
- Conecte o cabo USB → aceite a permissão no celular
- Selecione seu dispositivo no Android Studio e clique ▶️ Run

---

## 📁 Estrutura dos arquivos

```
app/src/main/java/com/stellar/app/
├── MainActivity.kt              ← Ponto de entrada + navegação
├── data/model/
│   └── Models.kt                ← Dados mockados (Travel, Telemetry, etc.)
└── ui/
    ├── theme/
    │   └── Theme.kt             ← Cores do app (tema espacial)
    └── screens/
        ├── HomeScreen.kt        ← Tela 1: lista de voos
        ├── TravelDetailScreen.kt ← Tela 2: detalhe + IoT
        └── QrScannerScreen.kt   ← Tela 3: scanner + boarding pass
```

---

## 🛰️ Simulação IoT

A tela de detalhe do voo simula sensores IoT que atualizam a cada **3 segundos**:
- **Velocidade** (sensor de velocímetro da aeronave)
- **Altitude** (sensor barométrico/GPS orbital)
- **Temperatura externa** (sensor de temperatura do casco)
- **Combustível** (sensor de nível de propelente)

Em produção, esses dados viriam de uma API conectada aos sensores reais da aeronave via MQTT/WebSocket.

---

## 📦 Dependências principais

| Biblioteca | Para que serve |
|-----------|----------------|
| Jetpack Compose | UI declarativa (obrigatório pela disciplina) |
| Navigation Compose | Navegação entre telas |
| CameraX | Acesso à câmera para o scanner |
| ML Kit Barcode | Leitura do QR Code |
| Material 3 | Componentes visuais |
