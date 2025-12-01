<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'PieChart',

  props: {
    totalSeniorsCount: {
      type: [Number, String],
      default: 0
    },
    totalPwdCount: {
      type: [Number, String],
      default: 0
    },
  },

  setup(props) {
    const pieChart = ref(null);
    const chartInstance = ref(null);
    const isInitialized = ref(false);

    const parseCount = (count) => {
      if (typeof count === 'string') {
        return Number(count.replace(/,/g, '')) || 0;
      }
      return count || 0;
    };

    const safeDestroyChart = () => {
      if (chartInstance.value) {
        try {
          const chart = chartInstance.value;
          chartInstance.value = null;
          chart.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      }
    };

    const initializeChart = () => {
      if (!pieChart.value || !pieChart.value.getContext) {
        console.warn('Canvas not ready for chart initialization');
        return;
      }

      safeDestroyChart();

      try {
        const seniorsCount = parseCount(props.totalSeniorsCount);
        const pwdCount = parseCount(props.totalPwdCount);

        const ctx = pieChart.value.getContext('2d');
        if (!ctx) {
          console.warn('Could not get canvas context');
          return;
        }

        chartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Senior Citizens', 'PWDs'],
            datasets: [
              {
                label: 'Total Count',
                data: [seniorsCount, pwdCount],
                backgroundColor: [
                  '#683effc4',
                  '#fa24a8ce',
                  '#fbc12dcc',
                  '#ff4081cc',
                ],
                borderColor: [
                  '#62009b',
                  '#c000a0d2',
                  '#ffb700',
                  '#ff4081',
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
              duration: 0
            },
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
                text: 'Beneficiary Distribution',
                font: {
                  size: 18,
                  weight: 'bold',
                },
                color: '#0044d6',
              },
            },
          },
        });

        isInitialized.value = true;
      } catch (error) {
        console.error('Error initializing chart:', error);
        isInitialized.value = false;
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (pieChart.value) {
          initializeChart();
        } else {
          setTimeout(() => {
            initializeChart();
          }, 150);
        }
      });
    });

    watch(
      () => [props.totalSeniorsCount, props.totalPwdCount],
      (newValues, oldValues) => {
        const hasChanged = JSON.stringify(newValues) !== JSON.stringify(oldValues);
        if (hasChanged) {
          nextTick(() => {
            setTimeout(() => {
              initializeChart();
            }, 10);
          });
        }
      }
    );

    onUnmounted(() => {
      isInitialized.value = false;
      safeDestroyChart();
    });

    return { 
      pieChart
    };
  },
};
</script>

<style scoped>
div {
  max-width: 1100px;
  margin: 0 auto;
  min-height: 300px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>