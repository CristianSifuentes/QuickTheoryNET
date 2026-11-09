<!-- Archivo generado por tools/generar-atlas.mjs a partir de index.html. No lo edites a mano: edita index.html y ejecuta `npm run atlas`. -->

# 12 · Brokers: quién escribe, quién lee

> Un broker es el **verbo** de la frase: no produce ni consume, pero decide **cómo** viaja el significado (push o pull, orden, retención, reintentos). Este capítulo mira cada broker desde dentro: qué servicios **escriben** en él (Ⓟ en esa relación) y cuáles **leen** de él (Ⓒ en esa relación). Fíjate en cuántos nombres aparecen en ambas columnas de brokers distintos: es la polisemia en acción.

## Comparativa de contratos

| Broker | Para | Modelo | Entrega | Orden | Retención | Tamaño máx. | Dead-letter | Replay |
|---|---|---|---|---|---|---|---|---|
| **Event Grid** | Hechos discretos | Push · pub/sub | At-least-once | No garantizado | Reintentos hasta 24 h | 1 MB | Sí, a Blob | No |
| **Service Bus** | Comandos y trabajo | Pull · peek-lock · colas y topics | At-least-once (o at-most-once) | FIFO con sessions | Hasta que vence el TTL | 256 KB Std · 100 MB Premium | Sí, nativa | No (solo peek) |
| **Event Hubs** | Streams | Pull · log particionado | At-least-once con checkpoints | Por partición | 1–7 días Std · hasta 90 Premium | 1 MB | No | Sí, por offset |
| **Storage Queue** | Trabajo simple | Pull · cola simple | At-least-once | No garantizado | 7 días por defecto, configurable | 64 KB | Poison queue (Functions) | No |
| **Event Grid namespaces** | MQTT y pull | Push o pull · MQTT | At-least-once (pull con ack) | No garantizado | Hasta 7 días | 1 MB | Sí, a Blob | No |
| **IoT Hub** | Dispositivos | Bidireccional dispositivo ↔ nube | At-least-once (D2C) | Por partición | 1–7 días | 256 KB | Ruta de fallback | Sí (endpoint integrado) |
| **SignalR Service** | Push a pantallas | Push WebSocket a clientes | At-most-once | Por conexión | Ninguna | Mensajes pequeños | No | No |
| **Cosmos DB** | Cambios de datos | Pull · change feed | At-least-once con leases | Por partition key | Último estado del documento | 2 MB por ítem | No: la implementas | Sí, desde el inicio |
| **Azure SQL** | Outbox y CDC | Pull · tabla Outbox o CDC | At-least-once | Por secuencia o LSN | La que definas | Una fila | No: la implementas | Sí, mientras exista la fila |
| **Azure Managed Redis** | Avisos efímeros | Push en memoria · pub/sub o Streams | At-most-once (pub/sub) | Por canal | Ninguna (Streams sí) | Pequeño | No | Solo con Streams |

> [!TIP]
> Lee la tabla por columnas, no por filas. **Orden** y **Dead-letter** separan comandos de hechos; **Replay** separa logs de colas; **Entrega** te dice si tu consumidor debe ser idempotente (casi siempre: sí).

## Los que escriben y también leen

7 servicios aparecen como emisores de un broker y como lectores de otro (o del mismo):

