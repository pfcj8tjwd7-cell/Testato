# Testato
Metricas# 📊 Acompanhamento de Manutenção — Sensores de Vibração

> Monitoramento da disponibilidade dos sensores de vibração instalados nas escavadeiras.

---

## 📌 Indicadores Gerais

| 🏗️ Escavadeiras | 📡 Pontos Totais | 🟢 Online | 🔴 Offline |
|:---:|:---:|:---:|:---:|
| **12** | **58** | **39** | **19** |

### 📈 Disponibilidade

| Indicador | Resultado |
|:---|---:|
| 🟢 Disponibilidade | **67,2%** |
| 🔴 Sensores Offline | **32,8%** |
| 🎯 Meta sugerida | **≥ 90%** |

---

## 📊 Distribuição dos Sensores

```mermaid
pie title Status dos Sensores
    "Online — 39" : 39
    "Offline — 19" : 19

metricas# xychart-beta
    title "Disponibilidade dos Sensores por Escavadeira"
    x-axis ["ES0901", "ES0902", "ES0903", "ES0904", "ES0905", "ES0906", "ES0907", "ES0908", "ES0909", "ES1001", "ES1002", "ES1003"]
    y-axis "Disponibilidade (%)" 0 --> 100
    bar [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
