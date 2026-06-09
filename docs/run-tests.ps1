# Executa os casos de teste contra a API e gera um relatorio HTML com evidencias reais.
$ErrorActionPreference = 'Stop'
$base = 'http://localhost:5009'

function Invoke-Test {
    param($method, $path, $body)
    $url = "$base$path"
    $reqJson = if ($null -ne $body) { ($body | ConvertTo-Json -Depth 6) } else { $null }
    try {
        $p = @{ Method = $method; Uri = $url; TimeoutSec = 15; ContentType = 'application/json'; UseBasicParsing = $true }
        if ($reqJson) { $p.Body = $reqJson }
        $r = Invoke-WebRequest @p
        return [pscustomobject]@{ method = $method; url = $url; reqJson = $reqJson; status = [int]$r.StatusCode; body = $r.Content }
    } catch {
        $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode.value__ } else { -1 }
        return [pscustomobject]@{ method = $method; url = $url; reqJson = $reqJson; status = $code; body = $_.ErrorDetails.Message }
    }
}
function Pretty($json) {
    if ([string]::IsNullOrWhiteSpace($json)) { return '(sem corpo)' }
    try { return ($json | ConvertFrom-Json | ConvertTo-Json -Depth 6) } catch { return $json }
}
function Enc($s) { if ($null -eq $s) { return '' }; ($s -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;') }

$email = "teste_$([guid]::NewGuid().ToString('N').Substring(0,6))@stellar.com"
$travelMarte = '70000000-0000-0000-0000-000000000001'
$travelLunar = '70000000-0000-0000-0000-000000000002'
$companySpaceX = 'c0000000-0000-0000-0000-000000000001'
$destMarte = 'd0000000-0000-0000-0000-000000000001'
$zeroId = '00000000-0000-0000-0000-000000000000'

$tests = @()
function Add-Test($id, $area, $titulo, $cenario, $entrada, $esperado, $statusEsp, $req, $pass) {
    $script:tests += [pscustomobject]@{ id = $id; area = $area; titulo = $titulo; cenario = $cenario; entrada = $entrada; esperado = $esperado; statusEsp = $statusEsp; req = $req; pass = $pass }
}

# ===================== VIAGENS =====================
$r = Invoke-Test GET '/api/travels'
$list = $r.body | ConvertFrom-Json
Add-Test 'CT-01' 'Viagens' 'Listar todas as viagens' 'O usuario abre a home; o sistema lista todas as viagens com empresa, destino e assentos vendidos.' '(nenhuma)' 'HTTP 200 com lista de viagens; cada item traz company, destination e tickets_sold.' '200' $r ($r.status -eq 200 -and $list.Count -ge 3)

$r = Invoke-Test GET '/api/travels?search=marte'
$busca = $r.body | ConvertFrom-Json
Add-Test 'CT-02' 'Viagens' 'Buscar viagens por texto' 'O usuario digita "marte" na busca; o sistema filtra por nome da viagem, empresa ou destino.' 'search=marte (query string)' 'HTTP 200 retornando apenas as viagens que casam com "marte".' '200' $r ($r.status -eq 200 -and $busca.Count -ge 1)

$r = Invoke-Test GET "/api/travels/$travelMarte"
Add-Test 'CT-03' 'Viagens' 'Detalhar uma viagem existente' 'O usuario abre os detalhes de uma viagem valida pelo seu id.' "id = $travelMarte" 'HTTP 200 com os dados completos da viagem (com company e destination).' '200' $r ($r.status -eq 200)

$r = Invoke-Test GET "/api/travels/$zeroId"
Add-Test 'CT-04' 'Viagens' 'Detalhar viagem inexistente' 'O usuario tenta acessar um id que nao existe; o sistema deve tratar sem quebrar.' "id = $zeroId" 'HTTP 404 (Not Found), sem corpo de erro de servidor.' '404' $r ($r.status -eq 404)

$novaViagem = @{ name = 'Voo Teste Europa'; price = 99000.50; capacity = 10; company_id = $companySpaceX; destination_id = $destMarte; description = 'Viagem criada no teste automatizado'; departure_time = '2027-03-01T08:00:00'; arrival_time = '2027-06-01T08:00:00' }
$r = Invoke-Test POST '/api/travels' $novaViagem
$nova = $r.body | ConvertFrom-Json
Add-Test 'CT-05' 'Viagens' 'Criar uma nova viagem (POST)' 'Um operador cadastra uma nova viagem valida.' 'JSON com name, price, capacity, company_id, destination_id e datas.' 'HTTP 201 (Created) com a viagem criada e um id gerado.' '201' $r ($r.status -eq 201 -and $null -ne $nova.id)
$novaId = $nova.id

$r = Invoke-Test POST '/api/travels' @{ price = 100; capacity = 0; company_id = $companySpaceX; destination_id = $destMarte }
Add-Test 'CT-06' 'Viagens' 'Rejeitar viagem invalida (validacao)' 'Tentativa de criar viagem sem nome e com capacity 0 deve ser barrada pela validacao.' 'JSON sem name e com capacity = 0' 'HTTP 400 (Bad Request) com os erros de validacao; nada gravado.' '400' $r ($r.status -eq 400)

$r = Invoke-Test PUT "/api/travels/$novaId" @{ price = 88000 }
$upd = $r.body | ConvertFrom-Json
Add-Test 'CT-07' 'Viagens' 'Atualizar uma viagem (PUT)' 'O operador altera apenas o preco da viagem; os demais campos permanecem.' "id = (viagem do CT-05); body { price: 88000 }" 'HTTP 200 com a viagem atualizada (price = 88000).' '200' $r ($r.status -eq 200 -and [decimal]$upd.price -eq 88000)

$r = Invoke-Test DELETE "/api/travels/$novaId"
Add-Test 'CT-08' 'Viagens' 'Excluir uma viagem (DELETE)' 'O operador remove a viagem de teste (que nao possui tickets).' "id = (viagem do CT-05)" 'HTTP 204 (No Content); a viagem deixa de existir.' '204' $r ($r.status -eq 204)

# ===================== SEGURANCA =====================
$r = Invoke-Test POST '/api/auth/register' @{ name = 'Comandante Ada'; email = $email; password = 'senha123' }
$user = $r.body | ConvertFrom-Json
Add-Test 'CT-09' 'Seguranca' 'Cadastrar usuario (senha com hash)' 'Novo usuario se cadastra; a senha e salva como hash BCrypt e nao volta na resposta.' 'name, email, password' 'HTTP 200 com id, name e email; SEM o campo password.' '200' $r ($r.status -eq 200 -and $null -ne $user.id -and ($user.PSObject.Properties.Name -notcontains 'password'))

$r = Invoke-Test POST '/api/auth/register' @{ name = 'Outro'; email = $email; password = 'senha123' }
Add-Test 'CT-10' 'Seguranca' 'Bloquear e-mail duplicado' 'Tentativa de cadastrar um e-mail que ja existe deve ser rejeitada.' 'email ja cadastrado no CT-09' 'HTTP 409 (Conflict) com mensagem de e-mail ja cadastrado.' '409' $r ($r.status -eq 409)

$r = Invoke-Test POST '/api/auth/register' @{ name = 'Curto'; email = "c_$email"; password = '123' }
Add-Test 'CT-11' 'Seguranca' 'Rejeitar senha curta (validacao)' 'Cadastro com senha de menos de 6 caracteres deve falhar na validacao.' 'password = "123"' 'HTTP 400 (Bad Request) com erro de validacao na senha.' '400' $r ($r.status -eq 400)

$r = Invoke-Test POST '/api/auth/login' @{ email = $email; password = 'senha123' }
$logado = $r.body | ConvertFrom-Json
Add-Test 'CT-12' 'Seguranca' 'Login com credenciais corretas' 'Usuario faz login com a senha certa; o hash e verificado com sucesso.' 'email + senha corretos' 'HTTP 200 com id, name e email do usuario.' '200' $r ($r.status -eq 200 -and $null -ne $logado.id)

$r = Invoke-Test POST '/api/auth/login' @{ email = $email; password = 'SENHA_ERRADA' }
Add-Test 'CT-13' 'Seguranca' 'Bloquear login com senha errada' 'Login com senha incorreta deve ser negado.' 'email valido + senha incorreta' 'HTTP 401 (Unauthorized); acesso negado.' '401' $r ($r.status -eq 401)

# ===================== TICKETS =====================
$r = Invoke-Test POST '/api/tickets' @{ user_id = $user.id; travel_id = $travelLunar }
$tk = $r.body | ConvertFrom-Json
Add-Test 'CT-14' 'Tickets' 'Comprar passagem (regra de negocio)' 'Usuario compra passagem; o sistema checa capacidade, define o preco no servidor e marca CONFIRMED.' 'user_id + travel_id' 'HTTP 201 com ticket CONFIRMED e price_paid = 15000 (preco do servidor).' '201' $r ($r.status -eq 201 -and $tk.status -eq 'CONFIRMED' -and [decimal]$tk.price_paid -eq 15000)

$r = Invoke-Test GET "/api/users/$($user.id)/tickets"
$hist = $r.body | ConvertFrom-Json
Add-Test 'CT-15' 'Tickets' 'Historico de tickets do usuario' 'O usuario abre "Meus Tickets"; o sistema lista suas compras com a viagem aninhada.' "userId = (usuario do CT-09)" 'HTTP 200 com a lista de tickets; cada um traz travel com destination e company.' '200' $r ($r.status -eq 200 -and $hist.Count -ge 1 -and $null -ne $hist[0].travel.destination.name)

# ===================== RESUMO (terminal) =====================
foreach ($t in $tests) { Write-Output ("{0}|{1}|{2}" -f $t.id, $t.req.status, $(if ($t.pass) { 'PASS' } else { 'FAIL' })) }
$passN = ($tests | Where-Object pass).Count
Write-Output ("TOTAL|{0}/{1}" -f $passN, $tests.Count)

# ===================== HTML =====================
$dataHora = Get-Date -Format 'dd/MM/yyyy HH:mm:ss'
$cards = foreach ($t in $tests) {
    $cor = if ($t.pass) { '#16a34a' } else { '#dc2626' }
    $res = if ($t.pass) { 'PASSOU' } else { 'FALHOU' }
    $reqBody = if ($t.req.reqJson) { "<pre>$(Enc $t.req.reqJson)</pre>" } else { '<em>(sem corpo de requisicao)</em>' }
@"
  <section class="card">
    <h2><span class="tcid">$($t.id)</span> $(Enc $t.titulo) <span class="area">$($t.area)</span> <span class="badge" style="background:$cor">$res</span></h2>
    <table>
      <tr><th>Cenario</th><td>$(Enc $t.cenario)</td></tr>
      <tr><th>Requisicao</th><td><code>$($t.req.method) $($t.req.url)</code></td></tr>
      <tr><th>Entrada</th><td>$reqBody</td></tr>
      <tr><th>Saida esperada</th><td>$(Enc $t.esperado)</td></tr>
      <tr><th>Status esperado</th><td><code>$($t.statusEsp)</code></td></tr>
      <tr><th>Status obtido</th><td><strong style="color:$cor;font-size:16px">$($t.req.status)</strong></td></tr>
      <tr><th>Resposta obtida</th><td><pre>$(Enc (Pretty $t.req.body))</pre></td></tr>
    </table>
  </section>
"@
}
$html = @"
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Relatorio de Testes - Stellar API</title>
<style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#1e293b;margin:0;padding:32px}
  .wrap{max-width:920px;margin:0 auto}
  .head{background:linear-gradient(135deg,#4f46e5,#2563eb);color:#fff;padding:28px 32px;border-radius:18px;margin-bottom:20px}
  .head h1{margin:0 0 6px;font-size:26px}
  .head p{margin:2px 0;opacity:.9;font-size:14px}
  .summary{background:#fff;border-radius:14px;padding:16px 24px;margin-bottom:20px;font-weight:700;font-size:16px;box-shadow:0 4px 14px rgba(0,0,0,.15)}
  .card{background:#fff;border-radius:14px;padding:18px 24px;margin-bottom:18px;box-shadow:0 4px 14px rgba(0,0,0,.15)}
  .card h2{font-size:17px;margin:0 0 12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .tcid{background:#4f46e5;color:#fff;padding:3px 10px;border-radius:8px;font-size:13px}
  .area{background:#e0e7ff;color:#3730a3;padding:2px 9px;border-radius:8px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
  .badge{color:#fff;padding:3px 12px;border-radius:999px;font-size:12px;margin-left:auto}
  table{width:100%;border-collapse:collapse}
  th,td{text-align:left;vertical-align:top;padding:7px 10px;border-bottom:1px solid #eef2f7;font-size:14px}
  th{width:140px;color:#475569;font-weight:600}
  pre{background:#0f172a;color:#a5f3fc;padding:12px;border-radius:8px;overflow-x:auto;font-size:12.5px;margin:0;white-space:pre-wrap;word-break:break-word}
  code{background:#f1f5f9;padding:2px 6px;border-radius:6px;font-size:13px}
</style></head><body><div class="wrap">
  <div class="head">
    <h1>Relatorio de Testes &mdash; Stellar API</h1>
    <p>Projeto Stellar (Global Solution 2026/1) &middot; Backend C# / ASP.NET Core + EF Core + PostgreSQL</p>
    <p>Executado em: $dataHora &middot; Ambiente: http://localhost:5009</p>
  </div>
  <div class="summary">Resultado: $passN de $($tests.Count) casos PASSARAM.</div>
  $($cards -join "`n")
</div></body></html>
"@
$outDocs = Join-Path $PSScriptRoot 'relatorio-testes.html'
Set-Content -Path $outDocs -Value $html -Encoding utf8
Write-Output "HTML gerado em: $outDocs"
