import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Gauge,
  HardHat,
  Moon,
  Pencil,
  Plus,
  Save,
  Settings,
  Sun,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Manutenção de Sensores de Vibração" },
      {
        name: "description",
        content:
          "Dashboard operacional para acompanhamento de sensores de vibração, disponibilidade e manutenção da frota.",
      },
      {
        property: "og:title",
        content: "Dashboard | Manutenção de Sensores de Vibração",
      },
      {
        property: "og:description",
        content:
          "Acompanhamento de disponibilidade, sensores e atividades de manutenção da frota de escavadeiras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

/* =========================================================
   TIPOS
========================================================= */

type Maquina = {
  id: number;
  nome: string;
  sensores: number;
  online: number;
  offline: number;
};

type Manutencao = {
  instalacao: number;
  corretiva: number;
  inspecao: number;
};

/* =========================================================
   DADOS INICIAIS
========================================================= */

const maquinasIniciais: Maquina[] = [
  { id: 1, nome: "ES 0904", sensores: 58, online: 39, offline: 19 },
  { id: 2, nome: "ES 0907", sensores: 55, online: 42, offline: 13 },
  { id: 3, nome: "ES 1002", sensores: 52, online: 40, offline: 12 },
  { id: 4, nome: "ES 0902", sensores: 50, online: 38, offline: 12 },
  { id: 5, nome: "ES 1001", sensores: 47, online: 35, offline: 12 },
  { id: 6, nome: "ES 0901", sensores: 44, online: 32, offline: 12 },
  { id: 7, nome: "ES 0905", sensores: 40, online: 29, offline: 11 },
  { id: 8, nome: "ES 0903", sensores: 39, online: 28, offline: 11 },
];

const manutencaoInicial: Manutencao = {
  instalacao: 0,
  corretiva: 0,
  inspecao: 0,
};

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_MAQUINAS = "dashboard-maquinas-v3";
const STORAGE_MANUTENCAO = "dashboard-manutencao-v3";
const STORAGE_TEMA = "dashboard-tema-v3";

/* =========================================================
   TOOLTIP
========================================================= */

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string; name?: string }>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover p-3 text-sm shadow-md">
      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   KPI
