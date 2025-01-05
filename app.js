document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial de los gráficos
    const ctxSemanal = document.getElementById('graficoSemanal').getContext('2d');
    const ctxMensual = document.getElementById('graficoMensual').getContext('2d');
    const ctxAnual = document.getElementById('graficoAnual').getContext('2d');
    
    let graficoSemanal, graficoMensual, graficoAnual;
    
    // Datos iniciales
    const datos = {
        semanal: {
            efectivo: Array(7).fill(0),
            tarjeta: Array(7).fill(0),
            yape: Array(7).fill(0),
            transferencia: Array(7).fill(0)
        },
        mensual: {
            efectivo: Array(31).fill(0),
            tarjeta: Array(31).fill(0),
            yape: Array(31).fill(0),
            transferencia: Array(31).fill(0)
        },
        anual: {
            efectivo: Array(12).fill(0),
            tarjeta: Array(12).fill(0),
            yape: Array(12).fill(0),
            transferencia: Array(12).fill(0)
        }
    };

    // Cargar datos guardados
    function cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('datosCaja');
        if (datosGuardados) {
            const datosParseados = JSON.parse(datosGuardados);
            Object.assign(datos, datosParseados);
        }
    }

    // Función para crear configuración base de gráficos
    function crearConfiguracionGrafico(labels, datos, tipo) {
        const esAnual = tipo === 'anual';
        
        return {
            type: esAnual ? 'line' : 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Efectivo',
                        data: datos[tipo].efectivo,
                        backgroundColor: esAnual ? 'rgba(46, 204, 113, 0.2)' : '#2ecc71',
                        borderColor: '#2ecc71',
                        fill: esAnual,
                        tension: esAnual ? 0.4 : 0,
                        stack: esAnual ? undefined : 'Stack 0',
                    },
                    {
                        label: 'Tarjeta',
                        data: datos[tipo].tarjeta,
                        backgroundColor: esAnual ? 'rgba(52, 152, 219, 0.2)' : '#3498db',
                        borderColor: '#3498db',
                        fill: esAnual,
                        tension: esAnual ? 0.4 : 0,
                        stack: esAnual ? undefined : 'Stack 0',
                    },
                    {
                        label: 'Yape',
                        data: datos[tipo].yape,
                        backgroundColor: esAnual ? 'rgba(241, 196, 15, 0.2)' : '#f1c40f',
                        borderColor: '#f1c40f',
                        fill: esAnual,
                        tension: esAnual ? 0.4 : 0,
                        stack: esAnual ? undefined : 'Stack 0',
                    },
                    {
                        label: 'Transferencia',
                        data: datos[tipo].transferencia,
                        backgroundColor: esAnual ? 'rgba(155, 89, 182, 0.2)' : '#9b59b6',
                        borderColor: '#9b59b6',
                        fill: esAnual,
                        tension: esAnual ? 0.4 : 0,
                        stack: esAnual ? undefined : 'Stack 0',
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: { 
                        stacked: !esAnual,
                        grid: {
                            display: false
                        }
                    },
                    y: { 
                        stacked: !esAnual,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)',
                            drawBorder: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: S/.${context.raw.toFixed(2)}`;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: esAnual ? 3 : 1
                    },
                    point: {
                        radius: esAnual ? 4 : 0,
                        hoverRadius: esAnual ? 6 : 4
                    }
                }
            }
        };
    }

    // Inicializar gráficos
    function inicializarGraficos() {
        const labelsSemanal = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const labelsMensual = Array.from({length: 31}, (_, i) => `Día ${i + 1}`);
        const labelsAnual = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        graficoSemanal = new Chart(ctxSemanal, crearConfiguracionGrafico(labelsSemanal, datos, 'semanal'));
        graficoMensual = new Chart(ctxMensual, crearConfiguracionGrafico(labelsMensual, datos, 'mensual'));
        graficoAnual = new Chart(ctxAnual, crearConfiguracionGrafico(labelsAnual, datos, 'anual'));
    }

    cargarDatosGuardados();
    inicializarGraficos();

    // Manejar el guardado de registros
    document.getElementById('guardarRegistro').addEventListener('click', function() {
        const efectivo = parseFloat(document.getElementById('efectivo').value) || 0;
        const tarjeta = parseFloat(document.getElementById('tarjeta').value) || 0;
        const yape = parseFloat(document.getElementById('yape').value) || 0;
        const transferencia = parseFloat(document.getElementById('transferencia').value) || 0;

        const fecha = new Date();
        const diaSemanal = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1;
        const diaMensual = fecha.getDate() - 1;
        const mes = fecha.getMonth();

        // Actualizar datos semanales
        datos.semanal.efectivo[diaSemanal] += efectivo;
        datos.semanal.tarjeta[diaSemanal] += tarjeta;
        datos.semanal.yape[diaSemanal] += yape;
        datos.semanal.transferencia[diaSemanal] += transferencia;

        // Actualizar datos mensuales
        datos.mensual.efectivo[diaMensual] += efectivo;
        datos.mensual.tarjeta[diaMensual] += tarjeta;
        datos.mensual.yape[diaMensual] += yape;
        datos.mensual.transferencia[diaMensual] += transferencia;

        // Actualizar datos anuales
        datos.anual.efectivo[mes] += efectivo;
        datos.anual.tarjeta[mes] += tarjeta;
        datos.anual.yape[mes] += yape;
        datos.anual.transferencia[mes] += transferencia;

        // Actualizar gráficos
        graficoSemanal.update();
        graficoMensual.update();
        graficoAnual.update();

        // Limpiar formulario
        document.getElementById('efectivo').value = '';
        document.getElementById('tarjeta').value = '';
        document.getElementById('yape').value = '';
        document.getElementById('transferencia').value = '';
    });

    // Manejar el cierre de caja
    document.getElementById('cerrarCaja').addEventListener('click', function() {
        document.getElementById('confirmDialog').classList.remove('hidden');
    });

    document.getElementById('cancelarCierre').addEventListener('click', function() {
        document.getElementById('confirmDialog').classList.add('hidden');
    });

    document.getElementById('confirmarCierre').addEventListener('click', function() {
        // Guardar datos
        localStorage.setItem('datosCaja', JSON.stringify(datos));
        
        // Mostrar mensaje de éxito
        alert('Caja cerrada exitosamente');
        
        // Ocultar diálogo
        document.getElementById('confirmDialog').classList.add('hidden');
    });

    // Cerrar el diálogo si se hace clic fuera de él
    document.getElementById('confirmDialog').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    // Manejar los tabs
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Ocultar todos los gráficos
            document.querySelectorAll('.grafico-section').forEach(section => {
                section.classList.add('hidden');
            });

            // Mostrar el gráfico correspondiente
            switch(period) {
                case 'daily':
                    document.getElementById('vista-diaria').classList.remove('hidden');
                    break;
                case 'monthly':
                    document.getElementById('vista-mensual').classList.remove('hidden');
                    break;
                case 'yearly':
                    document.getElementById('vista-anual').classList.remove('hidden');
                    break;
            }
        });
    });
});
