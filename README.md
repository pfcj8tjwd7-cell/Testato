# Testato
Metricas# }# 📊 Dashboard de Manutenção de Sensores de Vibração

Dashboard operacional para acompanhamento de **sensores de vibração**, disponibilidade da frota e registros de **instalação, inspeção e manutenção corretiva**.

O sistema foi desenvolvido para facilitar o acompanhamento das atividades de manutenção e permitir uma visão rápida dos principais indicadores da operação.

---

## 🚀 Visão geral

O dashboard permite controlar:

- 🚜 Cadastro das frotas
- 🏷️ TAGs dos equipamentos
- ⚙️ Modelos dos equipamentos
- 📡 Quantidade de sensores por equipamento
- 🟢 Sensores online
- 🔴 Sensores offline
- 📈 Disponibilidade dos sensores
- 🔧 Instalações
- 🔍 Inspeções
- 🛠️ Manutenções corretivas
- ⏱️ Duração das atividades
- ⚠️ Desvios encontrados
- ⏱️ Tempo de parada/desvio
- 👷 Responsável pela atividade
- 📋 Histórico dos relatórios

---

# 📌 Indicadores principais

Os cards superiores apresentam os principais indicadores da operação.

| Indicador | Descrição |
|---|---|
| 🚜 Frota | Quantidade de equipamentos cadastrados |
| 📡 Sensores | Total de sensores cadastrados |
| 🟢 Online | Sensores atualmente online |
| 🔴 Offline | Sensores que precisam de atenção |
| 📈 Disponibilidade | Percentual de sensores online |
| 🔧 Manutenção | Total de atividades registradas |

### Cards interativos

Os cards são clicáveis.

Ao clicar em um indicador, o dashboard apresenta um painel detalhado abaixo mostrando a origem daquele número.

### Exemplo

Ao clicar em:

**📡 Sensores — 250**

O sistema apresenta:

| Equipamento | Frota | Sensores |
|---|---|---:|
| ES1001 | Escavadeira | 58 |
| ES1002 | Escavadeira | 55 |
| ES0903 | Escavadeira | 58 |

---

Ao clicar em:

**🔧 Manutenção — 35**

O sistema apresenta:

| Tipo | Quantidade |
|---|---:|
| Instalação | 12 |
| Inspeção | 15 |
| Corretiva | 8 |

---

# 🚜 Cadastro da Frota

As frotas principais já ficam cadastradas no sistema.

## Escavadeiras

### Modelos

- 7495HR
- PC8000
- PC2000
- XE5600

### TAGs

- ES1001
- ES1002
- ES0902
- ES0903
- ES0904
- ES0905
- ES0906
- ES0907
- ES2007
- ES2008
- ES2009
- ES2010
- ES701
- XE802

---

## Carregadeiras

### Modelos

- WE2350
- L2350

### TAGs

- CR8108
- CR8109
- CR8111
- CR8113
- CR8114
- CR8115
- CR8117
- CR8118

---

## Tratores de esteira

### Modelos

- D11
- D09
- D06

### TAGs

- TE2925
- TE2926
- TE2927
- TE2933
- TE2937
- TE2942
- TE2045
- TE2946
- TE2948
- TE2949
- TE2950
- TE2951
- TE2952
- TE2953
- TE2954
- THOOSS
- TE7056
- TE2957
- TE1099
- TE2959
- TE2961
- TE2962
- TE2963
- TE2964
- TE2967
- TE2968
- TF2969
- TE2970
- TE2971
- TE2973
- TE2974
- TE2975
- TE3215
- TE3216
- TE3217
- TE3218
- TE2210
- TE3220
- TE3221
- TE3224
- TE3225
- TE3623

---

## Mineradores

### Modelo

- T1255 III

### TAGs

- MS2401
- MS2402
- MS2403
- MS2404
- MS2501
- MS2502

---

# 📡 Controle de sensores

Cada equipamento pode possuir informações próprias.

### Cadastro

```text
Frota
↓
Modelo
↓
TAG
↓
Quantidade de sensores
↓
Sensores online
↓
Sensores offline
