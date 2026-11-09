<!-- Archivo generado por tools/generar-atlas.mjs a partir de index.html. No lo edites a mano: edita index.html y ejecuta `npm run atlas`. -->

# 15 · Catálogo A–Z

Los 53 servicios del atlas, en orden alfabético. **Papeles** son todos los que adopta en las 13 arquitecturas; **valencia** es cuántos distintos. TRACER: 🟢 TRACER lo usa hoy · 🟡 TRACER: parcial · 🔷 TRACER: arquitectura objetivo · · No está en TRACER.

| Letra | Servicios |
|---|---|
| **A** | [AI Search](#ai-search) · [AKS](#aks) · [API Management](#api-management) · [App Configuration](#app-configuration) · [App Insights / Monitor](#app-insights--monitor) · [App Service](#app-service) · [Application Gateway](#application-gateway) · [Azure Arc](#azure-arc) · [Azure DevOps](#azure-devops) · [Azure Functions](#azure-functions) · [Azure Local](#azure-local) · [Azure Machine Learning](#azure-machine-learning) · [Azure Managed Redis](#azure-managed-redis) · [Azure OpenAI (Microsoft Foundry)](#azure-openai-microsoft-foundry) · [Azure SQL](#azure-sql) |
| **B** | [Blob Storage / ADLS](#blob-storage--adls) |
| **C** | [Centro de datos local / otra nube](#centro-de-datos-local--otra-nube) · [Clientes (Portal, PowerPack, móvil)](#clientes-portal-powerpack-móvil) · [Communication Services](#communication-services) · [Container Apps](#container-apps) · [Container Registry](#container-registry) · [Cosmos DB](#cosmos-db) |
| **D** | [Dapr](#dapr) · [Data Explorer / Eventhouse](#data-explorer--eventhouse) · [Data Factory](#data-factory) · [Databricks](#databricks) · [Dispositivos / IoT Edge](#dispositivos--iot-edge) · [Durable Functions](#durable-functions) |
| **E** | [Entra ID](#entra-id) · [Event Grid](#event-grid) · [Event Grid namespaces](#event-grid-namespaces) · [Event Hubs](#event-hubs) · [ExpressRoute / VPN Gateway](#expressroute--vpn-gateway) |
| **F** | [Fabric Real-Time Intelligence](#fabric-real-time-intelligence) · [Front Door](#front-door) |
| **I** | [IoT Hub](#iot-hub) |
| **K** | [KEDA](#keda) · [Key Vault](#key-vault) |
| **L** | [Logic Apps](#logic-apps) |
| **M** | [Managed / Workload Identity](#managed--workload-identity) · [Microsoft Graph](#microsoft-graph) |
| **N** | [Notification Hubs](#notification-hubs) |
| **P** | [PostgreSQL Flexible](#postgresql-flexible) · [Power BI](#power-bi) · [Private Endpoint + DNS](#private-endpoint--dns) |
| **S** | [Service Bus](#service-bus) · [SignalR Service](#signalr-service) · [Storage Queue](#storage-queue) · [Stream Analytics](#stream-analytics) · [Synapse Analytics](#synapse-analytics) |
| **T** | [Tu servicio .NET](#tu-servicio-net) |
| **V** | [VNet + NSG](#vnet--nsg) |
| **W** | [Web PubSub](#web-pubsub) |

## Resumen

| Servicio | Familia | Papeles | Valencia | TRACER | Capítulo |
|---|---|---|:-:|:-:|---|
| [AI Search](#ai-search) | Datos | Ⓓ | 1 | · | [05](05-guarda.md) |
| [AKS](#aks) | Cómputo | Ⓒ | 1 | 🔷 | [04](04-consume.md) |
| [API Management](#api-management) | Entrada | Ⓟ Ⓑ | 2 | · | [03](03-transporta.md) |
| [App Configuration](#app-configuration) | Identidad | Ⓟ Ⓧ | 2 | · | [02](02-produce.md) |
| [App Insights / Monitor](#app-insights--monitor) | Observabilidad | Ⓟ Ⓧ | 2 | 🟢 | [02](02-produce.md) |
| [App Service](#app-service) | Cómputo | Ⓒ | 1 | 🟢 | [04](04-consume.md) |
| [Application Gateway](#application-gateway) | Entrada | Ⓑ | 1 | 🔷 | [03](03-transporta.md) |
| [Azure Arc](#azure-arc) | Híbrido | Ⓧ | 1 | · | [07](07-identidad.md) |
| [Azure DevOps](#azure-devops) | DevOps | Ⓧ | 1 | 🟢 | [09](09-observabilidad.md) |
| [Azure Functions](#azure-functions) | Cómputo | Ⓟ Ⓒ | 2 | 🟢 | [04](04-consume.md) |
| [Azure Local](#azure-local) | Híbrido | Ⓟ | 1 | · | [02](02-produce.md) |
| [Azure Machine Learning](#azure-machine-learning) | IA | Ⓒ Ⓓ | 2 | · | [04](04-consume.md) |
| [Azure Managed Redis](#azure-managed-redis) | Datos | Ⓑ Ⓓ | 2 | 🔷 | [05](05-guarda.md) |
| [Azure OpenAI (Microsoft Foundry)](#azure-openai-microsoft-foundry) | IA | Ⓒ | 1 | · | [04](04-consume.md) |
| [Azure SQL](#azure-sql) | Datos | Ⓟ Ⓓ | 2 | 🟢 | [05](05-guarda.md) |
| [Blob Storage / ADLS](#blob-storage--adls) | Datos | Ⓟ Ⓓ | 2 | 🟢 | [05](05-guarda.md) |
| [Centro de datos local / otra nube](#centro-de-datos-local--otra-nube) | Fuentes | Ⓟ | 1 | · | [02](02-produce.md) |
| [Clientes (Portal, PowerPack, móvil)](#clientes-portal-powerpack-móvil) | Fuentes | Ⓟ Ⓢ | 2 | 🟢 | [02](02-produce.md) |
| [Communication Services](#communication-services) | Fuentes | Ⓟ Ⓒ | 2 | 🟢 | [02](02-produce.md) |
| [Container Apps](#container-apps) | Cómputo | Ⓒ | 1 | · | [04](04-consume.md) |
| [Container Registry](#container-registry) | DevOps | Ⓟ Ⓧ | 2 | 🔷 | [02](02-produce.md) |
| [Cosmos DB](#cosmos-db) | Datos | Ⓟ Ⓓ | 2 | · | [05](05-guarda.md) |
| [Dapr](#dapr) | Integración | Ⓒ | 1 | · | [04](04-consume.md) |
| [Data Explorer / Eventhouse](#data-explorer--eventhouse) | Analítica | Ⓓ | 1 | · | [05](05-guarda.md) |
| [Data Factory](#data-factory) | Integración | Ⓑ | 1 | · | [03](03-transporta.md) |
| [Databricks](#databricks) | Analítica | Ⓒ | 1 | · | [04](04-consume.md) |
| [Dispositivos / IoT Edge](#dispositivos--iot-edge) | Fuentes | Ⓟ | 1 | · | [02](02-produce.md) |
| [Durable Functions](#durable-functions) | Cómputo | Ⓒ | 1 | · | [04](04-consume.md) |
| [Entra ID](#entra-id) | Identidad | Ⓧ | 1 | 🟢 | [07](07-identidad.md) |
| [Event Grid](#event-grid) | Mensajería | Ⓟ Ⓑ | 2 | 🟢 | [03](03-transporta.md) |
| [Event Grid namespaces](#event-grid-namespaces) | Mensajería | Ⓑ | 1 | · | [03](03-transporta.md) |
| [Event Hubs](#event-hubs) | Mensajería | Ⓑ | 1 | 🟡 | [03](03-transporta.md) |
| [ExpressRoute / VPN Gateway](#expressroute--vpn-gateway) | Red | Ⓑ | 1 | · | [03](03-transporta.md) |
| [Fabric Real-Time Intelligence](#fabric-real-time-intelligence) | Analítica | Ⓒ | 1 | · | [04](04-consume.md) |
| [Front Door](#front-door) | Entrada | Ⓑ | 1 | · | [03](03-transporta.md) |
| [IoT Hub](#iot-hub) | Mensajería | Ⓟ Ⓑ | 2 | · | [02](02-produce.md) |
| [KEDA](#keda) | Cómputo | Ⓒ | 1 | 🔷 | [04](04-consume.md) |
| [Key Vault](#key-vault) | Identidad | Ⓟ Ⓧ | 2 | 🟡 | [02](02-produce.md) |
| [Logic Apps](#logic-apps) | Integración | Ⓟ Ⓒ | 2 | · | [04](04-consume.md) |
| [Managed / Workload Identity](#managed--workload-identity) | Identidad | Ⓧ | 1 | 🔷 | [07](07-identidad.md) |
| [Microsoft Graph](#microsoft-graph) | Fuentes | Ⓟ | 1 | 🟢 | [02](02-produce.md) |
| [Notification Hubs](#notification-hubs) | Tiempo real | Ⓑ | 1 | · | [03](03-transporta.md) |
| [PostgreSQL Flexible](#postgresql-flexible) | Datos | Ⓓ | 1 | · | [05](05-guarda.md) |
| [Power BI](#power-bi) | Analítica | Ⓢ | 1 | · | [06](06-entrega.md) |
| [Private Endpoint + DNS](#private-endpoint--dns) | Red | Ⓧ | 1 | 🔷 | [08](08-red.md) |
| [Service Bus](#service-bus) | Mensajería | Ⓑ Ⓒ | 2 | 🔷 | [03](03-transporta.md) |
| [SignalR Service](#signalr-service) | Tiempo real | Ⓑ Ⓢ | 2 | 🟢 | [06](06-entrega.md) |
| [Storage Queue](#storage-queue) | Mensajería | Ⓑ Ⓒ | 2 | · | [03](03-transporta.md) |
| [Stream Analytics](#stream-analytics) | Analítica | Ⓒ | 1 | · | [04](04-consume.md) |
| [Synapse Analytics](#synapse-analytics) | Analítica | Ⓒ Ⓓ | 2 | · | [04](04-consume.md) |
| [Tu servicio .NET](#tu-servicio-net) | Fuentes | Ⓟ Ⓒ | 2 | 🟢 | [02](02-produce.md) |
| [VNet + NSG](#vnet--nsg) | Red | Ⓧ | 1 | 🔷 | [08](08-red.md) |
| [Web PubSub](#web-pubsub) | Tiempo real | Ⓑ Ⓢ | 2 | · | [03](03-transporta.md) |

---

### AI Search

**Datos** · Ⓓ · valencia 1 · · No está en TRACER · capítulo [05-guarda](05-guarda.md)

Índice full-text y vectorial.

| | |
|---|---|
| **Recibe de** | Proyecciones desde la base (indexers) o push. |
| **Garantías y límites** | Modelo de lectura especializado para búsqueda. |
| **Papel por arquitectura** | CQRS / ES Ⓓ · IA / MLOps Ⓓ |

> 💡 En CQRS es otro modelo de lectura más, alimentado por eventos.


### AKS

**Cómputo** · Ⓒ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [04-consume](04-consume.md)

Kubernetes administrado para microservicios en contenedores.

| | |
|---|---|
| **Recibe de** | Webhooks por ingress, workers de colas y streams, gRPC interno. |
| **Entrega o publica a** | Lo que publique tu código: Service Bus, Event Grid, Event Hubs, gRPC. |
| **Garantías y límites** | HPA, KEDA, PodDisruptionBudget, zonas de disponibilidad, Workload Identity, health probes. |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas Ⓒ · Streaming Ⓒ · Microservicios Ⓒ · CQRS / ES Ⓒ · Saga Ⓒ · Híbrida Ⓒ |

> 💡 Escalar a N pods exige estado externo: un SemaphoreSlim static solo protege un proceso.


### API Management

**Entrada** · Ⓟ Ⓑ · valencia 2 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Gateway de APIs: seguridad, cuotas, versiones y transformación.

| | |
|---|---|
| **Recibe de** | HTTP de clientes externos (REST, GraphQL, WebSocket). |
| **Entrega o publica a** | Llamadas al backend; política log-to-eventhub. |
| **Garantías y límites** | Validación JWT, rate limit, caché, productos y suscripciones. |
| **Papel por arquitectura** | Streaming Ⓟ · Microservicios Ⓑ · Serverless Ⓑ · CQRS / ES Ⓟ · IA / MLOps Ⓑ |

> 💡 Rate limit y validación de tokens en el borde, antes de tu API.


### App Configuration

**Identidad** · Ⓟ Ⓧ · valencia 2 · · No está en TRACER · capítulo [02-produce](02-produce.md)

Configuración centralizada y feature flags.

| | |
|---|---|
| **Entrega o publica a** | KeyValueModified a Event Grid para refresco push. |
| **Papel por arquitectura** | Event-driven Ⓟ · Microservicios Ⓧ |

> 💡 Feature flags por tenant sin redeploy.


### App Insights / Monitor

**Observabilidad** · Ⓟ Ⓧ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [02-produce](02-produce.md)

Logs, métricas, trazas distribuidas (OpenTelemetry) y alertas.

| | |
|---|---|
| **Recibe de** | Telemetría de todos los servicios. |
| **Entrega o publica a** | Diagnostic settings hacia Event Hubs; alertas hacia action groups (webhook, Function, Logic App). |
| **Papel por arquitectura** | Event-driven Ⓧ · Colas Ⓧ · Streaming ⓅⓍ · Microservicios Ⓧ · Serverless Ⓧ · CQRS / ES Ⓧ · Saga Ⓧ · Tiempo real Ⓧ · IoT Ⓧ · Monolito Ⓧ · Big Data Ⓧ · IA / MLOps Ⓧ · Híbrida Ⓧ |

> 💡 Propaga traceparent dentro del evento para ver el árbol Garbage → Event Grid → API → SQL.


### App Service

**Cómputo** · Ⓒ · valencia 1 · 🟢 TRACER lo usa hoy · capítulo [04-consume](04-consume.md)

PaaS para web apps y APIs; WebJobs para tareas en segundo plano.

| | |
|---|---|
| **Recibe de** | HTTP y webhooks; colas vía WebJobs SDK o BackgroundService. |
| **Entrega o publica a** | Requests salientes y publicación desde tu código. |
| **Garantías y límites** | Deployment slots, autoescalado, VNet integration, Managed Identity. |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas Ⓒ · Monolito Ⓒ · Híbrida Ⓒ |

> 💡 Escalar out funciona igual que en AKS: cualquier IMemoryCache o BackgroundService se duplica por instancia.


### Application Gateway

**Entrada** · Ⓑ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [03-transporta](03-transporta.md)

Balanceador L7 regional con WAF, dentro de la VNet; ingress de AKS.

| | |
|---|---|
| **Garantías y límites** | TLS, WAF, rutas por path, AGIC / Application Gateway for Containers. |
| **Papel por arquitectura** | Microservicios Ⓑ · Monolito Ⓑ |

> 💡 En el diseño objetivo: rutas /api y /events hacia AKS.


### Azure Arc

**Híbrido** · Ⓧ · valencia 1 · · No está en TRACER · capítulo [07-identidad](07-identidad.md)

Proyecta servidores, clústeres de Kubernetes y bases de datos de cualquier lugar como recursos de Azure Resource Manager.

| | |
|---|---|
| **Garantías y límites** | Azure Policy, RBAC, Defender for Cloud y Azure Monitor sobre recursos fuera de Azure. |
| **Papel por arquitectura** | Híbrida Ⓧ |

> 💡 Arc no mueve cargas: las hace gobernables. Es el plano de control de Azure extendido a donde estén tus máquinas.


### Azure DevOps

**DevOps** · Ⓧ · valencia 1 · 🟢 TRACER lo usa hoy · capítulo [09-observabilidad](09-observabilidad.md)

Repos, Pipelines YAML y aprobaciones por ambiente.

| | |
|---|---|
| **Papel por arquitectura** | Microservicios Ⓧ · Monolito Ⓧ |

> 💡 TRACER ya tiene dev → qa → alpha → beta → prd con aprobación manual.


### Azure Functions

**Cómputo** · Ⓟ Ⓒ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [04-consume](04-consume.md)

Cómputo por evento con triggers y bindings.

| | |
|---|---|
| **Recibe de** | Triggers: HTTP, Timer, Event Grid, Service Bus, Event Hubs, Queue, Blob, Cosmos DB change feed, SQL, Redis. |
| **Entrega o publica a** | Bindings de salida: Service Bus, Event Hubs, Event Grid, Storage, Cosmos DB, SignalR, SQL. |
| **Garantías y límites** | Flex Consumption, escalado por evento, cold start, isolated worker en .NET. |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas ⓅⒸ · Streaming Ⓒ · Serverless Ⓒ · CQRS / ES Ⓒ · Saga Ⓒ · Tiempo real Ⓒ · IoT Ⓒ · Monolito Ⓒ · Híbrida Ⓒ |

> 💡 Es productor y consumidor a la vez: consume de un trigger y produce por un binding. En TRACER: EventGridAzureFunction.


### Azure Local

**Híbrido** · Ⓟ · valencia 1 · · No está en TRACER · capítulo [02-produce](02-produce.md)

Infraestructura hiperconvergente en tu centro de datos, gestionada desde Azure (antes Azure Stack HCI).

| | |
|---|---|
| **Garantías y límites** | Máquinas virtuales y AKS en las instalaciones · puede operar desconectado. |
| **Papel por arquitectura** | Híbrida Ⓟ |

> 💡 La familia Azure Stack hoy es Azure Local y Azure Stack Hub; ambas se gobiernan con Azure Arc.


### Azure Machine Learning

**IA** · Ⓒ Ⓓ · valencia 2 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Plataforma de MLOps: entrenamiento, registro de modelos, pipelines y endpoints de inferencia.

| | |
|---|---|
| **Recibe de** | Datos versionados del lago (ADLS) y código de entrenamiento. |
| **Entrega o publica a** | Endpoints online y batch; eventos ModelRegistered y RunCompleted a Event Grid. |
| **Garantías y límites** | Clústeres con GPU · registro de modelos · MLflow · despliegue azul/verde en endpoints administrados. |
| **Papel por arquitectura** | IA / MLOps ⒸⒹ |

> 💡 MLOps es CI/CD para modelos: el registro de modelos cumple el papel que Container Registry cumple para las imágenes.


### Azure Managed Redis

**Datos** · Ⓑ Ⓓ · valencia 2 · 🔷 TRACER: arquitectura objetivo · capítulo [05-guarda](05-guarda.md)

Cache en memoria compartida entre instancias.

| | |
|---|---|
| **Recibe de** | Cache-aside, locks (SET NX PX), rate limit compartido, sesiones. |
| **Entrega o publica a** | Pub/sub efímero y Streams. |
| **Garantías y límites** | Pub/sub at-most-once · no es un broker durable. |
| **SDK .NET** | `IDistributedCache / HybridCache` |
| **Papel por arquitectura** | Colas Ⓓ · Microservicios ⒷⒹ · CQRS / ES Ⓓ · Tiempo real Ⓓ · Monolito Ⓓ |

> 💡 Reemplaza al IMemoryCache por réplica. Microsoft recomienda Azure Managed Redis para despliegues nuevos.


### Azure OpenAI (Microsoft Foundry)

**IA** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Modelos de OpenAI (GPT) como servicio gestionado de Azure, dentro de Microsoft Foundry junto a modelos de otros proveedores.

| | |
|---|---|
| **Recibe de** | Prompts de chat, embeddings y llamadas a herramientas desde tu API. |
| **Entrega o publica a** | Respuestas (también en streaming) y vectores de embeddings. |
| **Garantías y límites** | Cuotas en tokens por minuto (TPM) · despliegues estándar, globales o con capacidad aprovisionada · filtros de contenido. |
| **SDK .NET** | `Azure.AI.OpenAI` |
| **Rol RBAC** | Cognitive Services OpenAI User |
| **Papel por arquitectura** | IA / MLOps Ⓒ |

> 💡 Autentícate con Entra ID, no con API keys, y pon API Management delante como AI gateway para repartir cuotas por consumidor.


### Azure SQL

**Datos** · Ⓟ Ⓓ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [05-guarda](05-guarda.md)

SQL Server como PaaS con HA, réplicas y backups administrados.

| | |
|---|---|
| **Recibe de** | Escrituras de comandos y proyecciones de lectura. |
| **Entrega o publica a** | Tabla Outbox, Change Tracking (trigger SQL de Functions), CDC hacia Debezium o Event Hubs. |
| **Garantías y límites** | ACID local · zone redundancy · failover groups · réplica ApplicationIntent=ReadOnly. |
| **SDK .NET** | `EF Core + "Authentication=Active Directory Default"` |
| **Rol RBAC** | Usuario contenido de Entra ID |
| **Papel por arquitectura** | Event-driven Ⓓ · Colas Ⓓ · Streaming Ⓓ · Microservicios Ⓓ · Serverless ⓅⒹ · CQRS / ES Ⓓ · Saga Ⓓ · Tiempo real Ⓓ · Monolito Ⓓ · Big Data Ⓟ · Híbrida Ⓓ |

> 💡 Lock entre pods sin infraestructura extra: sp_getapplock o UPDATE … WHERE ReservedBy IS NULL y revisar rowsAffected.


### Blob Storage / ADLS

**Datos** · Ⓟ Ⓓ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [05-guarda](05-guarda.md)

Almacenamiento de objetos y data lake.

| | |
|---|---|
| **Recibe de** | Capture de Event Hubs, dead-letter de Event Grid, checkpoints, claim-check. |
| **Entrega o publica a** | Eventos BlobCreated / BlobDeleted a Event Grid. |
| **Garantías y límites** | Tiers hot/cool/archive · leases (sirven para leader election). |
| **Rol RBAC** | Storage Blob Data Contributor |
| **Papel por arquitectura** | Event-driven ⓅⒹ · Streaming Ⓓ · Microservicios Ⓓ · Serverless ⓅⒹ · Saga Ⓓ · IoT Ⓓ · Monolito Ⓓ · Big Data Ⓓ · IA / MLOps Ⓓ · Híbrida Ⓓ |

> 💡 Un lease de Blob sirve como lock de líder para un BackgroundService en N réplicas.


### Centro de datos local / otra nube

**Fuentes** · Ⓟ · valencia 1 · · No está en TRACER · capítulo [02-produce](02-produce.md)

Servidores, Kubernetes y bases de datos fuera de Azure.

| | |
|---|---|
| **Recibe de** | Políticas, extensiones y actualizaciones vía Azure Arc. |
| **Entrega o publica a** | Datos y eventos hacia Azure por ExpressRoute o VPN. |
| **Papel por arquitectura** | Big Data Ⓟ · Híbrida Ⓟ |


### Clientes (Portal, PowerPack, móvil)

**Fuentes** · Ⓟ Ⓢ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [02-produce](02-produce.md)

Navegadores, Teams y apps.

| | |
|---|---|
| **Recibe de** | Push de SignalR, Web PubSub o Notification Hubs. |
| **Entrega o publica a** | Requests HTTP y comandos. |
| **Papel por arquitectura** | Microservicios Ⓟ · Serverless Ⓟ · CQRS / ES Ⓟ · Saga Ⓟ · Tiempo real Ⓢ · Monolito Ⓟ · IA / MLOps ⓅⓈ |


### Communication Services

**Fuentes** · Ⓟ Ⓒ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [02-produce](02-produce.md)

Voz, video, SMS, chat y Call Automation.

| | |
|---|---|
| **Recibe de** | Comandos REST (answer, play, transfer) con operationContext y Repeatability-Request-ID. |
| **Entrega o publica a** | Eventos de llamada a Event Grid: IncomingCall, CallConnected, PlayCompleted, AddParticipantFailed… |
| **Papel por arquitectura** | Event-driven Ⓟ · Microservicios Ⓟ · Serverless Ⓟ · Saga ⓅⒸ · Tiempo real Ⓟ · Monolito Ⓟ |

> 💡 Repeatability-Request-ID es idempotencia del lado del proveedor.


### Container Apps

**Cómputo** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Contenedores serverless sobre Kubernetes, con KEDA y Dapr integrados.

| | |
|---|---|
| **Recibe de** | HTTP, colas y streams; escala a cero por reglas KEDA. |
| **Entrega o publica a** | Igual que AKS; además Jobs disparados por eventos. |
| **Garantías y límites** | Sin operar el clúster · revisiones y split de tráfico · Dapr y KEDA nativos. |
| **Papel por arquitectura** | Colas Ⓒ · Microservicios Ⓒ · Serverless Ⓒ · IA / MLOps Ⓒ |

> 💡 Es la respuesta al "punto medio" entre App Service y AKS.


### Container Registry

**DevOps** · Ⓟ Ⓧ · valencia 2 · 🔷 TRACER: arquitectura objetivo · capítulo [02-produce](02-produce.md)

Registro privado de imágenes.

| | |
|---|---|
| **Entrega o publica a** | ImagePushed a Event Grid. |
| **Papel por arquitectura** | Event-driven Ⓟ · Microservicios Ⓧ |

> 💡 az aks update --attach-acr: el kubelet obtiene AcrPull sin imagePullSecrets.


### Cosmos DB

**Datos** · Ⓟ Ⓓ · valencia 2 · · No está en TRACER · capítulo [05-guarda](05-guarda.md)

Base NoSQL distribuida globalmente.

| | |
|---|---|
| **Recibe de** | Escrituras a escala; event store append-only. |
| **Entrega o publica a** | Change feed ordenado por partition key → Functions, Change Feed Processor, Fabric mirroring. |
| **Garantías y límites** | 5 niveles de consistencia · ETag para concurrencia optimista · TTL · serverless · 2 MB por ítem. |
| **Papel por arquitectura** | Event-driven Ⓓ · Streaming Ⓓ · Microservicios Ⓓ · Serverless ⓅⒹ · CQRS / ES Ⓓ · Saga Ⓓ · IoT Ⓓ · Big Data Ⓟ · IA / MLOps Ⓓ |

> 💡 El change feed es un Outbox incorporado: cada escritura se vuelve un evento.


### Dapr

**Integración** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Runtime sidecar: pub/sub, state, bindings, actores y workflows con componentes intercambiables.

| | |
|---|---|
| **Recibe de** | Suscripciones declarativas. |
| **Entrega o publica a** | Publica a Service Bus, Event Hubs o Redis a través de una sola API. |
| **Garantías y límites** | Componentes en YAML · disponible en Container Apps y como extensión de AKS. |
| **Papel por arquitectura** | Microservicios Ⓒ |

> 💡 Cambias de broker sin tocar código: solo el componente.


### Data Explorer / Eventhouse

**Analítica** · Ⓓ · valencia 1 · · No está en TRACER · capítulo [05-guarda](05-guarda.md)

Base analítica de series de tiempo con KQL.

| | |
|---|---|
| **Recibe de** | Ingesta directa desde Event Hubs e IoT Hub. |
| **Garantías y límites** | Consultas sobre miles de millones de filas en segundos. |
| **Papel por arquitectura** | Streaming Ⓓ · IoT Ⓓ · Big Data Ⓓ |

> 💡 Es el mismo KQL que usas en Application Insights.


### Data Factory

**Integración** · Ⓑ · valencia 1 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

ETL/ELT gestionado: copia y orquestación de datos entre más de 90 conectores.

| | |
|---|---|
| **Recibe de** | Bases locales (vía integration runtime), SaaS, bases de Azure y archivos. |
| **Entrega o publica a** | ADLS Gen2, Synapse, SQL. |
| **Garantías y límites** | Pipelines programados o por evento (BlobCreated) · integration runtime autoalojado para datos on-premises. |
| **Papel por arquitectura** | Big Data Ⓑ |

> 💡 Mueve y orquesta; la transformación pesada se la deja a Databricks o Synapse.


### Databricks

**Analítica** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Spark para ETL y Structured Streaming.

| | |
|---|---|
| **Recibe de** | Event Hubs por protocolo Kafka. |
| **Entrega o publica a** | Delta Lake. |
| **Papel por arquitectura** | Streaming Ⓒ · Big Data Ⓒ |


### Dispositivos / IoT Edge

**Fuentes** · Ⓟ · valencia 1 · · No está en TRACER · capítulo [02-produce](02-produce.md)

Sensores, equipos y gateways de borde.

| | |
|---|---|
| **Recibe de** | Comandos C2D y twins. |
| **Entrega o publica a** | Telemetría por MQTT, AMQP o HTTPS. |
| **Papel por arquitectura** | IoT Ⓟ |


### Durable Functions

**Cómputo** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Orquestaciones con estado escritas como código (event sourcing interno).

| | |
|---|---|
| **Recibe de** | Eventos externos (WaitForExternalEvent) y resultados de actividades. |
| **Entrega o publica a** | Llama actividades, sub-orquestaciones y timers durables. |
| **Garantías y límites** | Replay determinista; estado en Storage, MSSQL o Durable Task Scheduler. |
| **Papel por arquitectura** | Serverless Ⓒ · Saga Ⓒ |

> 💡 Chaining, fan-out/fan-in, monitor, human interaction. Una saga es un orquestador con compensaciones en el catch.


### Entra ID

**Identidad** · Ⓧ · valencia 1 · 🟢 TRACER lo usa hoy · capítulo [07-identidad](07-identidad.md)

Identidad de usuarios y aplicaciones; tokens OAuth 2.0 / OIDC.

| | |
|---|---|
| **Garantías y límites** | Autentica webhooks de Event Grid, clientes de SignalR y APIs. |
| **Papel por arquitectura** | Event-driven Ⓧ · Tiempo real Ⓧ · Big Data Ⓧ · IA / MLOps Ⓧ · Híbrida Ⓧ |

> 💡 Autenticación: quién eres. Autorización (RBAC): qué puedes hacer.


### Event Grid

**Mensajería** · Ⓟ Ⓑ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [03-transporta](03-transporta.md)

Enrutador push de eventos discretos (pub/sub) con filtros por tipo y subject.

| | |
|---|---|
| **Recibe de** | Eventos de sistema de servicios Azure (Storage, ACS, Key Vault, ACR…), custom topics propios y partner topics. |
| **Entrega o publica a** | Entrega a handlers: webhook, Functions, Logic Apps, Service Bus, Storage Queue, Event Hubs, Hybrid Connections. |
| **Garantías y límites** | At-least-once · sin orden · reintentos con backoff hasta 24 h · dead-letter a Blob · 1 MB por evento · CloudEvents 1.0. |
| **SDK .NET** | `Azure.Messaging.EventGrid → EventGridPublisherClient` |
| **Rol RBAC** | EventGrid Data Sender |
| **Papel por arquitectura** | Event-driven Ⓑ · Colas Ⓟ · Microservicios Ⓑ · Serverless Ⓑ · CQRS / ES Ⓑ · Saga Ⓑ · Tiempo real Ⓟ · Monolito Ⓑ |

> 💡 Es un router, no una cola: no guarda mensajes para que los pidas. Si el consumidor necesita su propio ritmo u orden, pon Service Bus como handler.


### Event Grid namespaces

**Mensajería** · Ⓑ · valencia 1 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Broker MQTT gestionado (v3.1.1 y v5) y namespace topics con entrega pull o push.

| | |
|---|---|
| **Recibe de** | Dispositivos y apps por MQTT; publicación HTTP en CloudEvents. |
| **Entrega o publica a** | Push a Event Hubs o webhooks; pull con receive / acknowledge / release / reject. |
| **Garantías y límites** | Pull con lock y reintentos, MQTT QoS 0 y 1, topics jerárquicos, autenticación por certificado o Entra ID. |
| **Papel por arquitectura** | Tiempo real Ⓑ · IoT Ⓑ |

> 💡 La entrega pull le da semántica de cola a Event Grid: el consumidor jala a su ritmo y confirma.


### Event Hubs

**Mensajería** · Ⓑ · valencia 1 · 🟡 TRACER: parcial · capítulo [03-transporta](03-transporta.md)

Log distribuido y particionado para ingesta masiva, compatible con Kafka.

| | |
|---|---|
| **Recibe de** | Apps (SDK o Kafka), change notifications de Graph, IoT Hub, diagnostic settings de Azure Monitor, APIM. |
| **Entrega o publica a** | Lo leen consumer groups independientes (EventProcessorClient, Functions, Stream Analytics, Fabric, Databricks); Capture escribe a Blob/ADLS. |
| **Garantías y límites** | Orden por partición · retención 1–7 días Standard y hasta 90 en Premium/Dedicated · replay por offset · 1 MB por evento. |
| **SDK .NET** | `Azure.Messaging.EventHubs + .Processor` |
| **Rol RBAC** | Azure Event Hubs Data Sender / Data Receiver |
| **Papel por arquitectura** | Streaming Ⓑ · Serverless Ⓑ · IoT Ⓑ · Big Data Ⓑ |

> 💡 El broker no borra al leer: cada lector lleva su posición (checkpoint). Por eso no hay DLQ ni lock por mensaje.


### ExpressRoute / VPN Gateway

**Red** · Ⓑ · valencia 1 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Conectividad privada entre tu centro de datos y Azure: circuito dedicado (ExpressRoute) o túnel IPsec (VPN).

| | |
|---|---|
| **Garantías y límites** | ExpressRoute no viaja por Internet pública · VPN sí, cifrada · ancho de banda y latencia predecibles con ExpressRoute. |
| **Papel por arquitectura** | Híbrida Ⓑ |

> 💡 En producción híbrida: ExpressRoute como enlace principal y VPN site-to-site como respaldo.


### Fabric Real-Time Intelligence

**Analítica** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Eventstream, Eventhouse y Activator para streaming en Microsoft Fabric.

| | |
|---|---|
| **Recibe de** | Event Hubs, IoT Hub, CDC de bases, Kafka. |
| **Entrega o publica a** | Alertas y acciones con Activator. |
| **Papel por arquitectura** | Streaming Ⓒ · IoT Ⓒ · Big Data Ⓒ |


### Front Door

**Entrada** · Ⓑ · valencia 1 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Entrada global: CDN, balanceo L7 por anycast y WAF.

| | |
|---|---|
| **Garantías y límites** | Multi-región, failover, reglas de caché. |
| **Papel por arquitectura** | Microservicios Ⓑ · Monolito Ⓑ |

> 💡 Global y en el borde; Application Gateway es regional y dentro de tu VNet.


### IoT Hub

**Mensajería** · Ⓟ Ⓑ · valencia 2 · · No está en TRACER · capítulo [02-produce](02-produce.md)

Gateway bidireccional para millones de dispositivos, cada uno con identidad propia.

| | |
|---|---|
| **Recibe de** | Telemetría device-to-cloud por MQTT, AMQP o HTTPS. |
| **Entrega o publica a** | Ruteo al endpoint integrado (compatible con Event Hubs), Event Hubs, Service Bus, Blob y Cosmos DB; eventos de ciclo de vida a Event Grid. |
| **Garantías y límites** | Device twins, direct methods, mensajes cloud-to-device, X.509 por dispositivo, 256 KB por mensaje. |
| **Papel por arquitectura** | Streaming Ⓟ · IoT Ⓑ · Big Data Ⓟ |

> 💡 IoT Hub = Event Hubs + gestión de dispositivos. Sin gestión de dispositivos, basta Event Grid MQTT.


### KEDA

**Cómputo** · Ⓒ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [04-consume](04-consume.md)

Autoescalado por eventos para Kubernetes (add-on de AKS, nativo en Container Apps).

| | |
|---|---|
| **Recibe de** | Métricas de Service Bus (longitud), Event Hubs (lag), Storage Queue, Redis, Prometheus. |
| **Garantías y límites** | Escala a cero y desde cero. |
| **Papel por arquitectura** | Colas Ⓒ · Microservicios Ⓒ |

> 💡 HPA escala por CPU; KEDA escala por el trabajo pendiente. Para workers, KEDA.


### Key Vault

**Identidad** · Ⓟ Ⓧ · valencia 2 · 🟡 TRACER: parcial · capítulo [02-produce](02-produce.md)

Secretos, llaves y certificados.

| | |
|---|---|
| **Entrega o publica a** | Eventos a Event Grid: SecretNearExpiry, CertificateNewVersionCreated. |
| **Rol RBAC** | Key Vault Secrets User |
| **Papel por arquitectura** | Event-driven Ⓟ · Microservicios Ⓧ · Serverless Ⓧ · IoT Ⓧ · Monolito Ⓧ · IA / MLOps Ⓧ · Híbrida Ⓧ |

> 💡 Rotación automática: Key Vault emite el evento, una Function rota el secreto.


### Logic Apps

**Integración** · Ⓟ Ⓒ · valencia 2 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Workflows low-code con cientos de conectores.

| | |
|---|---|
| **Recibe de** | Triggers de Service Bus, Event Grid, HTTP, SaaS. |
| **Entrega o publica a** | Acciones hacia cualquier conector (SaaS, Service Bus, SQL…). |
| **Garantías y límites** | Standard (single-tenant, en VNet) o Consumption. |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas Ⓟ · Serverless Ⓒ · Saga Ⓒ |

> 💡 Buena orquestación cuando el flujo es integración entre sistemas y no lógica de dominio.


### Managed / Workload Identity

**Identidad** · Ⓧ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [07-identidad](07-identidad.md)

Identidad sin secretos para recursos y pods de AKS (federación OIDC).

| | |
|---|---|
| **Garantías y límites** | System-assigned (vive con el recurso) o user-assigned (reutilizable). |
| **SDK .NET** | `new DefaultAzureCredential()` |
| **Papel por arquitectura** | Event-driven Ⓧ · Colas Ⓧ · Streaming Ⓧ · Microservicios Ⓧ · Serverless Ⓧ · CQRS / ES Ⓧ · Saga Ⓧ · Monolito Ⓧ · Big Data Ⓧ · IA / MLOps Ⓧ |

> 💡 Hoy TRACER usa AccessKey y connection strings: 0 usos de DefaultAzureCredential.


### Microsoft Graph

**Fuentes** · Ⓟ · valencia 1 · 🟢 TRACER lo usa hoy · capítulo [02-produce](02-produce.md)

API de Microsoft 365: usuarios, presencia, Teams.

| | |
|---|---|
| **Recibe de** | Llamadas REST con throttling (429 + Retry-After). |
| **Entrega o publica a** | Change notifications a webhooks, Event Hubs o Event Grid (partner topic). |
| **Papel por arquitectura** | Streaming Ⓟ |

> 💡 Toda llamada a Graph pasa por IHttpClientFactory + AddStandardResilienceHandler.


### Notification Hubs

**Tiempo real** · Ⓑ · valencia 1 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Push móvil a escala sobre APNs, FCM y WNS.

| | |
|---|---|
| **Recibe de** | Backend con plantillas y tags por usuario o tenant. |
| **Entrega o publica a** | Notificaciones del sistema a dispositivos. |
| **Garantías y límites** | Best effort: el sistema operativo decide cuándo mostrar. |
| **Papel por arquitectura** | Tiempo real Ⓑ |

> 💡 Sirve para avisar, no para entregar datos críticos.


### PostgreSQL Flexible

**Datos** · Ⓓ · valencia 1 · · No está en TRACER · capítulo [05-guarda](05-guarda.md)

PostgreSQL administrado.

| | |
|---|---|
| **Entrega o publica a** | Logical decoding hacia Debezium/Kafka. |
| **Garantías y límites** | Réplicas de lectura, HA por zonas, pgvector. |
| **Papel por arquitectura** | Microservicios Ⓓ |

> 💡 Alternativa a Azure SQL para un servicio con base propia (database per service).


### Power BI

**Analítica** · Ⓢ · valencia 1 · · No está en TRACER · capítulo [06-entrega](06-entrega.md)

Dashboards y reportes; tiempo real desde Stream Analytics o Fabric.

| | |
|---|---|
| **Papel por arquitectura** | Streaming Ⓢ · IoT Ⓢ · Big Data Ⓢ |


### Private Endpoint + DNS

**Red** · Ⓧ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [08-red](08-red.md)

IP privada en tu VNet para un PaaS; necesita la zona privatelink.*.

| | |
|---|---|
| **Papel por arquitectura** | Colas Ⓧ · Streaming Ⓧ · Microservicios Ⓧ · Big Data Ⓧ · IA / MLOps Ⓧ |

> 💡 Falla casi siempre por DNS: sin la Private DNS Zone enlazada, el pod resuelve la IP pública.


### Service Bus

**Mensajería** · Ⓑ Ⓒ · valencia 2 · 🔷 TRACER: arquitectura objetivo · capítulo [03-transporta](03-transporta.md)

Broker empresarial: colas (punto a punto) y topics con suscripciones filtradas.

| | |
|---|---|
| **Recibe de** | Mensajes de tu API, de Event Grid (como handler), IoT Hub, Stream Analytics y Logic Apps. |
| **Entrega o publica a** | Entrega a consumidores pull (ServiceBusProcessor), Functions, Logic Apps; avisa a Event Grid cuando hay mensajes sin listener (Premium). |
| **Garantías y límites** | Peek-lock · FIFO con sessions · duplicate detection · DLQ · transacciones · mensajes programados · 256 KB Standard / 100 MB Premium. |
| **SDK .NET** | `Azure.Messaging.ServiceBus → ServiceBusSender / ServiceBusProcessor` |
| **Rol RBAC** | Azure Service Bus Data Sender / Data Receiver |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas Ⓑ · Microservicios Ⓑ · Serverless Ⓑ · CQRS / ES Ⓑ · Saga Ⓑ |

> 💡 SessionId = CallConnectionId: una sola instancia procesa en orden los eventos de esa llamada. Reemplaza al TaskQueuer en memoria.


### SignalR Service

**Tiempo real** · Ⓑ Ⓢ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [06-entrega](06-entrega.md)

Push en tiempo real (WebSockets) a navegadores y apps, gestionado.

| | |
|---|---|
| **Recibe de** | Mensajes del backend: IHubContext, REST API o binding de salida de Functions. |
| **Entrega o publica a** | Mensajes a clientes, usuarios y grupos; eventos de conexión a Event Grid; upstream a Functions en modo serverless. |
| **Garantías y límites** | At-most-once al cliente · sin persistencia · el cliente se resincroniza al reconectar. |
| **SDK .NET** | `Microsoft.Azure.SignalR` |
| **Papel por arquitectura** | Streaming Ⓢ · Serverless Ⓢ · Tiempo real Ⓑ |

> 💡 Elimina el backplane: N réplicas de la API comparten las conexiones a través del servicio. En TRACER: hub /callshub.


### Storage Queue

**Mensajería** · Ⓑ Ⓒ · valencia 2 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

Cola simple y barata dentro de una Storage Account.

| | |
|---|---|
| **Recibe de** | QueueClient de tu app, Event Grid (como handler), bindings de salida de Functions. |
| **Entrega o publica a** | La leen Functions (QueueTrigger), WebJobs, Logic Apps y workers escalados con KEDA. |
| **Garantías y límites** | 64 KB · sin orden · visibility timeout · TTL de 7 días por defecto · poison queue la crea Functions tras 5 intentos. |
| **SDK .NET** | `Azure.Storage.Queues` |
| **Rol RBAC** | Storage Queue Data Message Sender / Processor |
| **Papel por arquitectura** | Event-driven Ⓒ · Colas Ⓑ · Serverless Ⓑ · Monolito Ⓑ |

> 💡 Si necesitas DLQ real, orden, duplicados o más de 64 KB, sube a Service Bus.


### Stream Analytics

**Analítica** · Ⓒ · valencia 1 · · No está en TRACER · capítulo [04-consume](04-consume.md)

SQL sobre streams: ventanas, joins y agregados.

| | |
|---|---|
| **Recibe de** | Event Hubs, IoT Hub, Blob. |
| **Entrega o publica a** | SQL, Cosmos DB, Service Bus, Event Hubs, Functions, Power BI, Blob. |
| **Garantías y límites** | Ventanas tumbling, hopping, sliding y session. |
| **Papel por arquitectura** | Streaming Ⓒ · IoT Ⓒ |

> 💡 Consume de un broker y produce a otro: es un procesador en medio del flujo.


### Synapse Analytics

**Analítica** · Ⓒ Ⓓ · valencia 2 · · No está en TRACER · capítulo [04-consume](04-consume.md)

Data warehouse SQL y Spark sobre el lago, con pipelines integrados.

| | |
|---|---|
| **Recibe de** | ADLS Gen2, pipelines de Data Factory y streams de Event Hubs. |
| **Entrega o publica a** | Modelos analíticos para Power BI. |
| **Garantías y límites** | Pools SQL dedicados y serverless · Spark pools · integración con Power BI y Purview. |
| **Papel por arquitectura** | Big Data ⒸⒹ |

> 💡 Sigue disponible, pero para proyectos nuevos Microsoft orienta hacia Microsoft Fabric: OneLake, Data Warehouse y Spark en un solo SaaS.


### Tu servicio .NET

**Fuentes** · Ⓟ Ⓒ · valencia 2 · 🟢 TRACER lo usa hoy · capítulo [02-produce](02-produce.md)

Productor o consumidor propio; corre en App Service, AKS, Container Apps o Functions.

| | |
|---|---|
| **Recibe de** | ServiceBusProcessor, EventProcessorClient, webhook de Event Grid. |
| **Entrega o publica a** | EventGridPublisherClient, ServiceBusSender, EventHubProducerClient, IHubContext. |
| **Papel por arquitectura** | Event-driven Ⓟ · Colas Ⓟ · Streaming Ⓟ · Tiempo real Ⓒ · IA / MLOps Ⓟ |

> 💡 Que tu código sea productor no lo hace dueño del consumidor: publica hechos, no órdenes a un servicio concreto.


### VNet + NSG

**Red** · Ⓧ · valencia 1 · 🔷 TRACER: arquitectura objetivo · capítulo [08-red](08-red.md)

Red privada con subnets, NSG y Network Policies en AKS.

| | |
|---|---|
| **Papel por arquitectura** | Microservicios Ⓧ · Híbrida Ⓧ |

> 💡 Subnets separadas para AKS, Private Endpoints y App Gateway.


### Web PubSub

**Tiempo real** · Ⓑ Ⓢ · valencia 2 · · No está en TRACER · capítulo [03-transporta](03-transporta.md)

WebSockets nativos y pub/sub para cualquier cliente, sin protocolo SignalR.

| | |
|---|---|
| **Recibe de** | Backend por SDK/REST; eventos de clientes vía event handlers. |
| **Entrega o publica a** | Mensajes a conexiones, grupos y usuarios. |
| **Garantías y límites** | At-most-once · grupos · subprotocolos JSON y binarios. |
| **Papel por arquitectura** | Tiempo real Ⓑ · IoT Ⓢ |

> 💡 Úsalo cuando el cliente no es .NET/JS con SignalR (IoT ligero, juegos, otros lenguajes).


[← 14 · Caso TRACER](14-caso-tracer.md) · [Índice](../README.md) · [16 · Referencia rápida →](16-referencia-rapida-y-glosario.md)
