<template>
  <div>
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'BarChart',

  props: {
    totalBenefCount: {
      type: [Number, String],
      default: 0
    },
    totalSeniorsCount: {
      type: [Number, String],
      default: 0
    },
    totalPwdCount: {
      type: [Number, String],
      default: 0
    },
    totalHandOverCount: {
      type: [Number, String],
      default: 0
    },
  },

  setup(props) {
    const barChart = ref(null);
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
      if (!barChart.value || !barChart.value.getContext) {
        console.warn('Canvas not ready for chart initialization');
        return;
      }

      safeDestroyChart();

      try {
        const benefCount = parseCount(props.totalBenefCount);
        const seniorsCount = parseCount(props.totalSeniorsCount);
        const pwdCount = parseCount(props.totalPwdCount);
        const handOverCount = parseCount(props.totalHandOverCount);

        const ctx = barChart.value.getContext('2d');
        if (!ctx) {
          console.warn('Could not get canvas context');
          return;
        }

        chartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['All Beneficiaries', 'Senior Citizens', 'PWDs', 'Hand Overs'],
            datasets: [
              {
                label: 'Count',
                data: [benefCount, seniorsCount, pwdCount, handOverCount],
                backgroundColor: [
                  '#3eff58c4',
                  '#fa8c24ce',
                  '#fbc12dcc',
                  '#ff4081cc',
                ],
                borderColor: [
                  '#009b15',
                  '#c05d00d2',
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
                display: false,
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
        if (barChart.value) {
          initializeChart();
        } else {
          setTimeout(() => {
            initializeChart();
          }, 150);
        }
      });
    });

    watch(
      () => [props.totalBenefCount, props.totalSeniorsCount, props.totalPwdCount, props.totalHandOverCount],
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
      barChart
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