import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug, servicesList } from '@/lib/services-data';
import ServicePageClient from './ServicePageClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return servicesList.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  return {
    title: `${service.title} — Nexova`,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} — Nexova`,
      description: service.description,
      url: `/services/${service.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} — Nexova`,
      description: service.description,
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexova.co';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `${appUrl}/services/${service.slug}`,
        provider: {
          '@id': `${appUrl}/#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Malaysia',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: appUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: `${appUrl}/services`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: `${appUrl}/services/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePageClient service={service} />
    </>
  );
}
