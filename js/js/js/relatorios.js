import { supabase } from './config.js';

/**
 * Gera relatório completo em PDF
 */
export async function gerarRelatorioPDF(auxilioId, gastos, auxilio) {
    // Carregar a biblioteca jsPDF dinamicamente
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    await new Promise(resolve => script.onload = resolve);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // ===== CABEÇALHO =====
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50);
    doc.text('🍽️ Cadê Meu Rango?', 105, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`RELATÓRIO - ${auxilio.periodo}`, 105, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 105, 48, { align: 'center' });
    
    // ===== INFORMAÇÕES DO AUXÍLIO =====
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('📋 INFORMAÇÕES DO AUXÍLIO', 20, 65);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text(`💰 Valor Total: R$ ${auxilio.valor.toFixed(2)}`, 20, 78);
    doc.text(`📅 Dias: ${auxilio.dias_totais}`, 20, 86);
    doc.text(`📆 Início: ${new Date(auxilio.data_inicio).toLocaleDateString()}`, 20, 94);
    
    // ===== RESUMO FINANCEIRO =====
    const totalGasto = gastos.reduce((s, g) => s + g.valor, 0);
    const saldo = auxilio.valor - totalGasto;
    const diasComGastos = new Set(gastos.map(g => g.data_gasto)).size;
    const diasRestantes = Math.max(0, auxilio.dias_totais - diasComGastos);
    const media = diasRestantes > 0 ? saldo / diasRestantes : 0;
    
    doc.text('📊 RESUMO FINANCEIRO', 20, 110);
    
    doc.setFontSize(11);
    doc.text(`💸 Total Gasto: R$ ${totalGasto.toFixed(2)}`, 20, 123);
    doc.text(`💰 Saldo Atual: R$ ${saldo.toFixed(2)}`, 20, 131);
    doc.text(`📅 Dias Restantes: ${diasRestantes}`, 20, 139);
    doc.text(`💵 Média Disponível: R$ ${media.toFixed(2)}/dia`, 20, 147);
    
    // ===== STATUS =====
    let status = '';
    let cor = '';
    if (media >= 10) {
        status = '🟢 Tá suave! (≥ R$10/dia)';
        cor = '#4CAF50';
    } else if (media >= 5) {
        status = '🟡 Atenção! (≥ R$5/dia)';
        cor = '#FFC107';
    } else {
        status = '🔴 Alerta! (< R$5/dia)';
        cor = '#e53935';
    }
    
    doc.setFontSize(12);
    doc.setTextColor(46, 125, 50);
    doc.text(`📌 STATUS: ${status}`, 20, 162);
    
    // ===== GASTOS POR DIA (TABELA) =====
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('📋 GASTOS REGISTRADOS', 20, 180);
    
    // Agrupa gastos por dia
    const gastosPorDia = {};
    gastos.forEach(g => {
        const data = new Date(g.data_gasto).toLocaleDateString();
        if (!gastosPorDia[data]) gastosPorDia[data] = [];
        gastosPorDia[data].push(g);
    });
    
    const dias = Object.keys(gastosPorDia).sort((a, b) => new Date(a) - new Date(b));
    
    let y = 192;
    const maxLinhas = 15;
    let linha = 0;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Data', 25, y);
    doc.text('Valor', 70, y);
    doc.text('Local', 100, y);
    doc.text('Obs', 140, y);
    y += 5;
    doc.line(20, y, 190, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    for (const data of dias) {
        if (linha > maxLinhas) {
            doc.addPage();
            y = 25;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Data', 25, y);
            doc.text('Valor', 70, y);
            doc.text('Local', 100, y);
            doc.text('Obs', 140, y);
            y += 5;
            doc.line(20, y, 190, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            linha = 0;
        }
        
        const gastosDia = gastosPorDia[data];
        const totalDia = gastosDia.reduce((s, g) => s + g.valor, 0);
        
        doc.text(data, 25, y);
        doc.text(`R$ ${totalDia.toFixed(2)}`, 70, y);
        doc.text(gastosDia[0].local || '-', 100, y);
        doc.text(gastosDia[0].observacao || '-', 140, y);
        
        y += 6;
        linha++;
        
        // Mostra detalhes extras se houver mais de 1 gasto no dia
        if (gastosDia.length > 1) {
            for (let i = 1; i < gastosDia.length && linha < maxLinhas; i++) {
                doc.text(`  └ ${gastosDia[i].local || '-'}`, 100, y);
                doc.text(`R$ ${gastosDia[i].valor.toFixed(2)}`, 70, y);
                y += 6;
                linha++;
            }
        }
    }
    
    // ===== RODAPÉ =====
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.text(`Página ${i}/${totalPaginas}`, 105, 290, { align: 'center' });
        doc.text('Cadê Meu Rango? - Controle de Auxílio Alimentação', 105, 295, { align: 'center' });
    }
    
    // ===== SALVA PDF =====
    doc.save(`relatorio_${auxilio.periodo.replace('/', '_')}.pdf`);
}

