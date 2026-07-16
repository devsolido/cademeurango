import { supabase } from './config.js';

let graficoSaldo = null;
let graficoGastos = null;

/**
 * Cria gráfico de evolução do saldo
 */
export function criarGraficoSaldo(dados, elementoId) {
    const ctx = document.getElementById(elementoId);
    if (!ctx) return;

    // Destroi gráfico anterior se existir
    if (graficoSaldo) {
        graficoSaldo.destroy();
    }

    const labels = dados.map(d => d.data);
    const valores = dados.map(d => d.saldo);

    graficoSaldo = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '💰 Saldo Disponível',
                data: valores,
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2E7D32',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: '600' },
                        color: '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2);
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Cria gráfico de gastos por dia
 */
export function criarGraficoGastos(dados, elementoId) {
    const ctx = document.getElementById(elementoId);
    if (!ctx) return;

    if (graficoGastos) {
        graficoGastos.destroy();
    }

    const labels = dados.map(d => d.data);
    const valores = dados.map(d => d.total);

    graficoGastos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '💸 Gastos por Dia',
                data: valores,
                backgroundColor: 'rgba(229, 57, 53, 0.7)',
                borderColor: '#e53935',
                borderWidth: 2,
                borderRadius: 6,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: '600' },
                        color: '#333'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2);
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Prepara dados para gráficos a partir dos gastos
 */
export function prepararDadosGraficos(gastos, auxilio) {
    // Agrupa gastos por dia
    const gastosPorDia = {};
    gastos.forEach(g => {
        const data = new Date(g.data_gasto).toLocaleDateString();
        if (!gastosPorDia[data]) {
            gastosPorDia[data] = 0;
        }
        gastosPorDia[data] += g.valor;
    });

    // Ordena por data
    const datas = Object.keys(gastosPorDia).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    // Dados para gráfico de gastos por dia
    const dadosGastos = datas.map(data => ({
        data: data,
        total: gastosPorDia[data]
    }));

    // Dados para gráfico de saldo (evolução)
    let saldoAtual = auxilio.valor;
    const dadosSaldo = [];
    
    // Adiciona saldo inicial
    dadosSaldo.push({
        data: 'Início',
        saldo: auxilio.valor
    });

    // Calcula saldo dia a dia
    gastos.sort((a, b) => new Date(a.data_gasto) - new Date(b.data_gasto));
    let totalGasto = 0;
    let dataAtual = null;
    let saldoDia = auxilio.valor;

    gastos.forEach(g => {
        totalGasto += g.valor;
        saldoDia = auxilio.valor - totalGasto;
        const data = new Date(g.data_gasto).toLocaleDateString();
        
        // Se mudou a data, adiciona ponto
        if (data !== dataAtual) {
            dadosSaldo.push({
                data: data,
                saldo: saldoDia
            });
            dataAtual = data;
        } else {
            // Atualiza o último ponto
            dadosSaldo[dadosSaldo.length - 1].saldo = saldoDia;
        }
    });

    // Adiciona saldo final se diferente
    const ultimoSaldo = dadosSaldo[dadosSaldo.length - 1];
    if (ultimoSaldo && ultimoSaldo.saldo !== 0) {
        dadosSaldo.push({
            data: 'Final',
            saldo: ultimoSaldo.saldo
        });
    }

    return {
        gastosPorDia: dadosGastos,
        evolucaoSaldo: dadosSaldo
    };
}