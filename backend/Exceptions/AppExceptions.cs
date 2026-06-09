using Microsoft.AspNetCore.Diagnostics;

namespace StellarApi.Exceptions;

// Exceções de negócio: cada uma carrega o status HTTP que deve virar.
// Assim os Services só "lançam" o erro e não precisam conhecer HTTP.
public class AppException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}

public class NotFoundException(string message) : AppException(404, message);     // não encontrado
public class ConflictException(string message) : AppException(409, message);     // conflito (ex.: e-mail repetido)
public class BusinessException(string message) : AppException(400, message);     // regra de negócio violada

// "Middleware" central de erros: captura qualquer AppException lançada em qualquer
// camada e transforma na resposta HTTP certa, sem poluir os Controllers com try/catch.
public class AppExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        if (exception is not AppException appEx)
            return false; // não é erro nosso de negócio -> deixa o pipeline tratar como 500

        context.Response.StatusCode = appEx.StatusCode;
        await context.Response.WriteAsJsonAsync(new { message = appEx.Message }, ct);
        return true;
    }
}