/**
 * Gera calendário em PDF
 */
export async function gerarCalendarioPDF(auxilioId, gastos, auxilio) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    await new Promise(resolve => script.onload = resolve);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // ===== CABEÇALHO =====
    doc.setFontSize(20);
    doc.setTextColor(46, 125, 50);
    doc.text('🍽️ Cadê Meu Rango?', 105, 25, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`📅 Calendário - ${auxilio.periodo}`, 105, 38, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 105, 46, { align: 'center' });
    
    // ===== INFORMAÇÕES =====
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const totalGasto = gastos.reduce((s, g) => s + g.valor, 0);
    const saldo = auxilio.valor - totalGasto;
    
    doc.text(`💰 Valor: R$ ${auxilio.valor.toFixed(2)}`, 20, 60);
    doc.text(`💸 Gasto: R$ ${totalGasto.toFixed(2)}`, 20, 68);
    doc.text(`💵 Saldo: R$ ${saldo.toFixed(2)}`, 20, 76);
    doc.text(`📆 Início: ${new Date(auxilio.data_inicio).toLocaleDateString()}`, 120, 60);
    doc.text(`📅 Dias: ${auxilio.dias_totais}`, 120, 68);
    
    // ===== TABELA DE DIAS =====
    const inicio = new Date(auxilio.data_inicio);
    const dias = [];
    
    for (let i = 0; i < Math.min(auxilio.dias_totais, 31); i++) {
        const dia = new Date(inicio);
        dia.setDate(inicio.getDate() + i);
        
        const gastoDia = gastos.filter(g => {
            const dataGasto = new Date(g.data_gasto);
            return dataGasto.toDateString() === dia.toDateString();
        });
        
        const totalGastoDia = gastoDia.reduce((s, g) => s + g.valor, 0);
        
        dias.push({
            data: dia,
            diaSemana: dia.toLocaleDateString('pt-BR', { weekday: 'short' }),
            dataStr: dia.toLocaleDateString('pt-BR'),
            gastos: gastoDia,
            total: totalGastoDia
        });
    }
    
    // ===== DESENHA CALENDÁRIO =====
    let y = 92;
    const colunas = ['#', 'Data', 'Dia', 'Gastos', 'Total'];
    const larguras = [8, 25, 22, 60, 25];
    let linha = 1;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    let x = 20;
    colunas.forEach((col, i) => {
        doc.text(col, x, y);
        x += larguras[i];
    });
    
    y += 4;
    doc.line(20, y, 190, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    for (const dia of dias) {
        if (linha > 25) {
            doc.addPage();
            y = 30;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            let x2 = 20;
            colunas.forEach((col, i) => {
                doc.text(col, x2, y);
                x2 += larguras[i];
            });
            y += 4;
            doc.line(20, y, 190, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            linha = 1;
        }
        
        x = 20;
        doc.text(linha.toString(), x, y + 2);
        x += larguras[0];
        
        doc.text(dia.dataStr, x, y + 2);
        x += larguras[1];
        
        doc.text(dia.diaSemana, x, y + 2);
        x += larguras[2];
        
        const gastosText = dia.gastos.map(g => g.observacao || 'Gasto').join(', ');
        doc.text(gastosText.substring(0, 25), x, y + 2);
        x += larguras[3];
        
        doc.text(dia.total > 0 ? `R$ ${dia.total.toFixed(2)}` : '-', x, y + 2);
        
        y += 7;
        linha++;
    }
    
    // ===== LEGENDA =====
    y += 5;
    doc.setFontSize(9);
    doc.text('📌 Legenda:', 20, y);
    doc.text('💰 = Dia com gasto', 60, y);
    doc.text('⭕ = Dia sem gasto', 120, y);
    
    // ===== RODAPÉ =====
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.text(`Página ${i}/${totalPaginas}`, 105, 285, { align: 'center' });
    }
    
    doc.save(`calendario_${auxilio.periodo.replace('/', '_')}.pdf`);
}