'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Theme colors from design tokens
const colors = {
  green700: '#087653',
  green300: '#8FD3B6',
  green100: '#DDF3E8',
  clay: '#B56B45',
  sun: '#C99A31',
  blueMap: '#4D7892',
  paper200: '#EAE5D8',
  ink800: '#2A3530',
  ink400: '#8A938D'
};

export interface ChartRow {
  label: string;
  value: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          family: 'Manrope, sans-serif',
          size: 12
        },
        color: colors.ink800,
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: colors.ink800,
      bodyColor: colors.ink800,
      borderColor: colors.paper200,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
      titleFont: {
        family: 'Manrope, sans-serif',
        size: 13,
        weight: 'bold'
      },
      bodyFont: {
        family: 'Manrope, sans-serif',
        size: 12
      }
    }
  }
};

const gridOptions = {
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: 'Manrope, sans-serif'
        },
        color: colors.ink400
      }
    },
    y: {
      grid: {
        color: colors.paper200
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          family: 'Manrope, sans-serif'
        },
        color: colors.ink400
      }
    }
  }
};

const barOptions = {
  ...commonOptions,
  ...gridOptions,
  plugins: {
    ...commonOptions.plugins,
    legend: {
      display: false
    }
  }
};

function emptyState(message: string) {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-ink-400">
      {message}
    </div>
  );
}

export function KelompokUmurBarChart({
  rows = [
    { label: '0-14', value: 119 },
    { label: '15-24', value: 143 },
    { label: '25-54', value: 346 },
    { label: '55-64', value: 102 },
    { label: '65+', value: 52 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data kelompok umur belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        label: 'Jumlah Jiwa',
        data: rows.map((row) => row.value),
        backgroundColor: colors.green300,
        hoverBackgroundColor: colors.green700,
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <Bar options={{ ...barOptions, indexAxis: 'y' as const }} data={data} />
    </div>
  );
}

export function AgamaDoughnutChart({
  rows = [
    { label: 'Islam', value: 146 },
    { label: 'Hindu', value: 586 },
    { label: 'Kristen', value: 7 },
    { label: 'Katholik', value: 24 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data agama belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.value),
        backgroundColor: [
          colors.green700,
          colors.sun,
          colors.clay,
          colors.blueMap
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  return <div className="w-full h-full"><Doughnut options={commonOptions} data={data} /></div>;
}

export function SukuDoughnutChart({
  rows = [
    { label: 'Bali', value: 585 },
    { label: 'Bugis', value: 59 },
    { label: 'Jawa', value: 75 },
    { label: 'Tator', value: 34 },
    { label: 'Mandar', value: 3 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data suku belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.value),
        backgroundColor: [
          colors.green300,
          colors.green700,
          colors.blueMap,
          colors.clay,
          colors.sun
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  return <div className="w-full h-full"><Doughnut options={commonOptions} data={data} /></div>;
}

export function StatusPernikahanPieChart({
  rows = [
    { label: 'Kawin', value: 419 },
    { label: 'Belum Kawin', value: 319 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data status pernikahan belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.value),
        backgroundColor: [colors.green700, colors.green100],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  return <div className="w-full h-full"><Doughnut options={commonOptions} data={data} /></div>;
}

export function DistribusiWilayahBarChart({
  rows = [
    { label: 'Dusun Kerta', value: 164 },
    { label: 'Dusun Makmur', value: 350 },
    { label: 'Dusun Lestari', value: 174 },
    { label: 'Dusun Mandiri', value: 77 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data distribusi dusun belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        label: 'Populasi',
        data: rows.map((row) => row.value),
        backgroundColor: colors.blueMap,
        hoverBackgroundColor: colors.green700,
        borderRadius: 4
      }
    ]
  };

  return <div className="w-full h-full"><Bar options={barOptions} data={data} /></div>;
}

export function LembagaEkonomiDoughnutChart({
  rows = [
    { label: 'Gapoktan', value: 1 },
    { label: 'BUMDesa', value: 1 },
    { label: 'Kelompok Tani', value: 10 },
    { label: 'Kelompok Ternak', value: 1 }
  ]
}: {
  rows?: ChartRow[];
}) {
  if (rows.length === 0) return emptyState('Data lembaga ekonomi belum diisi.');

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.value),
        backgroundColor: [
          colors.green700,
          colors.clay,
          colors.sun,
          colors.blueMap
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  return <div className="w-full h-full"><Doughnut options={commonOptions} data={data} /></div>;
}
