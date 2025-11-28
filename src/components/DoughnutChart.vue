<template>
  <div>
    <canvas ref="doughnutChart"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'DoughnutChart',

  props: {
    beneficiariesData: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const doughnutChart = ref(null);
    let chartInstance = null;

    const destroyChart = () => {
      if (chartInstance) {
        try {
          chartInstance.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
        chartInstance = null;
      }
    };

    const countGenders = () => {
      if (!props.beneficiariesData || props.beneficiariesData.length === 0) {
        return {
          male: 0,
          female: 0,
          total: 0
        };
      }

      const counts = {
        male: 0,
        female: 0,
        total: props.beneficiariesData.length
      };

      props.beneficiariesData.forEach(beneficiary => {
        if (beneficiary.gender_label === 'Male') {
          counts.male++;
        } else if (beneficiary.gender_label === 'Female') {
          counts.female++;
        }
      });

      return counts;
    };

    const createChart = () => {
      destroyChart();

      if (!doughnutChart.value) return;

      const genderCounts = countGenders();
      
      const ctx = doughnutChart.value.getContext('2d');
      
      // If no data, show empty state
      if (genderCounts.total === 0) {
        chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['No Data'],
            datasets: [{
              data: [1],
              backgroundColor: ['#e0e0e0'],
              borderColor: ['#bdbdbd'],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: 'Gender Distribution - No Data',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              tooltip: {
                callbacks: {
                  label: () => 'No beneficiary data available'
                }
              }
            },
            cutout: '60%'
          }
        });
        return;
      }

      const data = [genderCounts.male, genderCounts.female];
      const labels = ['Male', 'Female'];
      const backgroundColors = ['#3498db', '#e74c3c'];
      const borderColors = ['#2980b9', '#c0392b'];

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderRadius: 8,
            borderWidth: 2,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            title: {
              display: true,
              text: 'Gender Distribution',
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#0044d6',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `Total Count: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '60%',
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    };

    onMounted(() => {
      setTimeout(createChart, 100);
    });

    watch(() => props.beneficiariesData, () => {
      setTimeout(createChart, 100);
    }, { deep: true });

    onUnmounted(() => {
      destroyChart();
    });

    return { doughnutChart };
  }
};
</script>

<style scoped>
div {
  max-width: 600px;
  margin: 0 auto;
  min-height: 300px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>