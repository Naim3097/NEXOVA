'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const WALKTHROUGH_KEY = 'nexova_builder_walkthrough_completed';

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Selamat Datang ke Page Builder! 🛠️
        </h3>
        <p className="text-[#969696]">
          Di sini anda boleh bina dan customize sales page mengikut kreativiti
          anda.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="elements-panel"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Panel Elemen 🧩</h4>
        <p className="text-sm text-[#969696]">
          Pilih elemen dari sini untuk ditambah ke page anda. Cuma klik pada
          elemen yang anda mahu.
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>
            • <b>Hero</b> - Header utama dengan headline
          </li>
          <li>
            • <b>Features</b> - Senarai ciri produk
          </li>
          <li>
            • <b>Testimonials</b> - Review pelanggan
          </li>
          <li>
            • <b>Pricing</b> - Jadual harga
          </li>
          <li>
            • <b>Form</b> - Borang order/lead
          </li>
        </ul>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="canvas"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">
          Canvas (Kawasan Kerja) 🎨
        </h4>
        <p className="text-sm text-[#969696]">
          Ini adalah paparan live sales page anda. Klik pada mana-mana elemen
          untuk select dan edit.
        </p>
        <p className="text-xs text-[#969696] mt-2">
          💡 Drag elemen untuk susun semula urutan.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="properties-panel"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">
          Panel Properties ⚙️
        </h4>
        <p className="text-sm text-[#969696]">
          Apabila elemen dipilih, panel ini akan muncul. Di sini anda boleh:
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>• Edit teks dan kandungan</li>
          <li>• Tukar warna dan font</li>
          <li>• Upload gambar</li>
          <li>• Set button links</li>
        </ul>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="device-preview"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Device Preview 📱</h4>
        <p className="text-sm text-[#969696]">
          Tukar antara Desktop, Tablet, dan Mobile untuk pastikan page anda
          cantik di semua device.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="preview-button"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Preview 👁️</h4>
        <p className="text-sm text-[#969696]">
          Klik untuk preview page anda dalam tab baru. Test semua button dan
          form sebelum publish.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="publish-button"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">Publish 🚀</h4>
        <p className="text-sm text-[#969696]">
          Bila dah ready, klik Publish untuk go live! Page anda akan dapat URL
          yang boleh di-share kepada pelanggan.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="more-options"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2">More Options ⚡</h4>
        <p className="text-sm text-[#969696]">
          Akses tetapan tambahan di sini:
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>
            • <b>SEO Settings</b> - Title, description untuk Google
          </li>
          <li>
            • <b>Tracking</b> - Facebook Pixel, GA4
          </li>
          <li>
            • <b>Custom Code</b> - Tambah script sendiri
          </li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Jom Mula Bina! 💪
        </h3>
        <p className="text-[#969696] mb-3">
          Pilih elemen dari panel kiri untuk mula membina sales page anda.
          Perubahan akan auto-save setiap beberapa saat.
        </p>
        <p className="text-xs text-[#969696]">
          💡 Tip: Guna Ctrl/Cmd + Z untuk undo jika ada silap.
        </p>
      </div>
    ),
    placement: 'center',
  },
];

interface BuilderWalkthroughProps {
  projectId: string;
}

export default function BuilderWalkthrough({
  projectId,
}: BuilderWalkthroughProps) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has completed builder walkthrough
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    if (!completed) {
      // Delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [projectId]);

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
export function resetBuilderWalkthrough() {
  localStorage.removeItem(WALKTHROUGH_KEY);
  window.location.reload();
}
