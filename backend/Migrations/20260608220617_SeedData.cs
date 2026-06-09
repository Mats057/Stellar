using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StellarApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "company",
                columns: new[] { "id", "created_at", "description", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("c0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Os pioneiros das viagens espaciais modernas.", "SpaceX Interplanetária", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("c0000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Conforto e luxo para o viajante espacial exigente.", "Fronteiras Blue Origin", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("c0000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Estilo e experiência.", "Virgin Galactic Espaço Profundo", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "destination",
                columns: new[] { "id", "created_at", "description", "distance_earth", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("d0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Experimente as dunas vermelhas e o majestoso Olympus Mons.", 225000000.0, "Marte (Nova Colônia Texas)", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("d0000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Explore lagos de metano e céus laranjas em nossas cidades-domo de luxo.", 1200000000.0, "Titã (Lua de Saturno)", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("d0000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Oceanos subglaciais e vistas deslumbrantes de Júpiter.", 628300000.0, "Europa (Lua de Júpiter)", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("d0000000-0000-0000-0000-000000000004"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Uma escapada rápida! Desfrute de recreação em baixa gravidade no vizinho mais próximo da Terra.", 384400.0, "Estação Lunar Alpha", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "travel",
                columns: new[] { "id", "arrival_time", "capacity", "company_id", "created_at", "departure_time", "description", "destination_id", "name", "price", "updated_at" },
                values: new object[,]
                {
                    { new Guid("70000000-0000-0000-0000-000000000001"), new DateTime(2026, 11, 20, 14, 0, 0, 0, DateTimeKind.Unspecified), 50, new Guid("c0000000-0000-0000-0000-000000000001"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 8, 15, 8, 0, 0, 0, DateTimeKind.Unspecified), "Voo direto para Marte utilizando a recém-reformada Starship.", new Guid("d0000000-0000-0000-0000-000000000001"), "Expresso Marte Rota A", 250000m, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("70000000-0000-0000-0000-000000000002"), new DateTime(2026, 6, 13, 10, 0, 0, 0, DateTimeKind.Unspecified), 200, new Guid("c0000000-0000-0000-0000-000000000003"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 6, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), "Passe o fim de semana na Lua. Rápido, fácil e acessível.", new Guid("d0000000-0000-0000-0000-000000000004"), "Especial de Fim de Semana Lunar", 15000m, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("70000000-0000-0000-0000-000000000003"), new DateTime(2029, 5, 15, 12, 0, 0, 0, DateTimeKind.Unspecified), 20, new Guid("c0000000-0000-0000-0000-000000000002"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2027, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Um longo cruzeiro de luxo para os serenos lagos de Titã.", new Guid("d0000000-0000-0000-0000-000000000002"), "Explorador de Titã", 850000m, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "destination",
                keyColumn: "id",
                keyValue: new Guid("d0000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "travel",
                keyColumn: "id",
                keyValue: new Guid("70000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "travel",
                keyColumn: "id",
                keyValue: new Guid("70000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "travel",
                keyColumn: "id",
                keyValue: new Guid("70000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "company",
                keyColumn: "id",
                keyValue: new Guid("c0000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "company",
                keyColumn: "id",
                keyValue: new Guid("c0000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "company",
                keyColumn: "id",
                keyValue: new Guid("c0000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "destination",
                keyColumn: "id",
                keyValue: new Guid("d0000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "destination",
                keyColumn: "id",
                keyValue: new Guid("d0000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "destination",
                keyColumn: "id",
                keyValue: new Guid("d0000000-0000-0000-0000-000000000004"));
        }
    }
}