========================================================= */

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  accent?: "default" | "positive" | "negative" | "warning";
}) {
  const colors = {
    default: "text-foreground",
    positive: "text-[var(--chart-2)]",
    negative: "text-destructive",
    warning: "text-[var(--chart-5)]",
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold tracking-tight ${colors[accent]}`}>
              {value}
            </p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [hidratado, setHidratado] = useState(false);
  const [maquinas, setMaquinas] = useState<Maquina[]>(maquinasIniciais);
  const [manutencao, setManutencao] = useState<Manutencao>(manutencaoInicial);
  const [tema, setTema] = useState<"light" | "dark">("dark");

  const [editando, setEditando] = useState<number | null>(null);

  const [novaMaquina, setNovaMaquina] = useState({
    nome: "",
    sensores: "",
    online: "",
    offline: "",
  });

  /* ======================= CARREGAR ======================= */

  useEffect(() => {
    try {
      const m = localStorage.getItem(STORAGE_MAQUINAS);
      if (m) setMaquinas(JSON.parse(m));

      const mt = localStorage.getItem(STORAGE_MANUTENCAO);
      if (mt) setManutencao(JSON.parse(mt));

      const t = localStorage.getItem(STORAGE_TEMA);
      setTema(t === "light" ? "light" : "dark");
    } catch {
      /* ignora */
    }
    setHidratado(true);
  }, []);

  /* ======================= SALVAR ======================= */

  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem(STORAGE_MAQUINAS, JSON.stringify(maquinas));
  }, [maquinas, hidratado]);

  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem(STORAGE_MANUTENCAO, JSON.stringify(manutencao));
  }, [manutencao, hidratado]);

  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem(STORAGE_TEMA, tema);
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema, hidratado]);

  /* ======================= CÁLCULOS ======================= */

  const totalMaquinas = maquinas.length;

  const totalSensores = useMemo(
    () => maquinas.reduce((total, m) => total + m.sensores, 0),
    [maquinas],
  );

  const totalOnline = useMemo(
    () => maquinas.reduce((total, m) => total + m.online, 0),
    [maquinas],
  );

  const totalOffline = useMemo(
    () => maquinas.reduce((total, m) => total + m.offline, 0),
    [maquinas],
  );

  const disponibilidade =
    totalSensores > 0 ? (totalOnline / totalSensores) * 100 : 0;

  const percentualOffline =
    totalSensores > 0 ? (totalOffline / totalSensores) * 100 : 0;

  const totalManutencao =
    manutencao.instalacao + manutencao.corretiva + manutencao.inspecao;

  const situacaoSensores = [
    { nome: "Online", valor: totalOnline, color: "var(--chart-2)" },
    { nome: "Offline", valor: totalOffline, color: "var(--destructive)" },
  ];

  /* ======================= EDITAR ======================= */

  function atualizarMaquina(
    id: number,
    campo: keyof Maquina,
    valor: string | number,
  ) {
    setMaquinas((lista) =>
      lista.map((maquina) => {
        if (maquina.id !== id) return maquina;

        const atualizado = {
          ...maquina,
          [campo]: campo === "nome" ? valor : Math.max(0, Number(valor)),
        };

        if (campo === "sensores" || campo === "online" || campo === "offline") {
          const sensores = Math.max(
            0,
            Number(campo === "sensores" ? valor : atualizado.sensores),
          );

          let online = Math.max(
            0,
            Number(campo === "online" ? valor : atualizado.online),
          );

          let offline = Math.max(
            0,
            Number(campo === "offline" ? valor : atualizado.offline),
          );

          if (campo === "sensores") {
            online = Math.min(online, sensores);
            offline = Math.max(0, sensores - online);
          }

          if (campo === "online") {
            online = Math.min(online, sensores);
            offline = Math.max(0, sensores - online);
          }

          if (campo === "offline") {
            offline = Math.min(offline, sensores);
            online = Math.max(0, sensores - offline);
          }

          return { ...atualizado, sensores, online, offline };
        }

        return atualizado;
      }),
    );
  }

  /* ======================= ADICIONAR ======================= */

  function adicionarMaquina() {
    if (!novaMaquina.nome.trim()) return;

    const sensores = Math.max(0, Number(novaMaquina.sensores) || 0);

    let online = Math.max(0, Number(novaMaquina.online) || 0);
    let offline = Math.max(0, Number(novaMaquina.offline) || 0);

    online = Math.min(online, sensores);
    offline = Math.min(offline, Math.max(0, sensores - online));

    if (online + offline < sensores) {
      offline = sensores - online;
    }

    setMaquinas((lista) => [
      ...lista,
      {
        id: Date.now(),
        nome: novaMaquina.nome.trim(),
        sensores,
        online,
        offline,
      },
    ]);

    setNovaMaquina({ nome: "", sensores: "", online: "", offline: "" });
  }

  function excluirMaquina(id: number) {
    setMaquinas((lista) => lista.filter((m) => m.id !== id));
  }

  /* ======================= RENDER ======================= */

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="gap-1">
              <Cpu className="h-3 w-3" />
              Monitoramento preditivo
            </Badge>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Manutenção de Sensores de Vibração
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Acompanhamento da disponibilidade, sensores e atividades de
                manutenção da frota.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() =>
              setTema((atual) => (atual === "dark" ? "light" : "dark"))
            }
            title={tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {tema === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Kpi
            label="Máquinas"
            value={totalMaquinas.toString()}
            hint="equipamentos"
            icon={HardHat}
          />
          <Kpi
            label="Sensores"
            value={totalSensores.toString()}
            hint="pontos instalados"
            icon={Cpu}
          />
          <Kpi
            label="Online"
            value={totalOnline.toString()}
            hint="em operação"
            icon={Activity}
            accent="positive"
          />
          <Kpi
            label="Offline"
            value={totalOffline.toString()}
            hint="necessitam atenção"
            icon={AlertTriangle}
            accent="negative"
          />
          <Kpi
            label="Disponibilidade"
            value={`${disponibilidade.toFixed(1)}%`}
            hint="situação atual"
            icon={Gauge}
            accent="warning"
          />
          <Kpi
            label="Manutenções"
            value={totalManutencao.toString()}
            hint="atividades registradas"
            icon={Wrench}
          />
        </div>

        {/* DISPONIBILIDADE */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Disponibilidade geral
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cálculo automático com base nos sensores cadastrados.
                </p>
              </div>

              <Badge
                variant={
                  disponibilidade >= 90
                    ? "default"
                    : disponibilidade >= 70
                      ? "secondary"
                      : "destructive"
                }
              >
                {disponibilidade >= 90
                  ? "Excelente"
                  : disponibilidade >= 70
                    ? "Atenção"
                    : "Crítico"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {disponibilidade.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">disponibilidade</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight text-destructive">
                  {percentualOffline.toFixed(1)}% offline
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalOffline} sensores
                </p>
              </div>
            </div>

            <Progress value={disponibilidade} />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>● Online {totalOnline}</span>
              <span>● Offline {totalOffline}</span>
            </div>
          </CardContent>
        </Card>

        {/* GRÁFICOS */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sensores por máquina</CardTitle>
              <p className="text-sm text-muted-foreground">
                Quantidade total instalada em cada equipamento.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={maquinas}
                    margin={{ top: 8, right: 8, bottom: 8, left: -8 }}
                  >
                    <XAxis
                      dataKey="nome"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sensores" radius={[4, 4, 0, 0]}>
                      {maquinas.map((maquina, index) => (
                        <Cell
                          key={maquina.id}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Situação dos sensores</CardTitle>
              <p className="text-sm text-muted-foreground">
                Online × offline em toda a frota.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={situacaoSensores}
                      dataKey="valor"
                      nameKey="nome"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {situacaoSensores.map((item) => (
                        <Cell key={item.nome} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {totalSensores}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    sensores
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {situacaoSensores.map((item) => (
                  <div
                    key={item.nome}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.nome}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.valor}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MANUTENÇÃO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Controle de manutenção
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Registre as atividades realizadas na frota.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-[var(--chart-2)]" />
                  <span className="text-sm font-medium">Instalação</span>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={manutencao.instalacao}
                  onChange={(e) =>
                    setManutencao({
                      ...manutencao,
                      instalacao: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="mt-3 text-lg font-bold"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Instalações realizadas
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[var(--chart-5)]" />
                  <span className="text-sm font-medium">Corretiva</span>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={manutencao.corretiva}
                  onChange={(e) =>
                    setManutencao({
                      ...manutencao,
                      corretiva: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="mt-3 text-lg font-bold"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Manutenções corretivas
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--chart-3)]" />
                  <span className="text-sm font-medium">Inspeção</span>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={manutencao.inspecao}
                  onChange={(e) =>
                    setManutencao({
                      ...manutencao,
                      inspecao: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="mt-3 text-lg font-bold"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Inspeções realizadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADICIONAR MÁQUINA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar máquina
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cadastre uma nova máquina e informe seus sensores.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Input
                placeholder="Nome da máquina"
                value={novaMaquina.nome}
                onChange={(e) =>
                  setNovaMaquina({ ...novaMaquina, nome: e.target.value })
                }
              />
              <Input
                type="number"
                min={0}
                placeholder="Sensores"
                value={novaMaquina.sensores}
                onChange={(e) =>
                  setNovaMaquina({ ...novaMaquina, sensores: e.target.value })
                }
              />
              <Input
                type="number"
                min={0}
                placeholder="Online"
                value={novaMaquina.online}
                onChange={(e) =>
                  setNovaMaquina({ ...novaMaquina, online: e.target.value })
                }
              />
              <Input
                type="number"
                min={0}
                placeholder="Offline"
                value={novaMaquina.offline}
                onChange={(e) =>
                  setNovaMaquina({ ...novaMaquina, offline: e.target.value })
                }
              />
              <Button onClick={adicionarMaquina} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABELA EDITÁVEL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Cadastro da frota
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Edite diretamente os dados de cada equipamento.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Sensores</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Offline</TableHead>
                    <TableHead>Disponibilidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {maquinas.map((maquina) => {
                    const disp =
                      maquina.sensores > 0
                        ? (maquina.online / maquina.sensores) * 100
                        : 0;

                    const editandoAgora = editando === maquina.id;

                    return (
                      <TableRow key={maquina.id}>
                        <TableCell>
                          {editandoAgora ? (
                            <Input
                              value={maquina.nome}
                              onChange={(e) =>
                                atualizarMaquina(
                                  maquina.id,
                                  "nome",
                                  e.target.value,
                                )
                              }
                              className="h-9 w-32"
                            />
                          ) : (
                            <span className="font-medium">{maquina.nome}</span>
                          )}
                        </TableCell>

                        <TableCell>
                          {editandoAgora ? (
                            <Input
                              type="number"
                              min={0}
                              value={maquina.sensores}
                              onChange={(e) =>
                                atualizarMaquina(
                                  maquina.id,
                                  "sensores",
                                  e.target.value,
                                )
                              }
                              className="h-9 w-24"
                            />
                          ) : (
                            maquina.sensores
                          )}
                        </TableCell>

                        <TableCell>
                          {editandoAgora ? (
                            <Input
                              type="number"
                              min={0}
                              value={maquina.online}
                              onChange={(e) =>
                                atualizarMaquina(
                                  maquina.id,
                                  "online",
                                  e.target.value,
                                )
                              }
                              className="h-9 w-24"
                            />
                          ) : (
                            <span className="text-[var(--chart-2)]">
                              {maquina.online}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {editandoAgora ? (
                            <Input
                              type="number"
                              min={0}
                              value={maquina.offline}
                              onChange={(e) =>
                                atualizarMaquina(
                                  maquina.id,
                                  "offline",
                                  e.target.value,
                                )
                              }
                              className="h-9 w-24"
                            />
                          ) : (
                            <span className="text-destructive">
                              {maquina.offline}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={disp} className="w-24" />
                            <span className="text-xs text-muted-foreground">
                              {disp.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setEditando(editandoAgora ? null : maquina.id)
                              }
                              title={editandoAgora ? "Salvar" : "Editar"}
                            >
                              {editandoAgora ? (
                                <Save className="h-4 w-4" />
                              ) : (
                                <Pencil className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => excluirMaquina(maquina.id)}
                              title="Excluir máquina"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {maquinas.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <XCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Nenhuma máquina cadastrada
                </p>
                <p className="text-sm text-muted-foreground">
                  Use o formulário acima para adicionar uma máquina.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RODAPÉ */}
        <div className="border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Dashboard de Monitoramento Preditivo • Sensores de Vibração
          </p>
        </div>
      </div>
    </div>
  );
}