| Servicio | Escribe en | Lee de |
|---|---|---|
| [Azure Functions](15-catalogo-a-z.md#azure-functions) | Service Bus, Storage Queue, SignalR Service, Cosmos DB | Event Grid, Service Bus, Event Hubs, Storage Queue, IoT Hub, SignalR Service, Cosmos DB, Azure SQL, Azure Managed Redis |
| [Tu servicio .NET](15-catalogo-a-z.md#tu-servicio-net) | Event Grid, Service Bus, Event Hubs, Storage Queue, Event Grid namespaces, SignalR Service, Cosmos DB, Azure SQL, Azure Managed Redis | Event Grid namespaces |
| [Event Grid](15-catalogo-a-z.md#event-grid) | Service Bus, Event Hubs, Storage Queue | Service Bus, IoT Hub, SignalR Service |
| [Service Bus](15-catalogo-a-z.md#service-bus) | Event Grid | Event Grid, IoT Hub, Azure SQL |
| [Logic Apps](15-catalogo-a-z.md#logic-apps) | Service Bus, Storage Queue | Event Grid, Service Bus |
| [Stream Analytics](15-catalogo-a-z.md#stream-analytics) | Service Bus, Event Hubs | Event Hubs, IoT Hub |
| [Blob Storage / ADLS](15-catalogo-a-z.md#blob-storage--adls) | Event Grid | Event Hubs, IoT Hub |

---

## 1. Event Grid · Hechos discretos

Enrutador push de eventos discretos (pub/sub) con filtros por tipo y subject.

```mermaid
flowchart LR
    I0["Communication Services<br/><small>eventos de llamada (system topic)</small>"]:::P --> BK
    I1["Blob Storage / ADLS<br/><small>BlobCreated / BlobDeleted</small>"]:::P --> BK
    I2["Key Vault<br/><small>SecretNearExpiry, certificados</small>"]:::P --> BK
    I3["Container Registry<br/><small>ImagePushed</small>"]:::P --> BK
    I4["App Configuration<br/><small>KeyValueModified</small>"]:::P --> BK
    I5["Service Bus<br/><small>mensajes sin listener (Premium)</small>"]:::P --> BK
    I6["IoT Hub<br/><small>DeviceConnected, telemetría</small>"]:::P --> BK
    I7["SignalR Service<br/><small>ClientConnected / Disconnected</small>"]:::P --> BK
    I8["Microsoft Graph<br/><small>partner topic</small>"]:::P --> BK
    I9["Tu servicio .NET<br/><small>custom topic · CloudEvents</small>"]:::P --> BK
    BK{{"Event Grid"}}:::B
    BK --> O0["Azure Functions<br/><small>EventGridTrigger</small>"]:::C
    BK --> O1["App Service<br/><small>webhook HTTPS con handshake</small>"]:::C
    BK --> O2["AKS<br/><small>webhook vía ingress</small>"]:::C
    BK --> O3["Logic Apps<br/><small>trigger de Event Grid</small>"]:::C
    BK --> O4["Service Bus<br/><small>handler: buffer con orden</small>"]:::C
    BK --> O5["Storage Queue<br/><small>handler barato</small>"]:::C
    BK --> O6["Event Hubs<br/><small>handler: hacia un stream</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Push · pub/sub |
| **Entrega** | At-least-once |
| **Orden** | No garantizado |
| **Retención** | Reintentos hasta 24 h |
| **Tamaño máx.** | 1 MB |
| **Dead-letter** | Sí, a Blob |
| **Replay** | No |
| **Garantías y límites** | At-least-once · sin orden · reintentos con backoff hasta 24 h · dead-letter a Blob · 1 MB por evento · CloudEvents 1.0. |
| **SDK .NET** | `Azure.Messaging.EventGrid → EventGridPublisherClient` |
| **Rol RBAC de datos** | EventGrid Data Sender |

- ✅ **Úsalo para:** Reaccionar a hechos discretos con fan-out y filtros: eventos de recursos Azure e integraciones serverless.
- ⛔ **Evítalo para:** Comandos que exigen orden, o un consumidor que necesita controlar su ritmo.

> [!TIP]
> Es un router, no una cola: no guarda mensajes para que los pidas. Si el consumidor necesita su propio ritmo u orden, pon Service Bus como handler.

---

## 2. Service Bus · Comandos y trabajo

Broker empresarial: colas (punto a punto) y topics con suscripciones filtradas.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>ServiceBusSender (API, webhook)</small>"]:::P --> BK
    I1["Event Grid<br/><small>handler de una suscripción</small>"]:::P --> BK
    I2["Azure Functions<br/><small>binding de salida</small>"]:::P --> BK
    I3["Logic Apps<br/><small>acción Send message</small>"]:::P --> BK
    I4["IoT Hub<br/><small>endpoint de ruteo</small>"]:::P --> BK
    I5["Stream Analytics<br/><small>salida de Stream Analytics</small>"]:::P --> BK
    I6["Dapr<br/><small>componente pub/sub</small>"]:::P --> BK
    BK{{"Service Bus"}}:::B
    BK --> O0["AKS<br/><small>ServiceBusProcessor</small>"]:::C
    BK --> O1["KEDA<br/><small>escala por longitud</small>"]:::C
    BK --> O2["Container Apps<br/><small>reglas KEDA</small>"]:::C
    BK --> O3["Azure Functions<br/><small>ServiceBusTrigger</small>"]:::C
    BK --> O4["App Service<br/><small>BackgroundService / WebJobs</small>"]:::C
    BK --> O5["Logic Apps<br/><small>trigger de mensaje</small>"]:::C
    BK --> O6["Event Grid<br/><small>avisa si no hay listener (Premium)</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Pull · peek-lock · colas y topics |
| **Entrega** | At-least-once (o at-most-once) |
| **Orden** | FIFO con sessions |
| **Retención** | Hasta que vence el TTL |
| **Tamaño máx.** | 256 KB Std · 100 MB Premium |
| **Dead-letter** | Sí, nativa |
| **Replay** | No (solo peek) |
| **Garantías y límites** | Peek-lock · FIFO con sessions · duplicate detection · DLQ · transacciones · mensajes programados · 256 KB Standard / 100 MB Premium. |
| **SDK .NET** | `Azure.Messaging.ServiceBus → ServiceBusSender / ServiceBusProcessor` |
| **Rol RBAC de datos** | Azure Service Bus Data Sender / Data Receiver |

- ✅ **Úsalo para:** Comandos que no se pueden perder: orden por entidad, transacciones, duplicados y mensajes programados.
- ⛔ **Evítalo para:** Telemetría masiva o lectores que necesitan releer la historia.

> [!TIP]
> SessionId = CallConnectionId: una sola instancia procesa en orden los eventos de esa llamada. Reemplaza al TaskQueuer en memoria.

---

## 3. Event Hubs · Streams

Log distribuido y particionado para ingesta masiva, compatible con Kafka.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>EventHubProducerClient / Kafka</small>"]:::P --> BK
    I1["Microsoft Graph<br/><small>change notifications</small>"]:::P --> BK
    I2["IoT Hub<br/><small>endpoint integrado</small>"]:::P --> BK
    I3["App Insights / Monitor<br/><small>diagnostic settings</small>"]:::P --> BK
    I4["API Management<br/><small>política log-to-eventhub</small>"]:::P --> BK
    I5["Event Grid<br/><small>handler de suscripción</small>"]:::P --> BK
    I6["Stream Analytics<br/><small>salida</small>"]:::P --> BK
    BK{{"Event Hubs"}}:::B
    BK --> O0["AKS<br/><small>EventProcessorClient</small>"]:::C
    BK --> O1["Azure Functions<br/><small>EventHubTrigger por lotes</small>"]:::C
    BK --> O2["Stream Analytics<br/><small>entrada de stream</small>"]:::C
    BK --> O3["Fabric Real-Time Intelligence<br/><small>Eventstream</small>"]:::C
    BK --> O4["Data Explorer / Eventhouse<br/><small>ingesta directa</small>"]:::C
    BK --> O5["Databricks<br/><small>Structured Streaming</small>"]:::C
    BK --> O6["Blob Storage / ADLS<br/><small>Capture (Avro/Parquet)</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Pull · log particionado |
| **Entrega** | At-least-once con checkpoints |
| **Orden** | Por partición |
| **Retención** | 1–7 días Std · hasta 90 Premium |
| **Tamaño máx.** | 1 MB |
| **Dead-letter** | No |
| **Replay** | Sí, por offset |
| **Garantías y límites** | Orden por partición · retención 1–7 días Standard y hasta 90 en Premium/Dedicated · replay por offset · 1 MB por evento. |
| **SDK .NET** | `Azure.Messaging.EventHubs + .Processor` |
| **Rol RBAC de datos** | Azure Event Hubs Data Sender / Data Receiver |

- ✅ **Úsalo para:** Ingesta de alto volumen con varios lectores independientes y replay.
- ⛔ **Evítalo para:** Trabajo por mensaje que necesita reintento individual y DLQ.

> [!TIP]
> El broker no borra al leer: cada lector lleva su posición (checkpoint). Por eso no hay DLQ ni lock por mensaje.

---

## 4. Storage Queue · Trabajo simple

Cola simple y barata dentro de una Storage Account.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>QueueClient.SendMessage</small>"]:::P --> BK
    I1["Event Grid<br/><small>handler</small>"]:::P --> BK
    I2["Azure Functions<br/><small>binding de salida</small>"]:::P --> BK
    I3["Logic Apps<br/><small>acción</small>"]:::P --> BK
    BK{{"Storage Queue"}}:::B
    BK --> O0["Azure Functions<br/><small>QueueTrigger</small>"]:::C
    BK --> O1["App Service<br/><small>WebJobs</small>"]:::C
    BK --> O2["Container Apps<br/><small>KEDA azure-queue</small>"]:::C
    BK --> O3["AKS<br/><small>KEDA azure-queue</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Pull · cola simple |
| **Entrega** | At-least-once |
| **Orden** | No garantizado |
| **Retención** | 7 días por defecto, configurable |
| **Tamaño máx.** | 64 KB |
| **Dead-letter** | Poison queue (Functions) |
| **Replay** | No |
| **Garantías y límites** | 64 KB · sin orden · visibility timeout · TTL de 7 días por defecto · poison queue la crea Functions tras 5 intentos. |
| **SDK .NET** | `Azure.Storage.Queues` |
| **Rol RBAC de datos** | Storage Queue Data Message Sender / Processor |

- ✅ **Úsalo para:** Trabajo en segundo plano barato y de alto volumen, sin orden.
- ⛔ **Evítalo para:** Mensajes grandes, orden o duplicados controlados.

> [!TIP]
> Si necesitas DLQ real, orden, duplicados o más de 64 KB, sube a Service Bus.

---

## 5. Event Grid namespaces · MQTT y pull

Broker MQTT gestionado (v3.1.1 y v5) y namespace topics con entrega pull o push.

```mermaid
flowchart LR
    I0["Dispositivos / IoT Edge<br/><small>MQTT v3.1.1 / v5</small>"]:::P --> BK
    I1["Tu servicio .NET<br/><small>publish HTTP (CloudEvents)</small>"]:::P --> BK
    BK{{"Event Grid namespaces"}}:::B
    BK --> O0["Event Hubs<br/><small>push a Event Hubs</small>"]:::C
    BK --> O1["App Service<br/><small>push a webhook</small>"]:::C
    BK --> O2["Tu servicio .NET<br/><small>pull: receive / ack / release</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Push o pull · MQTT |
| **Entrega** | At-least-once (pull con ack) |
| **Orden** | No garantizado |
| **Retención** | Hasta 7 días |
| **Tamaño máx.** | 1 MB |
| **Dead-letter** | Sí, a Blob |
| **Replay** | No |
| **Garantías y límites** | Pull con lock y reintentos, MQTT QoS 0 y 1, topics jerárquicos, autenticación por certificado o Entra ID. |

- ✅ **Úsalo para:** Broker MQTT gestionado, o eventos que el consumidor quiere jalar a su ritmo.
- ⛔ **Evítalo para:** Gestión de dispositivos (twins, firmware): eso es IoT Hub.

> [!TIP]
> La entrega pull le da semántica de cola a Event Grid: el consumidor jala a su ritmo y confirma.

---

## 6. IoT Hub · Dispositivos

Gateway bidireccional para millones de dispositivos, cada uno con identidad propia.

```mermaid
flowchart LR
    I0["Dispositivos / IoT Edge<br/><small>MQTT / AMQP / HTTPS con identidad propia</small>"]:::P --> BK
    BK{{"IoT Hub"}}:::B
    BK --> O0["Event Hubs<br/><small>endpoint integrado y custom</small>"]:::C
    BK --> O1["Service Bus<br/><small>ruta a cola o topic</small>"]:::C
    BK --> O2["Blob Storage / ADLS<br/><small>cold path</small>"]:::C
    BK --> O3["Cosmos DB<br/><small>ruta a Cosmos DB</small>"]:::C
    BK --> O4["Event Grid<br/><small>ciclo de vida</small>"]:::C
    BK --> O5["Stream Analytics<br/><small>lee el endpoint integrado</small>"]:::C
    BK --> O6["Azure Functions<br/><small>trigger del endpoint</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Bidireccional dispositivo ↔ nube |
| **Entrega** | At-least-once (D2C) |
| **Orden** | Por partición |
| **Retención** | 1–7 días |
| **Tamaño máx.** | 256 KB |
| **Dead-letter** | Ruta de fallback |
| **Replay** | Sí (endpoint integrado) |
| **Garantías y límites** | Device twins, direct methods, mensajes cloud-to-device, X.509 por dispositivo, 256 KB por mensaje. |

- ✅ **Úsalo para:** Flotas de dispositivos con identidad, twins y comandos.
- ⛔ **Evítalo para:** Cargas sin dispositivos: usa Event Hubs directamente.

> [!TIP]
> IoT Hub = Event Hubs + gestión de dispositivos. Sin gestión de dispositivos, basta Event Grid MQTT.

---

## 7. SignalR Service · Push a pantallas

Push en tiempo real (WebSockets) a navegadores y apps, gestionado.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>IHubContext / REST API</small>"]:::P --> BK
    I1["Azure Functions<br/><small>binding de salida SignalR</small>"]:::P --> BK
    BK{{"SignalR Service"}}:::B
    BK --> O0["Clientes (LandingPage, PowerPack, móvil)<br/><small>LandingPage, PowerPack, Teams</small>"]:::C
    BK --> O1["Event Grid<br/><small>eventos de conexión</small>"]:::C
    BK --> O2["Azure Functions<br/><small>upstream en modo serverless</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Push WebSocket a clientes |
| **Entrega** | At-most-once |
| **Orden** | Por conexión |
| **Retención** | Ninguna |
| **Tamaño máx.** | Mensajes pequeños |
| **Dead-letter** | No |
| **Replay** | No |
| **Garantías y límites** | At-most-once al cliente · sin persistencia · el cliente se resincroniza al reconectar. |
| **SDK .NET** | `Microsoft.Azure.SignalR` |

- ✅ **Úsalo para:** Actualizar pantallas en vivo desde N réplicas sin backplane propio.
- ⛔ **Evítalo para:** Guardar estado: el cliente debe releer al reconectar.

> [!TIP]
> Elimina el backplane: N réplicas de la API comparten las conexiones a través del servicio. En TRACER: hub /callshub.

---

## 8. Cosmos DB · Cambios de datos

Base NoSQL distribuida globalmente.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>escrituras (event store append-only)</small>"]:::P --> BK
    I1["Azure Functions<br/><small>binding de salida</small>"]:::P --> BK
    I2["IoT Hub<br/><small>ruta de telemetría</small>"]:::P --> BK
    BK{{"Cosmos DB"}}:::B
    BK --> O0["Azure Functions<br/><small>CosmosDBTrigger</small>"]:::C
    BK --> O1["AKS<br/><small>Change Feed Processor</small>"]:::C
    BK --> O2["Fabric Real-Time Intelligence<br/><small>mirroring</small>"]:::C
    BK --> O3["Databricks<br/><small>conector Spark</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Pull · change feed |
| **Entrega** | At-least-once con leases |
| **Orden** | Por partition key |
| **Retención** | Último estado del documento |
| **Tamaño máx.** | 2 MB por ítem |
| **Dead-letter** | No: la implementas |
| **Replay** | Sí, desde el inicio |
| **Garantías y límites** | 5 niveles de consistencia · ETag para concurrencia optimista · TTL · serverless · 2 MB por ítem. |

- ✅ **Úsalo para:** Proyecciones y event sourcing: cada escritura se vuelve un evento ordenado por agregado.
- ⛔ **Evítalo para:** Depender de borrados en el modo por defecto: usa borrado lógico con TTL.

> [!TIP]
> El change feed es un Outbox incorporado: cada escritura se vuelve un evento.

---

## 9. Azure SQL · Outbox y CDC

SQL Server como PaaS con HA, réplicas y backups administrados.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>INSERT en Outbox en la misma transacción</small>"]:::P --> BK
    BK{{"Azure SQL"}}:::B
    BK --> O0["AKS<br/><small>relay del Outbox (líder único)</small>"]:::C
    BK --> O1["Azure Functions<br/><small>SQL trigger (Change Tracking)</small>"]:::C
    BK --> O2["Event Hubs<br/><small>CDC con Debezium (Kafka)</small>"]:::C
    BK --> O3["Service Bus<br/><small>destino del relay</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Pull · tabla Outbox o CDC |
| **Entrega** | At-least-once |
| **Orden** | Por secuencia o LSN |
| **Retención** | La que definas |
| **Tamaño máx.** | Una fila |
| **Dead-letter** | No: la implementas |
| **Replay** | Sí, mientras exista la fila |
| **Garantías y límites** | ACID local · zone redundancy · failover groups · réplica ApplicationIntent=ReadOnly. |
| **SDK .NET** | `EF Core + "Authentication=Active Directory Default"` |
| **Rol RBAC de datos** | Usuario contenido de Entra ID |

- ✅ **Úsalo para:** Publicar de forma confiable sin dual write: un commit local y un relay.
- ⛔ **Evítalo para:** SaveChanges y luego publicar a mano: si uno falla, quedan inconsistentes.

> [!TIP]
> Lock entre pods sin infraestructura extra: sp_getapplock o UPDATE … WHERE ReservedBy IS NULL y revisar rowsAffected.

---

## 10. Azure Managed Redis · Avisos efímeros

Cache en memoria compartida entre instancias.

```mermaid
flowchart LR
    I0["Tu servicio .NET<br/><small>PUBLISH / XADD</small>"]:::P --> BK
    BK{{"Azure Managed Redis"}}:::B
    BK --> O0["AKS<br/><small>SUBSCRIBE en cada réplica</small>"]:::C
    BK --> O1["App Service<br/><small>SUBSCRIBE</small>"]:::C
    BK --> O2["Azure Functions<br/><small>trigger de Redis</small>"]:::C
    classDef P fill:#042F2E,stroke:#2DD4BF,color:#F8FAFC,stroke-width:2px
    classDef B fill:#1E1B4B,stroke:#A78BFA,color:#F8FAFC,stroke-width:2px
    classDef C fill:#3B1D0A,stroke:#FB923C,color:#F8FAFC,stroke-width:2px
    classDef D fill:#0C2744,stroke:#60A5FA,color:#F8FAFC,stroke-width:2px
    classDef S fill:#1A2E05,stroke:#A3E635,color:#F8FAFC,stroke-width:2px
    classDef X fill:#1E293B,stroke:#94A3B8,color:#F8FAFC,stroke-width:2px
```

| | |
|---|---|
| **Modelo** | Push en memoria · pub/sub o Streams |
| **Entrega** | At-most-once (pub/sub) |
| **Orden** | Por canal |
| **Retención** | Ninguna (Streams sí) |
| **Tamaño máx.** | Pequeño |
| **Dead-letter** | No |
| **Replay** | Solo con Streams |
| **Garantías y límites** | Pub/sub at-most-once · no es un broker durable. |
| **SDK .NET** | `IDistributedCache / HybridCache` |

- ✅ **Úsalo para:** Avisar a todas las réplicas: invalidar cache, refrescar configuración.
- ⛔ **Evítalo para:** Cualquier mensaje que no se pueda perder.

> [!TIP]
> Reemplaza al IMemoryCache por réplica. Microsoft recomienda Azure Managed Redis para despliegues nuevos.

---

[← 11 · Trece arquitecturas](11-trece-arquitecturas-como-frases.md) · [Índice](../README.md) · [13 · Guía de decisión →](13-guia-de-decision.md)
