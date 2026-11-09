# 16 · Referencia rápida y glosario

Todo el atlas en tablas, para tener a mano en una revisión de diseño o la noche antes de una entrevista.

## Contenido

- [La frase en una tabla](#la-frase-en-una-tabla)
- [Límites que deciden diseños](#límites-que-deciden-diseños)
- [Semántica de entrega](#semántica-de-entrega)
- [Paquetes .NET por papel](#paquetes-net-por-papel)
- [Roles de datos por papel](#roles-de-datos-por-papel)
- [Zonas DNS privadas](#zonas-dns-privadas)
- [Comandos esenciales](#comandos-esenciales)
- [Patrones por papel](#patrones-por-papel)
- [Glosario](#glosario)

---

## La frase en una tabla

| | Ⓟ Produce | Ⓑ Transporta | Ⓒ Consume | Ⓓ Guarda | Ⓢ Entrega | Ⓧ Envuelve |
|---|---|---|---|---|---|---|
| **Pregunta** | ¿Quién inicia? | ¿Cómo viaja? | ¿Quién reacciona? | ¿Qué permanece? | ¿A quién llega? | ¿Quién puede, por dónde, qué pasó? |
| **Función gramatical** | Sujeto | Verbo | Objeto | Complemento de tiempo | Destinatario | Contexto |
| **"Alguien" o "algo"** | Alguien | Algo | Alguien | Algo | Algo | Todo |
| **Obligación** | `id` estable, clave de orden, un solo *commit* | Cumplir su contrato | Idempotencia, confirmar después del efecto | Consistencia y concurrencia declaradas | Tolerar pérdida | Estar en cada flecha |
| **Ley** | Del commit único | Del verbo | Del verbo | De la memoria | De la última milla | De la envoltura |
| **Más frecuente en el atlas** | Communication Services y clientes | Event Grid | Azure Functions | Azure SQL y Blob Storage | Power BI | App Insights / Monitor |
| **Capítulo** | [02](02-produce.md) | [03](03-transporta.md) | [04](04-consume.md) | [05](05-guarda.md) | [06](06-entrega.md) | [07](07-identidad.md) · [08](08-red.md) · [09](09-observabilidad.md) |

---

## Límites que deciden diseños

Cifras orientativas a noviembre de 2026; varían por *tier* y cambian con el tiempo. Verifícalas en la documentación oficial antes de citarlas en un contrato.

| Servicio | Límite | Valor | Diseño que fuerza |
|---|---|---|---|
| Event Grid | Tamaño de evento | 1 MB (se factura en bloques de 64 KB) | *Claim-check* para cuerpos grandes |
| Event Grid | Reintentos | Hasta 30 intentos o 24 h (configurable) | *Dead-letter* a Blob con alerta |
| Service Bus | Tamaño de mensaje | 256 KB Standard · 100 MB Premium | *Tier* o *claim-check* |
| Service Bus | *Lock* | 1 min por defecto, máx. 5 min | Renovación automática o trabajo más corto |
| Service Bus | `MaxDeliveryCount` | 10 por defecto | Errores permanentes directos a DLQ |
| Service Bus | Detección de duplicados | Ventana configurable, hasta 7 días | `MessageId` estable |
| Event Hubs | Tamaño de evento | 1 MB | Lotes y *claim-check* |
| Event Hubs | Retención | 1–7 días Standard · hasta 90 Premium/Dedicated | Capture a ADLS para historia larga |
| Storage Queue | Tamaño de mensaje | 64 KB | *Claim-check* o Service Bus |
| Storage Queue | TTL | 7 días por defecto (configurable, incluso sin caducidad) | Vigilar la antigüedad |
| Cosmos DB | Tamaño de ítem | 2 MB | Separar documentos grandes |
| Functions | *Poison queue* (Storage Queue) | Tras 5 intentos | Function que vigila `-poison` |
| Blob | *Lease* | 15–60 s o infinito | Renovar antes de que venza |

---

## Semántica de entrega

| Broker | Entrega | Orden | DLQ | *Replay* | "Efectivamente una vez" con… |
|---|---|---|---|---|---|
| Event Grid | *At-least-once* | No | A Blob | No | Dedupe por `source` + `id` |
| Event Grid *namespaces* (*pull*) | *At-least-once* con *ack* | No | A Blob | No | Dedupe por `id` |
| Service Bus (*peek-lock*) | *At-least-once* | FIFO por sesión | Nativa | No | `MessageId` + Inbox |
| Event Hubs | *At-least-once* con *checkpoint* | Por partición | No | Sí | Clave `partición + sequenceNumber` |
| Storage Queue | *At-least-once* | No | *Poison queue* | No | `DequeueCount` + idempotencia |
| Cosmos DB *change feed* | *At-least-once* con *leases* | Por *partition key* | No | Sí, desde el inicio | `id` + `_etag` |
| SignalR · Web PubSub · Redis pub/sub | *At-most-once* | Por conexión o canal | No | No | No aplica: relee de Ⓓ |

---

## Paquetes .NET por papel

| Papel | Paquete | Tipo principal |
|:-:|---|---|
| Ⓟ Ⓒ | `Azure.Messaging.EventGrid` | `EventGridPublisherClient`, `CloudEvent` |
| Ⓟ Ⓒ | `Azure.Messaging.ServiceBus` | `ServiceBusSender`, `ServiceBusProcessor`, `ServiceBusSessionProcessor` |
| Ⓟ | `Azure.Messaging.EventHubs` | `EventHubProducerClient` |
| Ⓒ | `Azure.Messaging.EventHubs.Processor` | `EventProcessorClient` |
| Ⓟ Ⓒ | `Azure.Storage.Queues` | `QueueClient` |
| Ⓓ | `Azure.Storage.Blobs` | `BlobClient`, `BlobLeaseClient` |
| Ⓓ | `Microsoft.Azure.Cosmos` | `Container` |
| Ⓓ | `Microsoft.EntityFrameworkCore.SqlServer` | `DbContext` (ver [EF Core Atlas](https://github.com/CristianSifuentes/EFCore)) |
| Ⓓ | `Microsoft.Extensions.Caching.Hybrid` + `Microsoft.Extensions.Caching.StackExchangeRedis` | `HybridCache` |
| Ⓢ | `Microsoft.Azure.SignalR` | `AddAzureSignalR`, `IHubContext<T>` |
| Ⓧ | `Azure.Identity` | `DefaultAzureCredential`, `ManagedIdentityCredential`, `WorkloadIdentityCredential` |
| Ⓧ | `Microsoft.Extensions.Azure` | `AddAzureClients` |
| Ⓧ | `Azure.Monitor.OpenTelemetry.AspNetCore` | `UseAzureMonitor()` |
| Ⓒ | `Microsoft.Azure.Functions.Worker.Extensions.*` | `[ServiceBusTrigger]`, `[EventGridTrigger]`, `[EventHubTrigger]`, `[CosmosDBTrigger]`, `[SqlTrigger]` |

---

## Roles de datos por papel

| Servicio | Ⓟ escribe | Ⓒ lee |
|---|---|---|
| Event Grid | EventGrid Data Sender | (la entrega la hace Event Grid; tu *webhook* valida el *token*) |
| Service Bus | Azure Service Bus Data Sender | Azure Service Bus Data Receiver |
| Event Hubs | Azure Event Hubs Data Sender | Azure Event Hubs Data Receiver (+ Storage Blob Data Contributor para *checkpoints*) |
| Storage Queue | Storage Queue Data Message Sender | Storage Queue Data Message Processor |
| Blob | Storage Blob Data Contributor | Storage Blob Data Reader |
| SignalR | SignalR App Server | — |
| Key Vault | — | Key Vault Secrets User |
| Container Registry | AcrPush (*pipeline*) | AcrPull (*kubelet*) |

---

## Zonas DNS privadas

| Servicio | Zona |
|---|---|
| Service Bus y Event Hubs | `privatelink.servicebus.windows.net` |
| Event Grid | `privatelink.eventgrid.azure.net` |
| Blob · Queue | `privatelink.blob.core.windows.net` · `privatelink.queue.core.windows.net` |
| Azure SQL | `privatelink.database.windows.net` |
| Cosmos DB (NoSQL) | `privatelink.documents.azure.com` |
| Key Vault | `privatelink.vaultcore.azure.net` |
| App Service / Functions | `privatelink.azurewebsites.net` |
| SignalR | `privatelink.service.signalr.net` |
| Container Registry | `privatelink.azurecr.io` |

---

## Comandos esenciales

```bash
# Contar mensajes activos y muertos (DLQ) de una cola
az servicebus queue show -g rg-tracer --namespace-name sb-tracer-prd -n call-commands \
  --query "countDetails.{activos:activeMessageCount, muertos:deadLetterMessageCount}"

# Suscripciones de un system topic de Event Grid y su destino
az eventgrid system-topic event-subscription list -g rg-tracer --system-topic-name acs-tracer -o table

# ¿Qué roles de datos tiene una identidad sobre un recurso?
az role assignment list --assignee <principalId> --scope <resourceId> -o table

# ¿Resuelve el nombre a una IP privada? (desde dentro de la VNet)
nslookup sb-tracer-prd.servicebus.windows.net

# ¿Está desactivada la autenticación local?
az servicebus namespace show -g rg-tracer -n sb-tracer-prd --query disableLocalAuth

# Regenerar este atlas a partir de index.html y comprobar los enlaces
npm run atlas && npm run verificar
```

---

## Patrones por papel

| Patrón | Papel | Problema que resuelve | Capítulo |
|---|:-:|---|---|
| Transactional Outbox | Ⓟ + Ⓓ | Doble *commit* | [02](02-produce.md#5-el-problema-del-doble-commit-y-el-outbox) |
| Claim-check | Ⓟ | Mensajes más grandes que el broker | [02](02-produce.md#4-las-cuatro-obligaciones-del-productor) |
| Load leveling | Ⓑ | Picos que saturan al consumidor | [03](03-transporta.md#3-push-o-pull-quién-marca-el-ritmo) |
| Competing consumers | Ⓒ | Escalar el procesamiento | [04](04-consume.md#1-cuatro-formas-de-consumir) |
| Idempotent consumer (Inbox) | Ⓒ | Entregas duplicadas | [04](04-consume.md#3-idempotencia-el-consumidor-inbox) |
| Sesiones | Ⓑ + Ⓒ | Orden por entidad sin estado local | [03](03-transporta.md#4-orden-total-por-clave-o-ninguno) |
| Saga (orquestación / coreografía) | Ⓒ | Transacciones que cruzan servicios | [11](11-trece-arquitecturas-como-frases.md#7-saga-y-workflows-distribuidos) |
| CQRS | Ⓓ | Lecturas y escrituras con formas distintas | [05](05-guarda.md#6-modelos-de-lectura-estado-derivado-y-reconstruible) |
| Semantic lock | Ⓓ | Reservar antes de confirmar | [05](05-guarda.md#7-coordinación-entre-réplicas-sin-infraestructura-extra) |
| Notificar y releer | Ⓢ | Pérdidas en la última milla | [06](06-entrega.md#3-notificar-y-releer) |
| Strangler fig | Ⓒ | Migrar del monolito sin *big bang* | [14](14-caso-tracer.md#6-hoja-de-ruta-por-papel) |

---

## Glosario

| Término | Definición |
|---|---|
| **Ⓟ Ⓑ Ⓒ Ⓓ Ⓢ Ⓧ** | Glifos de los seis papeles: produce, transporta (*broker*), consume, guarda (*data*), entrega (*screen*), envuelve (transversal) |
| **Abandon** | Devolver un mensaje de Service Bus a la cola sin procesarlo; incrementa `DeliveryCount` |
| **At-least-once** | Garantía de que el mensaje llega una o más veces; exige consumidores idempotentes |
| **At-most-once** | Garantía de que el mensaje llega cero o una vez; se acepta la pérdida |
| **Backpressure** | Mecanismo por el que un consumidor frena a quien le envía |
| **Backplane** | Canal compartido para que varias réplicas de SignalR lleguen a todos los clientes; Azure SignalR Service lo hace innecesario |
| **Checkpoint** | Posición guardada de un lector en un log (Event Hubs) |
| **Claim-check** | Guardar el cuerpo grande en Blob y enviar solo la referencia |
| **CloudEvents** | Especificación de la CNCF para describir eventos (`id`, `source`, `type`, `time`…) |
| **Competing consumers** | Varias réplicas que compiten por los mensajes de una cola |
| **Consumer group** | Vista independiente de un log de Event Hubs, con su propia posición |
| **Coreografía** | Saga sin coordinador: cada servicio reacciona a los eventos de los demás |
| **Change feed** | Flujo ordenado de los cambios de un contenedor de Cosmos DB |
| **Dead-letter (DLQ)** | Destino de los mensajes que no se pudieron procesar |
| **Dual write** | Escribir en dos sistemas sin transacción común; origen de inconsistencias |
| **Envoltura** | Propiedad que debe cumplir cada flecha: identidad, red, observabilidad |
| **Event sourcing** | Guardar el estado como la secuencia de eventos que lo produjo |
| **Fan-out** | Entregar una copia de un mensaje a varios suscriptores |
| **Frase** | Una cadena Ⓟ → Ⓑ → Ⓒ → Ⓓ → Ⓢ envuelta en Ⓧ |
| **Hecho** | Mensaje que describe algo que ya ocurrió; se nombra en pasado |
| **Idempotencia** | Propiedad de una operación cuyo efecto no cambia al repetirla |
| **Inbox** | Tabla de mensajes ya procesados que hace idempotente a un consumidor |
| **KEDA** | Autoescalador de Kubernetes por eventos y trabajo pendiente |
| **Lease** | Bloqueo temporal con caducidad (Blob, Change Feed Processor) |
| **Lock lost** | El *lock* de un mensaje venció antes de confirmarlo; otro consumidor lo recibirá |
| **Managed Identity** | Identidad de Entra ID gestionada por Azure para un recurso, sin secretos |
| **Monosémico** | Servicio que mantiene un solo papel en todas las arquitecturas del atlas |
| **Orden** | Mensaje imperativo que espera ser ejecutado; necesita retención y DLQ |
| **Orquestación** | Saga con un coordinador que decide el siguiente paso |
| **Outbox** | Tabla donde el productor escribe el mensaje en la misma transacción que el cambio |
| **Partition key** | Clave que decide la partición y, con ella, el orden |
| **Peek-lock** | Modo de recepción de Service Bus que bloquea el mensaje hasta confirmarlo |
| **Plano de control / de datos** | Administrar un recurso frente a usarlo |
| **Poison message** | Mensaje que nunca se podrá procesar |
| **Polisemia** | Propiedad de un servicio que adopta papeles distintos según la arquitectura |
| **Private Endpoint** | IP privada de tu VNet que representa a un recurso PaaS |
| **Pull / Push** | El consumidor pide los mensajes / el broker los envía |
| **Replay** | Releer mensajes ya procesados desde una posición anterior |
| **Saga** | Secuencia de transacciones locales con compensaciones |
| **Sesión** | Grupo de mensajes de Service Bus con el mismo `SessionId`, procesado en orden por un solo consumidor |
| **Strangler fig** | Migración gradual que sustituye partes de un sistema sin reescribirlo de golpe |
| **System topic** | Tema de Event Grid que publica los eventos de un recurso de Azure |
| **traceparent** | Cabecera W3C que une los tramos de una misma traza |
| **Valencia** | Número de papeles distintos que adopta un servicio en el atlas |
| **Workload Identity** | Federación entre una *ServiceAccount* de Kubernetes y una identidad de Entra ID |

---

[← 15 · Catálogo A–Z](15-catalogo-a-z.md) · [Índice](../README.md)
