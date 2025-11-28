<template>
  <div>
    <canvas ref="barChart" :key="chartKey"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'BarChart',

  props: {
    handOverDatesData: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const barChart = ref(null);
    const chartInstance = ref(null);
    const chartKey = ref(0);

    const safeDestroyChart = () => {
      if (chartInstance.value && typeof chartInstance.value.destroy === 'function') {
        try {
          // Disable animations before destruction
          if (chartInstance.value.options) {
            chartInstance.value.options.animation = false;
          }
          chartInstance.value.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      }
      chartInstance.value = null;
    };

    const processHandOverData = () => {
      if (!props.handOverDatesData || props.handOverDatesData.length === 0) {
        return {
          labels: ['No Data'],
          cashAmounts: [0],
          categories: ['No Category'],
          barangays: ['No Barangay']
        };
      }

      // Sort by date to ensure chronological order
      const sortedData = [...props.handOverDatesData].sort((a, b) => {
        return new Date(a.hand_over_date) - new Date(b.hand_over_date);
      });

      const labels = sortedData.map(item => item.hand_over_date);
      const cashAmounts = sortedData.map(item => item.cash_amount || 0);
      const categories = sortedData.map(item => item.category_label || 'Unknown');
      const barangays = sortedData.map(item => item.barangay_name || 'Unknown');

      return { labels, cashAmounts, categories, barangays };
    };

    const initializeChart = () => {
      // Force re-render by updating key
      chartKey.value += 1;
      
      nextTick(() => {
        setTimeout(() => {
          if (!barChart.value) {
            console.warn('Canvas element not found');
            return;
          }

          safeDestroyChart();

          try {
            const { labels, cashAmounts, categories, barangays } = processHandOverData();

            const ctx = barChart.value.getContext('2d');
            if (!ctx) {
              console.warn('Could not get canvas context');
              return;
            }

            chartInstance.value = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Cash Amount (₱)',
                    data: cashAmounts,
                    backgroundColor: [
                      '#3eff58c4',
                      '#fa8c24ce',
                      '#fbc12dcc',
                      '#ff4081cc',
                      '#9c27b0cc',
                      '#2196f3cc',
                      '#00bcd4cc',
                      '#4caf50cc',
                    ],
                    borderColor: [
                      '#009b15',
                      '#c05d00d2',
                      '#ffb700',
                      '#ff4081',
                      '#7b1fa2',
                      '#1976d2',
                      '#0097a7',
                      '#388e3c',
                    ],
                    borderRadius: 8,
                    borderWidth: 2,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 300,
                  easing: 'easeOutQuart'
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: labels[0] === 'No Data' ? 'No Hand-Over Data Available' : 'Hand-Over Distribution',
                    font: {
                      size: 18,
                      weight: 'bold',
                    },
                    color: '#0044d6',
                  },
                  tooltip: {
                    callbacks: {
                      afterLabel: function(context) {
                        const index = context.dataIndex;
                        if (labels[index] === 'No Data') {
                          return 'No hand-over data available';
                        }
                        return [
                          `Benefeciary: ${categories[index]}`,
                          `Barangay: ${barangays[index]}`
                        ];
                      },
                      label: function(context) {
                        if (labels[context.dataIndex] === 'No Data') {
                          return 'No data';
                        }
                        return `Amount: ₱${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cash Amount (₱)',
                      font: {
                        weight: 'bold'
                      }
                    },
                    ticks: {
                      callback: function(value) {
                        return '₱' + value;
                      }
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Hand-Over Date',
                      font: {
                        weight: 'bold'
                      }
                    }
                  }
                }
              },
            });

          } catch (error) {
            console.error('Error initializing chart:', error);
          }
        }, 100);
      });
    };

    onMounted(() => {
      initializeChart();
    });

    watch(
      () => props.handOverDatesData,
      (newData, oldData) => {
        const hasChanged = JSON.stringify(newData) !== JSON.stringify(oldData);
        if (hasChanged) {
          initializeChart();
        }
      },
      { deep: true }
    );

    onUnmounted(() => {
      safeDestroyChart();
    });

    return { 
      barChart,
      chartKey
    };
  },
};
</script>

<style scoped>
div {
  max-width: 1100px;
  margin: 0 auto;
  min-height: 400px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>