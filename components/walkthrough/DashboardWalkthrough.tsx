'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '@/contexts/AuthContext';

const WALKTHROUGH_KEY = 'nexova_dashboard_walkthrough_completed';

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Selamat Datang ke Nexova! 🎉
        </h3>
        <p className="text-[#969696]">
          Jom kita tunjukkan cara guna platform ini untuk bina sales page yang
          convert tinggi.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-project"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">
          Buat Projek Baru 📝
        </h4>
        <p className="text-sm text-[#969696]">
          Klik di sini untuk mula bina sales page baru. Anda boleh pilih dari
          template atau mulakan dari kosong.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="templates"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Pilih Template 🎨</h4>
        <p className="text-sm text-[#969696]">
          Kami ada banyak template profesional untuk pelbagai industri - kuih
          raya, photography, automotive dan banyak lagi!
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="projects-list"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Senarai Projek 📁</h4>
        <p className="text-sm text-[#969696]">
          Semua sales page anda akan dipaparkan di sini. Klik untuk edit, atau
          klik ikon untuk preview dan publish.
        </p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="sidebar-products"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Urus Produk 🛍️</h4>
        <p className="text-sm text-[#969696]">
          Tambah produk anda di sini. Set harga, variasi (saiz/warna), dan
          bundle pricing.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-analytics"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">
          Analitik & Prestasi 📊
        </h4>
        <p className="text-sm text-[#969696]">
          Pantau page views, clicks, dan conversion rate untuk setiap sales page
          anda.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-transactions"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Transaksi 💰</h4>
        <p className="text-sm text-[#969696]">
          Lihat semua pembayaran yang diterima dari pelanggan anda di sini.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-integrations"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Integrasi 🔗</h4>
        <p className="text-sm text-[#969696]">
          Sambungkan LeanX untuk terima pembayaran, dan tambah Facebook Pixel
          atau Google Analytics untuk tracking.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-settings"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Tetapan ⚙️</h4>
        <p className="text-sm text-[#969696]">
          Update profil, sambung custom domain, dan urus akaun anda di sini.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Anda Sudah Bersedia! 🚀
        </h3>
        <p className="text-[#969696] mb-3">
          Sekarang, jom buat sales page pertama anda. Klik &quot;Create
          Project&quot; atau pilih template untuk bermula.
        </p>
        <p className="text-xs text-[#969696]">
          💡 Tip: Anda boleh replay tutorial ini dari Settings bila-bila masa.
        </p>
      </div>
    ),
    placement: 'center',
  },
];

export default function DashboardWalkthrough() {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has completed walkthrough
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    if (!completed && user) {
      // Small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(WALKTHROUGH_KEY, 'true');
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      scrollToFirstStep
      disableOverlayClose
      spotlightClicks
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Seterusnya',
        skip: 'Langkau',
      }}
      styles={{
        options: {
          primaryColor: '#5FC7CD',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#5FC7CD',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#969696',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#969696',
          fontSize: 13,
        },
        spotlight: {
          borderRadius: 12,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      floaterProps={{
        disableAnimation: true,
      }}
    />
  );
}

// Export function to manually trigger walkthrough
export function resetDashboardWalkthrough() {
  localStorage.removeItem(WALKTHROUGH_KEY);
  window.location.reload();
}
