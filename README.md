<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Client - Gateway

## Dev
1. Clonar repositorio
2. Instalar dependencias
3. crear archivo `.rnv` basado en el `.env.template`.

4. Ejecutar `pnpm run start:dev`

## NATS

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```