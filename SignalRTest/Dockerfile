#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ["SignalRTest/SignalRTest.csproj", "SignalRTest/"]
RUN dotnet restore "SignalRTest/SignalRTest.csproj"
COPY . .
WORKDIR "/src/SignalRTest"
RUN dotnet build "SignalRTest.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "SignalRTest.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "SignalRTest.dll"]